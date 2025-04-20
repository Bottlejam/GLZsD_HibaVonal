using AutoMapper;
using ErrorLine.Context;
using ErrorLine.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErrorLine.Entities;

namespace ErrorLine.Services
{
    public interface INoteService
    {

        Task<NoteDto> AddNoteAsync(int issueId, int userId, string desc);
        Task<IEnumerable<NoteDto>> MyNotesAsync(int userId);
        Task<IEnumerable<NoteDto>> AllNotessAsync(int u);
        Task<NoteDto> GetNoteByidAsync(int id, int u);
        Task<bool> DeleteNoteAsync(int NoteId, int userid);
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
                throw new KeyNotFoundException("Issue not found.");
            }
            if (issue.ReporterId != userId)
            {
                throw new UnauthorizedAccessException("You are not allowed to add note to this issue");
            }
            if (issue.IssueStatus != IssueStatus.Completed)
            {
                throw new InvalidOperationException("You can only add a note after the issue has been marked as completed.");
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
            
            var notes = await _context.Note
        .Where(n => n.CreatedById == userId)
        .Include(n => n.IssueReport)  
        .ToListAsync();


           

           
            var noteDtos = _mapper.Map<List<NoteDto>>(notes);

            return noteDtos;
        }
        public async Task<IEnumerable<NoteDto>> AllNotessAsync(int userid)
        {
            var user = await _context.Users.FindAsync(userid);

            var notes = await _context.Note.Include(n => n.IssueReport)
                .Where(n=>n.IssueReport.DormitaryId==user.DormitaryId)
         
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
            var note = await _context.Note.Where(n=>n.IssueReport.DormitaryId==user.DormitaryId)
         .Include(n => n.IssueReport)  
         .FirstOrDefaultAsync(n=>n.Id==id);

            if (note == null)
            {
                throw new KeyNotFoundException("Note not found.");
            }


            
            return _mapper.Map<NoteDto>(note);

           
        }
        public async Task<bool> DeleteNoteAsync(int NoteId,int userid)
        {
            

            var note = await _context.Note.FindAsync(NoteId);
            if (note == null)
            {
                throw new KeyNotFoundException("Note not found.");
            }
            if (note.CreatedById != userid)
            {
                throw new UnauthorizedAccessException("You are not allowed to delete another user's note");
            }
            _context.Note.Remove(note);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAnyNoteAsync(int NoteId, int userid)
        {
            var user = await _context.Users.FindAsync(userid);

            var note = await _context.Note.Include(n => n.IssueReport).FirstOrDefaultAsync(n=>n.Id==NoteId);
            if (note == null)
            {
                throw new KeyNotFoundException("Note not found.");
            }
            if (note.IssueReport.DormitaryId != user.DormitaryId)
            {
                throw new UnauthorizedAccessException("You are not allowed to delete user's note from another dormitary");
            }
            _context.Note.Remove(note);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<NoteDto> UpdateNoteAsync(int id, NoteUpdateDto NoteDto,int userid)
        {
            var note = await _context.Note.FindAsync(id);
            if (note == null)
            {
                throw new KeyNotFoundException("note not found.");
            }
            if (note.CreatedById != userid)
            {
                throw new UnauthorizedAccessException("You are not allowed to update another user's note");
            }

            _mapper.Map(NoteDto, note);
            _context.Note.Update(note);
            await _context.SaveChangesAsync();

            return _mapper.Map<NoteDto>(note);
        }
    }
}
