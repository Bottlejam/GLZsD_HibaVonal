using ErrorLine.Dtos;
using ErrorLine.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ErrorLine.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class LocationController : ControllerBase
    {
        private readonly ILocationService _LocationService;

        public LocationController(ILocationService locationService)
        {
            _LocationService = locationService;
        }
        [HttpGet("Admin/Get/AllLocations")]
        public async Task<IActionResult> GetAllLocations()
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var locations = await _LocationService.GetAllLocationsAsync(userId);
            return Ok(locations);
        }
        [HttpGet("Admin/Get/LocationById/{id}")]
        public async Task<IActionResult> GetLocationById(int id)
        {
            var userid = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);   
            var locations = await _LocationService.GetLocationByIdAsync(id,userid);
            return Ok(locations);
        }
        [HttpPost("Admin/Create/Location")]
        public async Task<IActionResult> CreateEquipment([FromBody] CreateLocationDto dto)
        {
            var userid = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var issue = await _LocationService.AddLocationAsync(dto, userid);
            return Ok(issue);
        }
        [HttpDelete("Admin/Delete/Location/{id}")]
        public async Task<IActionResult> DeleteLocation(int id)
        {
            var userid = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var result = await _LocationService.DeleteLocationAsync(id, userid);
            if (result)
            {
                return NoContent();
            }
            return NotFound();
        }
        [HttpPut("Admin/Update/Location/{id}")]
        public async Task<IActionResult> UpdateNote(int id, [FromBody] UpdateLocationDto dto)
        {
            var userid = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var location = await _LocationService.UpdateLocationAsync(id, dto, userid);
            return Ok(location);
        }
    }
}
