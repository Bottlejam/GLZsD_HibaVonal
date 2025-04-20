using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ErrorLine.Dtos;
using ErrorLine.Services;
using System.Security.Claims;
using ErrorLine.Entities;

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
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var issueReports = await _IssueReportService.GetAllIssueReportsAsync(userId);
            return Ok(issueReports);
        }
        [Authorize(Roles = "Student")]
        [HttpPost("Student/Create/IssueReport")]
        public async Task<IActionResult> CreateIssueReport([FromBody] CreateIssueReportDto issueReportDto)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var issue = await _IssueReportService.CreateIssueReportAsync(issueReportDto, userId);
           
            return Ok(issue);
        }


        [Authorize(Roles = "MaintenanceManager")]
        [HttpGet("MaintenanceManager/Get/IssueById/{issueId}")]
        public async Task<IActionResult> TrackIssueReport(int issueId)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var issueReport = await _IssueReportService.TrackIssueReportAsync(issueId,userId);
            return Ok(issueReport);
        }
        [Authorize(Roles = "Student")]
        [HttpGet("Student/Get/MyReports")]
        public async Task<IActionResult> GetUserIssueReports()
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var issueReport = await _IssueReportService.GetUserIssueReportsAsync(userId);
            return Ok(issueReport);
        }
        [Authorize(Roles = "Student")]
        [HttpDelete("Student/Delete/MyReport/{id}")]
        public async Task<IActionResult> DeleteReport(int id)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var result = await _IssueReportService.DeleteReportAsync(id,userId);
            if (result)
            {
                return NoContent();
            }
            return NotFound();
        }
        [Authorize(Roles = "Student")]
        [HttpPatch("Student/ValidateIssue/{issueId}")]
        public async Task<IActionResult> MarkAsValidated(int issueId)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var result = await _IssueReportService.MarkAsValidatedAsync(issueId,userId);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Issue could not be validated.");
        }
        [Authorize(Roles = "Student")]
        [HttpPatch("Student/Change/Description/{issueId}")]
        public async Task<IActionResult> ChangeDescription(int issueId, [FromBody] string newDescription)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var result = await _IssueReportService.ChangeDescriptionAsync(issueId, userId,newDescription);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Description could not be changed.");
        }
        [Authorize(Roles = "MaintenanceManager")]
        [HttpPatch("MaintenanceManager/AssignWorkerForIssue/{issueId}/{userId}")]
        public async Task<IActionResult> AssignWorker(int issueId, int userId)
        {
            var managerid = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var result = await _IssueReportService.AssignWorkerAsync(issueId, userId,managerid);
            if (result)
            {
                return Ok("Worker assigned successfully.");
            }
            return BadRequest("Worker could not be assigned.");
        }

        [Authorize(Roles = "MaintenanceManager")]
        [HttpPatch("MaintenanceManager/ChangeIssueStatus/{issueId}")]
        public async Task<IActionResult> ChangeIssueStatus(int issueId, [FromBody] IssueStatus status)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var result = await _IssueReportService.ChangeIssueStatusAsync(issueId, status,userId);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Issue could not be validated.");
        }
        [Authorize(Roles = "MaintenanceWorker")]
        [HttpGet("MaintenanceWorker/Get/ReportsAssignedToMe")]
        public async Task<IActionResult> GetWorkerIssueReports()
        {
            var UserId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var issueReport = await _IssueReportService.GetWorkerIssueReportsAsync(UserId);
            return Ok(issueReport);
        }
        [Authorize(Roles = "MaintenanceWorker")]
        [HttpPatch("MaintenanceWorker/MarkIssueAsCompleted/{issueId}")]
        public async Task<IActionResult> MarkAsCompleted(int issueId)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var result = await _IssueReportService.MarkAsCompletedAsync(issueId, userId);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Issue could not be validated.");
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("Admin/Get/AllIssueTypes")]
        public async Task<IActionResult> GetIssueTypes()
        {
            var types = await _IssueReportService.GetIssueTypesAsync();
            return Ok(types);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("Admin/Get/IssueTypeById/{id}")]
        public async Task<IActionResult> GetIssueTypeById(int id)
        {
            var type = await _IssueReportService.GetIssueTypeByIdAsync( id);
            return Ok(type);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("Admin/Create/IssueType")]
        public async Task<IActionResult> CreateIssueType([FromBody] CreateIssueTypeDto issueReportDto)
        {
            
           
            var issuetype = await _IssueReportService.CreateIssueTypeAsync(issueReportDto);
            
            return Ok(issuetype);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("Admin/Delete/IssueType/{id}")]
        public async Task<IActionResult> DeleteIssueType(int id)
        {
            var result = await _IssueReportService.DeleteIssueTypeAsync(id);
            if (result)
            {
                return NoContent();
            }
            return NotFound();
        }
        [Authorize(Roles = "Admin")]
        [HttpPatch("Admin/Update/IssueType/{id}")]
        public async Task<IActionResult> UpdateIssueType(int id, [FromBody] UpdateIssueTypeDto dto)
        {
            var food = await _IssueReportService.UpdateIssueTypeAsync(id, dto);
            return Ok(food);
        }






    }
}
