using AutoMapper;
using ErrorLine.Context;
using ErrorLine.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErrorLine.Entities;
using ErrorLine.Exceptions;

namespace ErrorLine.Services
{
    public interface INoteService
    {

        Task<NoteDto> AddNoteAsync(int issueId, int userId, string desc);
        Task<IEnumerable<NoteDto>> MyNotesAsync(int userId);
        Task<IEnumerable<NoteDto>> AllNotessAsync(int u);
        Task<NoteDto> GetNoteByidAsync(int id, int u);
        Task DeleteNoteAsync(int NoteId, int userid);
        Task<bool> DeleteAnyNoteAsync(int NoteId, int userid);
        Task<NoteDto> UpdateNoteAsync(int id, NoteUpdateDto NoteDto, int userid);

    }
    public class NoteService :INoteService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public NoteService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<NoteDto> AddNoteAsync(int issueId, int userId, string desc)
        {
            var user = await _context.Users.FindAsync(userId);

            var issue = await _context.IssueReports
            .FirstOrDefaultAsync(ir => ir.Id == issueId);

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
            var note = new Note { IssueReportId = issueId, Text = desc, CreatedById = userId, CreatedAt = DateTime.Now };
            if (issue.Notes == null)
            {
                issue.Notes = new List<Note>(); 
            }
            issue.Notes.Add(note);
                await _context.SaveChangesAsync();
                return _mapper.Map<NoteDto>(note);
            
            
        }
        public async Task<IEnumerable<NoteDto>> MyNotesAsync(int userId)
        {
            
            var notes = await _context.Notes
        .Where(n => n.CreatedById == userId)
        .Include(n => n.IssueReport)  
        .ToListAsync();


           

           
            var noteDtos = _mapper.Map<List<NoteDto>>(notes);

            return noteDtos;
        }
        public async Task<IEnumerable<NoteDto>> AllNotessAsync(int userid)
        {
            var user = await _context.Users.FindAsync(userid);

            var notes = await _context.Notes.Include(n => n.IssueReport)
                .Where(n=>n.IssueReport.DormitoryId==user.DormitoryId)
         
         .ToListAsync();


            if (notes == null || !notes.Any())
            {
                return new List<NoteDto>();
            }

           
            var noteDtos = _mapper.Map<List<NoteDto>>(notes);

            return noteDtos;
        }
        public async Task<NoteDto> GetNoteByidAsync(int id,int userid)
        {
            var user = await _context.Users.FindAsync(userid);
            var note = await _context.Notes.Where(n=>n.IssueReport.DormitoryId==user.DormitoryId)
         .Include(n => n.IssueReport)  
         .FirstOrDefaultAsync(n=>n.Id==id);

            if (note == null)
            {
                throw new NoteNotFoundException();
            }


            
            return _mapper.Map<NoteDto>(note);

           
        }
        public async Task DeleteNoteAsync(int NoteId,int userid)
        {
            

            var note = await _context.Notes.FindAsync(NoteId);
            if (note == null)
            {
                throw new NoteNotFoundException();
            }
            if (note.CreatedById != userid)
            {
                throw new NoteIsNotYoursException();
            }
            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();

           
        }

        public async Task<bool> DeleteAnyNoteAsync(int NoteId, int userid)
        {
            var user = await _context.Users.FindAsync(userid);

            var note = await _context.Notes.Include(n => n.IssueReport).FirstOrDefaultAsync(n=>n.Id==NoteId);
            if (note == null)
            {
                throw new NoteNotFoundException();
            }
            if (note.IssueReport.DormitoryId != user.DormitoryId)
            {
                throw new NoteIsNotInYourDormitaryException();
            }
            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<NoteDto> UpdateNoteAsync(int id, NoteUpdateDto NoteDto,int userid)
        {
            var note = await _context.Notes.FindAsync(id);
            if (note == null)
            {
                throw new NoteNotFoundException();
            }
            if (note.CreatedById != userid)
            {
                throw new NoteIsNotYoursException();
            }

            _mapper.Map(NoteDto, note);
            _context.Notes.Update(note);
            await _context.SaveChangesAsync();

            return _mapper.Map<NoteDto>(note);
        }
    }
}
