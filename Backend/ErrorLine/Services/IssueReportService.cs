using AutoMapper;
using ErrorLine.Context;
using ErrorLine.Dtos;
using ErrorLine.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ErrorLine.Exceptions;

namespace ErrorLine.Services
{
    public interface IIssueReportService
    {
        Task<IEnumerable<IssueReportDto>> GetAllIssueReportsAsync(int userid);
        Task<IssueReportDto> CreateIssueReportAsync(CreateIssueReportDto dto, int userId);
        Task DeleteReportAsync(int issueid, int userid);
        Task<IssueReportDto> TrackIssueReportAsync(int issueId, int u);
        Task<IEnumerable<IssueReportDto>> GetUserIssueReportsAsync(int userId);
        Task MarkAsValidatedAsync(int issueId, int userId);
        Task ChangeDescriptionAsync(int issueId, int userId,string newdesc);
        Task AssignWorkerAsync(int issueId, int userId,int managerid);
        Task ChangeIssueStatusAsync(int issueId, IssueStatus status, int userid);
        Task<IEnumerable<IssueReportDto>> GetWorkerIssueReportsAsync(int userId);
        Task MarkAsCompletedAsync(int issueId, int userId);
        Task<IEnumerable<IssueTypeDto>> GetIssueTypesAsync();
        Task<IssueTypeDto> GetIssueTypeByIdAsync(int id);
        Task<IssueTypeDto> CreateIssueTypeAsync(CreateIssueTypeDto dto);
        Task DeleteIssueTypeAsync(int issuetypeid);
        
        Task<IssueTypeDto> UpdateIssueTypeAsync(int id, UpdateIssueTypeDto issuetypeDto);

        Task<IssueReportDto> TrackStudentIssueReportAsync(int issueId, int userId);

    }
    public class IssueReportService:IIssueReportService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public IssueReportService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<IssueReportDto>> GetAllIssueReportsAsync(int userid)
        {
            var user = await _context.Users.FindAsync(userid);
            var issueReports = await _context.IssueReports.Where(i=>i.DormitoryId==user.DormitoryId)
                .Include(i => i.Reporter)
                .Include(i => i.IssueType)
                .Include(i => i.Dormitory)
                .Include(i=>i.Location)
                .Include(i=>i.AssignedWorker)
                .ToListAsync();
            return _mapper.Map<IEnumerable<IssueReportDto>>(issueReports);
        }
        public async Task DeleteReportAsync(int issueid,int userid)
        {
            var issuereport= await _context.IssueReports.FindAsync(issueid);
            if (issuereport == null)
            {
                throw new IssueReportNotFoundException();
            }
            if(issuereport.IssueStatus !=IssueStatus.New)
            {
                throw new NotNewIssueReportException();
            }
            if (issuereport.ReporterId != userid)
            {
                throw new NotOwnIssueReportException();
            }

            _context.IssueReports.Remove(issuereport);
            await _context.SaveChangesAsync();

            
        }

       

        public async Task<IssueReportDto> CreateIssueReportAsync(CreateIssueReportDto dto,int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            var location = await _context.Locations.FindAsync(dto.LocationId);

            if (location == null)
            {

                throw new LocationNotFoundException();

            }

            if (location.DormitoryId != user.DormitoryId)
            {
                throw new LocationNotInYourDormitaryException();
            }
            if (!_context.IssueTypes.Any(i => i.Id == dto.IssueTypeId))
            {
                throw new IssueTypeNotFoundException();
            }
            

            


            var report = new IssueReport
            {
                Description = dto.Description,
                Date = DateOnly.FromDateTime(DateTime.Now),
                LocationId = location.Id,
                ReporterId = userId,
                IssueTypeId = (int)dto.IssueTypeId,
                DormitoryId = user.DormitoryId ?? 0,
                IssueStatus = IssueStatus.New
            };

            await _context.IssueReports.AddAsync(report);
            await _context.SaveChangesAsync();

            var fullReport = await _context.IssueReports
               .Include(r => r.Location)
               .ThenInclude(l => l.Dormitory)
               .Include(r => r.IssueType)
               .Include(r => r.Reporter)
               .FirstOrDefaultAsync(r => r.Id == report.Id);

            return _mapper.Map<IssueReportDto>(fullReport);
        }



            public async Task<IssueReportDto> TrackIssueReportAsync(int issueId,int userId)
            {
            var user = await _context.Users.FindAsync(userId);
            var issueReport = await _context.IssueReports.Where(i=>i.DormitoryId==user.DormitoryId)
                .Include(r => r.Location)
                .ThenInclude(l => l.Dormitory)
                .Include(r => r.IssueType)
                .Include(r => r.Reporter)
                .FirstOrDefaultAsync(r => r.Id == issueId);

            if (issueReport == null)
                {
                    throw new IssueReportNotFoundException();
                }
         
            return _mapper.Map<IssueReportDto>(issueReport);
            }

        public async Task<IEnumerable<IssueReportDto>> GetUserIssueReportsAsync(int userId)
        {
            var issueReports = await _context.IssueReports
                .Where(o => o.ReporterId == userId)
                .Include(o => o.Location)
                    .ThenInclude(i => i.Dormitory)
                .Include(o => o.IssueType)
                .Include(o => o.Reporter)
                .Include(o=>o.Notes)
                .ToListAsync();

            return _mapper.Map<IEnumerable<IssueReportDto>>(issueReports);
        }

        public async Task MarkAsValidatedAsync(int issueId,int userId)
        {
            var issue = await _context.IssueReports.FindAsync(issueId);
            if (issue == null)
            {
                throw new IssueReportNotFoundException();
            }
            if (issue.ReporterId != userId)
            {
                throw new NotOwnIssueReportException();
            }
            if (issue.IssueStatus != IssueStatus.Completed)
            {
                throw new IssueReportNotCompletedException();
            }

            issue.IssueStatus = IssueStatus.Validated;
            await _context.SaveChangesAsync();
         
        }

        public async Task ChangeDescriptionAsync(int issueId,int userId,string desc)
        {
            var issue=await _context.IssueReports.FindAsync(issueId);
            if (issue == null)
            {
                throw new IssueReportNotFoundException();
            }
            if (issue.ReporterId != userId)
            {
                throw new NotOwnIssueReportException();
            }
            if (issue.IssueStatus == IssueStatus.Completed || issue.IssueStatus == IssueStatus.Validated || issue.IssueStatus==IssueStatus.Closed)
            {
                throw new IssueReportCompletedOrValidatedOrClosedException();
            }
            issue.Description = desc;
            await _context.SaveChangesAsync();
            
        }
        public async Task AssignWorkerAsync(int issueId,int userId,int managerId)
        {
            var issue = await _context.IssueReports.FindAsync(issueId);
            if (issue == null)
            {
                throw new IssueReportNotFoundException();
            }
            if (issue.IssueStatus != IssueStatus.New)
            {
                throw new NotNewIssueReportException();
            }
            if (issue.AssignedWorkerId != null)
            {
                throw new WorkerAssignedAlreadyForIssueException();
            }
            var user = await _context.Users.FindAsync(userId);
            var manager = await _context.Users.FindAsync(managerId);
            if (user == null)
            {
                throw new UserNotFoundException();
            }
            if (user.Role != UserRole.MaintenanceWorker)
                {
                throw new UserIsNotMaintenanceWorker();
                }
            if (issue.DormitoryId != user.DormitoryId)
            {
                throw new UserIsNotInSameDormitaryAsIssueReportException();
            }
            if (user.DormitoryId != manager.DormitoryId)
            {
                throw new UserIsNotInSameDormitaryAsYouException();
            }
            issue.AssignedWorkerId = userId;
            issue.IssueStatus = IssueStatus.InProgress;
            await _context.SaveChangesAsync();
            
        }
      
        public async Task ChangeIssueStatusAsync(int issueId, IssueStatus status,int userId)
        {
            var issue = await _context.IssueReports.FindAsync(issueId);
            if (issue == null)
            {
                throw new IssueReportNotFoundException();
            }

            if (issue.IssueStatus == status)
            {
                throw new ChangeIssueStatusToSameException();
            }
            var user = await _context.Users.FindAsync(userId);
            if (issue.DormitoryId!=user.DormitoryId)
            {
                throw new UserIsNotInSameDormitaryAsIssueReportException();
            }    
                issue.IssueStatus = status;
                await _context.SaveChangesAsync();
              
        }

        public async Task<IEnumerable<IssueReportDto>> GetWorkerIssueReportsAsync(int userId)
        {
            var issueReports = await _context.IssueReports
                .Where(o => o.AssignedWorkerId == userId)
                .Include(o => o.Location)
                    .ThenInclude(i => i.Dormitory)
                .Include(o => o.IssueType)
                .Include(o => o.Reporter)
                .ToListAsync();

            return _mapper.Map<IEnumerable<IssueReportDto>>(issueReports);
         
        }

        public async Task MarkAsCompletedAsync(int issueId, int userId)
        {
            var issue = await _context.IssueReports.FindAsync(issueId);
            if (issue == null)
            {
                throw new IssueReportNotFoundException();
            }
            if (issue.AssignedWorkerId != userId)
            {
                throw new IssueReportIsNotAssignedForToException();
            }
            if (issue.IssueStatus != IssueStatus.InProgress)
            {
                throw new IssueStatusIsNotInProgressException();
            }

            issue.IssueStatus = IssueStatus.Completed;
            await _context.SaveChangesAsync();
           
        }

        public async Task<IEnumerable<IssueTypeDto>> GetIssueTypesAsync()
        {
            var types = await _context.IssueTypes.ToListAsync();
            return types.Select(_mapper.Map<IssueTypeDto>);
        }
        public async Task<IssueTypeDto> GetIssueTypeByIdAsync(int id)
        {
            var type = await _context.IssueTypes.FirstOrDefaultAsync(t=>t.Id==id);
            if (type == null)
            {
                throw new IssueTypeNotFoundException();
            }
            return _mapper.Map<IssueTypeDto>(type);
            
        }

        public async Task<IssueTypeDto> CreateIssueTypeAsync(CreateIssueTypeDto dto)
        {
            var Issuetype = new IssueType { Name=dto.Name};
            await _context.IssueTypes.AddAsync(Issuetype);
            await _context.SaveChangesAsync();
            return _mapper.Map<IssueTypeDto>(Issuetype);
        }

        public async Task DeleteIssueTypeAsync(int issuetypeid)
        {
            var Issuetype = await _context.IssueTypes.FindAsync(issuetypeid);
            if (Issuetype == null)
            {
                throw new IssueTypeNotFoundException();
            }
            _context.IssueTypes.Remove(Issuetype);
            await _context.SaveChangesAsync();

           
        }

        public async Task<IssueTypeDto> UpdateIssueTypeAsync(int id, UpdateIssueTypeDto issuetypeDto)
        {
            var issueType = await _context.IssueTypes.FindAsync(id);
            if (issueType == null)
            {
                throw new IssueTypeNotFoundException();
            }

            _mapper.Map(issuetypeDto,issueType );
            _context.IssueTypes.Update(issueType);
            await _context.SaveChangesAsync();

            return _mapper.Map<IssueTypeDto>(issueType);
        }

        public async Task<IssueReportDto> TrackStudentIssueReportAsync(int issueId, int userId)
        {

            var issueReport = await _context.IssueReports.Where(i => i.ReporterId == userId)
                .Include(r => r.Location)
                .ThenInclude(l => l.Dormitory)
                .Include(r => r.IssueType)
                .Include(r => r.Reporter)
                .FirstOrDefaultAsync(r => r.Id == issueId);

            if (issueReport == null)
            {
                throw new IssueReportNotFoundException();
            }

            return _mapper.Map<IssueReportDto>(issueReport);
        }




    }
}
