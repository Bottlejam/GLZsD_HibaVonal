using ErrorLine.Dtos;
using ErrorLine.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ErrorLine.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NoteController : ControllerBase
    {
        private readonly INoteService _NoteService;

        public NoteController(INoteService NoteService)
        {
            _NoteService = NoteService;
        }
        [Authorize(Roles = "Student")]
        [HttpGet("Student/Get/MyNotes")]
        public async Task<IActionResult> GetUserNotes()
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var issueReportsWithNotes = await _NoteService.MyNotesAsync(userId);

           

            return Ok(issueReportsWithNotes);
        }
        [Authorize(Roles = "Student")]
        [HttpPost("Student/Create/Note/{issueId}")]
        public async Task<IActionResult> CreateNote(int issueId,[FromBody] NoteCreateDto text)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var note = await _NoteService.AddNoteAsync(issueId, userId,text.Text);
            return Ok(note);
        }
        [Authorize(Roles = "MaintenanceManager")]
        [HttpGet("MaintenanceManager/Get/AllNotes")]
        public async Task<IActionResult> GetAllNotes()
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var note = await _NoteService.AllNotessAsync(userId);

            

            return Ok(note);
        }
        [Authorize(Roles = "MaintenanceManager")]
        [HttpGet("MaintenanceManager/Get/NoteById/{id}")]
        public async Task<IActionResult> GetNoteById(int id)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var note = await _NoteService.GetNoteByidAsync(id,userId);
            if (note == null)
            {
                throw new KeyNotFoundException("Note not found.");
            }


            return Ok(note);
        }
        [Authorize(Roles = "Student")]
        [HttpDelete("Student/Delete/Note/{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var result = await _NoteService.DeleteNoteAsync(id,userId);
            if (result)
            {
                return NoContent();
            }
            return NotFound();
        }
        [Authorize(Roles = "MaintenanceManager")]
        [HttpDelete("MaintenanceManager/Delete/Note/{id}")]
        public async Task<IActionResult> DeleteAnyNote(int id)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var result = await _NoteService.DeleteAnyNoteAsync(id, userId);
            if (result)
            {
                return NoContent();
            }
            return NotFound();
        }
        [Authorize(Roles = "Student")]
        [HttpPatch("Student/Update/Note/{id}")]
        public async Task<IActionResult> UpdateNote(int id, [FromBody] NoteUpdateDto dto)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var note = await _NoteService.UpdateNoteAsync(id, dto,userId);
            return Ok(note);
        }
    }
}
