using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ErrorLine.Dtos;
using ErrorLine.Services;
using System.Security.Claims;
using ErrorLine.Entities;
using ErrorLine.Exceptions;
using System.Text.Json.Serialization;

namespace ErrorLine.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class IssueReportController : ControllerBase
    {
        private readonly IIssueReportService _IssueReportService;

        public IssueReportController(IIssueReportService IssueReportService)
        {
            _IssueReportService = IssueReportService;
        }
        [Authorize(Roles = "MaintenanceManager")]
        [HttpGet("MaintenanceManager/Get/AllIssueReports")]
        public async Task<IActionResult> GetAllIssueReports()
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var issueReports = await _IssueReportService.GetAllIssueReportsAsync(userId);
                return Ok(new ApiResponseDto<object>(200, "Your dormitary's issues has been listed succesfully.", issueReports));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured"));
            }
        }
        [Authorize(Roles = "Student")]
        [HttpPost("Student/Create/IssueReport")]
        public async Task<IActionResult> CreateIssueReport([FromBody] CreateIssueReportDto issueReportDto)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var issue = await _IssueReportService.CreateIssueReportAsync(issueReportDto, userId);
                return Ok(new ApiResponseDto<object>(200, "Your issue has been created successfully.", issue));
            }
            catch(LocationNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (LocationNotInYourDormitaryException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (IssueTypeNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured"));
            }

        }


        [Authorize(Roles = "MaintenanceManager")]
        [HttpGet("MaintenanceManager/Get/IssueById/{issueId}")]
        public async Task<IActionResult> TrackIssueReport(int issueId)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var issueReport = await _IssueReportService.TrackIssueReportAsync(issueId, userId);
                return Ok(new ApiResponseDto<object>(200, "Issuereport has been found successfully.", issueReport));
            }
            catch (IssueReportNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
          
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured"));
            }
        }
        [Authorize(Roles = "Student")]
        [HttpGet("Student/Get/MyReports")]
        public async Task<IActionResult> GetUserIssueReports()
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var issueReport = await _IssueReportService.GetUserIssueReportsAsync(userId);
                return Ok(new ApiResponseDto<object>(200, "Your  issues has been listed succesfully.", issueReport));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured"));
            }

        }
        [Authorize(Roles = "Student")]
        [HttpDelete("Student/Delete/MyReport/{id}")]
        public async Task<IActionResult> DeleteReport(int id)
        {
            try
            {

                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                await _IssueReportService.DeleteReportAsync(id, userId);
                return Ok(new ApiResponseDto<object> (200,  "Issue has been deleted successfully" ));
            }
            catch(IssueReportNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (NotNewIssueReportException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (NotOwnIssueReportException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured"));
            }
        }
        [Authorize(Roles = "Student")]
        [HttpPatch("Student/ValidateIssue/{issueId}")]
        public async Task<IActionResult> MarkAsValidated(int issueId)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                await _IssueReportService.MarkAsValidatedAsync(issueId, userId);
                return Ok(new ApiResponseDto<object>(200, "Issue has been validated successfully"));
            }
            catch (IssueReportNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (NotOwnIssueReportException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (IssueReportNotCompletedException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured"));
            }
        }
        [Authorize(Roles = "Student")]
        [HttpPatch("Student/Change/Description/{issueId}")]
        public async Task<IActionResult> ChangeDescription(int issueId, [FromBody] string newDescription)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                await _IssueReportService.ChangeDescriptionAsync(issueId, userId, newDescription);
                return Ok(new ApiResponseDto<object>(200, "The Issue's description has been changed successfully"));
            }
            catch (IssueReportNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (NotOwnIssueReportException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (IssueReportCompletedOrValidatedOrClosedException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured"));
            }


        }
        [Authorize(Roles = "MaintenanceManager")]
        [HttpPatch("MaintenanceManager/AssignWorkerForIssue/{issueId}/{userId}")]
        public async Task<IActionResult> AssignWorker(int issueId, int userId)
        {
            try
            {
                var managerid = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                await _IssueReportService.AssignWorkerAsync(issueId, userId, managerid);
                return Ok(new ApiResponseDto<object>(200, "Worker has been assigned succesfully for the issue successfully"));
            }
            catch (IssueReportNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (NotNewIssueReportException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (WorkerAssignedAlreadyForIssueException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (UserNotFoundException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (UserIsNotMaintenanceWorker ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (UserIsNotInSameDormitaryAsIssueReportException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (UserIsNotInSameDormitaryAsYouException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured"));
            }

        }

        [Authorize(Roles = "MaintenanceManager")]
        [HttpPatch("MaintenanceManager/ChangeIssueStatus/{issueId}")]
        public async Task<IActionResult> ChangeIssueStatus(int issueId, [FromBody] IssueStatus status)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                await _IssueReportService.ChangeIssueStatusAsync(issueId, status, userId);
                return Ok(new ApiResponseDto<object>(200, "The issue's status has been changed succesfully"));
            }
            catch (IssueReportNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (ChangeIssueStatusToSameException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (UserIsNotInSameDormitaryAsIssueReportException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured"));
            }


        }
        [Authorize(Roles = "MaintenanceWorker")]
        [HttpGet("MaintenanceWorker/Get/ReportsAssignedToMe")]
        public async Task<IActionResult> GetWorkerIssueReports()
        {
            try
            {
                var UserId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var issueReports = await _IssueReportService.GetWorkerIssueReportsAsync(UserId);
                return Ok(new ApiResponseDto<object>(200, "Your issuereports has been listed succesfully.", issueReports));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured"));
            }
        }
        [Authorize(Roles = "MaintenanceWorker")]
        [HttpPatch("MaintenanceWorker/MarkIssueAsCompleted/{issueId}")]
        public async Task<IActionResult> MarkAsCompleted(int issueId)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                await _IssueReportService.MarkAsCompletedAsync(issueId, userId);
                return Ok(new ApiResponseDto<object>(200, "Your issuereport has been marked as completed succesfully."));
            }
            catch (IssueReportNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (IssueReportIsNotAssignedForToException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (IssueStatusIsNotInProgressException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured"));
            }

        }
        [Authorize(Roles = "Admin")]
        [HttpGet("Admin/Get/AllIssueTypes")]
        public async Task<IActionResult> GetIssueTypes()
        {
            try
            {
                var types = await _IssueReportService.GetIssueTypesAsync();
                return Ok(new ApiResponseDto<object>(200, "Issuereport types has been listed succesfully", types));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured"));
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("Admin/Get/IssueTypeById/{id}")]
        public async Task<IActionResult> GetIssueTypeById(int id)
        {
            try
            {
                var type = await _IssueReportService.GetIssueTypeByIdAsync(id);
                return Ok(new ApiResponseDto<object>(200, "Issuereport has been found succesfully", type));
            }
            catch (IssueTypeNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("Admin/Create/IssueType")]
        public async Task<IActionResult> CreateIssueType([FromBody] CreateIssueTypeDto issueReportDto)
        {
            try
            {

                var issuetype = await _IssueReportService.CreateIssueTypeAsync(issueReportDto);
                return Ok(new ApiResponseDto<object>(200, "Issuetype has been created succesfully", issuetype));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }


        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("Admin/Delete/IssueType/{id}")]
        public async Task<IActionResult> DeleteIssueType(int id)
        {
            try
            {

                await _IssueReportService.DeleteIssueTypeAsync(id);
                return Ok(new ApiResponseDto<object>(200, "Issuetype has been deleted successfully"));
            }
            catch (IssueTypeNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPatch("Admin/Update/IssueType/{id}")]
        public async Task<IActionResult> UpdateIssueType(int id, [FromBody] UpdateIssueTypeDto dto)
        {
            try
            {
                var issue = await _IssueReportService.UpdateIssueTypeAsync(id, dto);
                return Ok(new ApiResponseDto<object>(200, "Issuetype has been updated successfully"));
            }
            catch (IssueTypeNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [Authorize(Roles = "Student")]
        [HttpGet("Student/Get/IssueById/{issueId}")]
        public async Task<IActionResult> TrackStudentIssueReport(int issueId)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var issueReport = await _IssueReportService.TrackStudentIssueReportAsync(issueId, userId);
                return Ok(new ApiResponseDto<object>(200, "Issuereport has been found successfully.", issueReport));
            }
            catch (IssueReportNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }

            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured"));
            }
        }
    }
}
