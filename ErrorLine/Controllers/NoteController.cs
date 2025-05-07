using ErrorLine.Dtos;
using ErrorLine.Entities;
using ErrorLine.Exceptions;
using ErrorLine.Migrations;
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
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var issueReportsWithNotes = await _NoteService.MyNotesAsync(userId);
                return Ok(new ApiResponseDto<object>(200, "Your notes  has been listed succesfully.", issueReportsWithNotes));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }



        }
        [Authorize(Roles = "Student")]
        [HttpPost("Student/Create/Note/{issueId}")]
        public async Task<IActionResult> CreateNote(int issueId,[FromBody] NoteCreateDto text)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var note = await _NoteService.AddNoteAsync(issueId, userId, text.Text);
                return Ok(new ApiResponseDto<object>(200, "Note  has been created succesfully.", note));
            }
            catch (IssueReportNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (NotOwnIssueReportException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (IssueReportNotCompletedException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }

            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [Authorize(Roles = "MaintenanceManager")]
        [HttpGet("MaintenanceManager/Get/AllNotes")]
        public async Task<IActionResult> GetAllNotes()
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var notes = await _NoteService.AllNotessAsync(userId);
                return Ok(new ApiResponseDto<object>(200, "Your dormitary's issue notes has been listed succesfully.", notes));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }




        }
        [Authorize(Roles = "MaintenanceManager")]
        [HttpGet("MaintenanceManager/Get/NoteById/{id}")]
        public async Task<IActionResult> GetNoteById(int id)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var note = await _NoteService.GetNoteByidAsync(id, userId);
                return Ok(new ApiResponseDto<object>(200, "Note has been found successfully.", note));
            }
            catch (NoteNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }



        }
        [Authorize(Roles = "Student")]
        [HttpDelete("Student/Delete/Note/{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                await _NoteService.DeleteNoteAsync(id, userId);
                return Ok(new ApiResponseDto<object>(200, "Note has been deleted successfully."));
            }
            catch (NoteNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (NoteIsNotYoursException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [Authorize(Roles = "MaintenanceManager")]
        [HttpDelete("MaintenanceManager/Delete/Note/{id}")]
        public async Task<IActionResult> DeleteAnyNote(int id)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var result = await _NoteService.DeleteAnyNoteAsync(id, userId);
                return Ok(new ApiResponseDto<object>(200, "Note has been deleted successfully."));
            }
            catch (NoteNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (NoteIsNotYourDormitaryException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }

        }
        [Authorize(Roles = "Student")]
        [HttpPatch("Student/Update/Note/{id}")]
        public async Task<IActionResult> UpdateNote(int id, [FromBody] NoteUpdateDto dto)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var note = await _NoteService.UpdateNoteAsync(id, dto, userId);
                return Ok(new ApiResponseDto<object>(200, "Note has been updated successfully.", note));
            }
            catch (NoteNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (NoteIsNotYoursException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
    }
}
