using AutoMapper;
using ErrorLine.Context;
using ErrorLine.Dtos;
using ErrorLine.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ErrorLine.Services
{
    public interface IIssueReportService
    {
        Task<IEnumerable<IssueReportDto>> GetAllIssueReportsAsync(int userid);
        Task<IssueReportDto> CreateIssueReportAsync(CreateIssueReportDto dto, int userId);
        Task<bool> DeleteReportAsync(int issueid, int userid);
        Task<IssueReportDto> TrackIssueReportAsync(int issueId, int u);
        Task<IEnumerable<IssueReportDto>> GetUserIssueReportsAsync(int userId);
        Task<bool> MarkAsValidatedAsync(int issueId, int userId);
        Task<bool> ChangeDescriptionAsync(int issueId, int userId,string newdesc);
        Task<bool> AssignWorkerAsync(int issueId, int userId,int managerid);
        Task<bool> ChangeIssueStatusAsync(int issueId, IssueStatus status, int userid);
        Task<IEnumerable<IssueReportDto>> GetWorkerIssueReportsAsync(int userId);
        Task<bool> MarkAsCompletedAsync(int issueId, int userId);
        Task<IEnumerable<IssueTypeDto>> GetIssueTypesAsync();
        Task<IssueTypeDto> GetIssueTypeByIdAsync(int id);
        Task<IssueTypeDto> CreateIssueTypeAsync(CreateIssueTypeDto dto);
        Task<bool> DeleteIssueTypeAsync(int issuetypeid);
        
        Task<IssueTypeDto> UpdateIssueTypeAsync(int id, UpdateIssueTypeDto issuetypeDto);


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
            var issueReports = await _context.IssueReports.Where(i=>i.DormitaryId==user.DormitaryId)
                .Include(i => i.Reporter)
                .Include(i => i.IssueType)
                .Include(i => i.Dormitary)
                .Include(i=>i.Location)
                .Include(i=>i.AssignedWorker)
                .ToListAsync();
            return _mapper.Map<IEnumerable<IssueReportDto>>(issueReports);
        }
        public async Task<bool> DeleteReportAsync(int issueid,int userid)
        {
            var issuereport= await _context.IssueReports.FindAsync(issueid);
            if (issuereport == null)
            {
                throw new KeyNotFoundException("Issuereport not found.");
            }
            if(issuereport.IssueStatus !=IssueStatus.New)
            {
                throw new InvalidOperationException("You can only delete new issues.");
            }
            if (issuereport.ReporterId != userid)
            {
                throw new UnauthorizedAccessException("You are not authorized to delete this issue.");
            }

            _context.IssueReports.Remove(issuereport);
            await _context.SaveChangesAsync();

            return true;
        }

       

        public async Task<IssueReportDto> CreateIssueReportAsync(CreateIssueReportDto dto,int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            var location = await _context.Locations.FindAsync(dto.LocationId);

            if (location == null)
            {

                throw new KeyNotFoundException("Location not found.");

            }

            if (location.DormitaryId != user.DormitaryId)
            {
                throw new UnauthorizedAccessException("You are not authorized to create issue report for another dorm");
            }
            

            


            var report = new IssueReport
            {
                Description = dto.Description,
                Date = DateOnly.FromDateTime(DateTime.Now),
                LocationId = location.Id,
                ReporterId = userId,
                IssueTypeId = (int)dto.IssueTypeId,
                DormitaryId = user.DormitaryId,
                IssueStatus = IssueStatus.New
            };

            await _context.IssueReports.AddAsync(report);
            await _context.SaveChangesAsync();

            var fullReport = await _context.IssueReports
               .Include(r => r.Location)
               .ThenInclude(l => l.Dormitary)
               .Include(r => r.IssueType)
               .Include(r => r.Reporter)
               .FirstOrDefaultAsync(r => r.Id == report.Id);

            return _mapper.Map<IssueReportDto>(fullReport);
        }



            public async Task<IssueReportDto> TrackIssueReportAsync(int issueId,int userId)
            {
            var user = await _context.Users.FindAsync(userId);
            var issueReport = await _context.IssueReports.Where(i=>i.DormitaryId==user.DormitaryId)
                .Include(r => r.Location)
                .ThenInclude(l => l.Dormitary)
                .Include(r => r.IssueType)
                .Include(r => r.Reporter)
                .FirstOrDefaultAsync(r => r.Id == issueId);

            if (issueReport == null)
                {
                    throw new KeyNotFoundException("Issue report not found.");
                }
                return _mapper.Map<IssueReportDto>(issueReport);
            }

        public async Task<IEnumerable<IssueReportDto>> GetUserIssueReportsAsync(int userId)
        {
            var issueReports = await _context.IssueReports
                .Where(o => o.ReporterId == userId)
                .Include(o => o.Location)
                    .ThenInclude(i => i.Dormitary)
                .Include(o => o.IssueType)
                .Include(o => o.Reporter)
                .ToListAsync();

            return _mapper.Map<IEnumerable<IssueReportDto>>(issueReports);
        }

        public async Task<bool> MarkAsValidatedAsync(int issueId,int userId)
        {
            var issue = await _context.IssueReports.FindAsync(issueId);
            if (issue == null)
            {
                throw new KeyNotFoundException("Issue not found.");
            }
            if (issue.ReporterId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to validate this issue.");
            }
            if (issue.IssueStatus == IssueStatus.Completed)
            {
                issue.IssueStatus = IssueStatus.Validated;
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> ChangeDescriptionAsync(int issueId,int userId,string desc)
        {
            var issue=await _context.IssueReports.FindAsync(issueId);
            if (issue == null)
            {
                throw new KeyNotFoundException("Issue not found.");
            }
            if (issue.ReporterId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to change this report's description.");
            }
            if (issue.IssueStatus == IssueStatus.Completed || issue.IssueStatus == IssueStatus.Validated)
            {
                throw new InvalidOperationException("You can't change this issue's description ");
            }
            issue.Description = desc;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> AssignWorkerAsync(int issueId,int userId,int managerId)
        {
            var issue = await _context.IssueReports.FindAsync(issueId);
            if (issue == null)
            {
                throw new KeyNotFoundException("Issue not found.");
            }
            if (issue.IssueStatus == IssueStatus.New)
            {
                throw new InvalidOperationException("You can only assign a worker for a new issue.");
            }
            if (issue.AssignedWorkerId != null)
            {
                throw new InvalidOperationException("A worker has been assigned already to this issuereport");
            }
            var user = await _context.Users.FindAsync(userId);
            var manager = await _context.Users.FindAsync(managerId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }
            if (user.Role != UserRole.MaintenanceWorker)
                {
                throw new InvalidOperationException("You can only assign maintenance workers for an issue ");
                }
            if (issue.DormitaryId != user.DormitaryId)
            {
                throw new InvalidOperationException("You can only assign this dormitary's maintenance workers for an issue ");
            }
            if (user.DormitaryId != manager.DormitaryId)
            {
                throw new InvalidOperationException("You can't  assign maintenance worker from another dormitary");
            }
            issue.AssignedWorkerId = userId;
            issue.IssueStatus = IssueStatus.InProgress;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> ChangeIssueStatusAsync(int issueId, IssueStatus status,int userId)
        {
            var issue = await _context.IssueReports.FindAsync(issueId);
            if (issue == null)
            {
                throw new KeyNotFoundException("Issue not found.");
            }

            if (issue.IssueStatus == status)
            {
                throw new InvalidOperationException("This is the issue's current status");
            }
            var user = await _context.Users.FindAsync(userId);
            if (issue.DormitaryId!=user.DormitaryId)
            {
                throw new InvalidOperationException("You can't change an another dormitary's issue status");
            }    
                issue.IssueStatus = status;
                await _context.SaveChangesAsync();
                return true;
        }

        public async Task<IEnumerable<IssueReportDto>> GetWorkerIssueReportsAsync(int userId)
        {
            var issueReports = await _context.IssueReports
                .Where(o => o.AssignedWorkerId == userId)
                .Include(o => o.Location)
                    .ThenInclude(i => i.Dormitary)
                .Include(o => o.IssueType)
                .Include(o => o.Reporter)
                .ToListAsync();

            return _mapper.Map<IEnumerable<IssueReportDto>>(issueReports);
         
        }

        public async Task<bool> MarkAsCompletedAsync(int issueId, int userId)
        {
            var issue = await _context.IssueReports.FindAsync(issueId);
            if (issue == null)
            {
                throw new KeyNotFoundException("Issue not found.");
            }
            if (issue.AssignedWorkerId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to set this issue to completed.");
            }
            if (issue.IssueStatus != IssueStatus.InProgress)
            {
                throw new InvalidOperationException("This issue's repair is not in progress.");
            }

            issue.IssueStatus = IssueStatus.Completed;
            await _context.SaveChangesAsync();
            return true;
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
                throw new KeyNotFoundException("Issuetype not found.");
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

        public async Task<bool> DeleteIssueTypeAsync(int issuetypeid)
        {
            var Issuetype = await _context.IssueTypes.FindAsync(issuetypeid);
            if (Issuetype == null)
            {
                throw new KeyNotFoundException("Issuetype not found.");
            }
            _context.IssueTypes.Remove(Issuetype);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IssueTypeDto> UpdateIssueTypeAsync(int id, UpdateIssueTypeDto issuetypeDto)
        {
            var issueType = await _context.IssueTypes.FindAsync(id);
            if (issueType == null)
            {
                throw new KeyNotFoundException("Issuetype not found.");
            }

            _mapper.Map(issuetypeDto,issueType );
            _context.IssueTypes.Update(issueType);
            await _context.SaveChangesAsync();

            return _mapper.Map<IssueTypeDto>(issueType);
        }






    }
}
