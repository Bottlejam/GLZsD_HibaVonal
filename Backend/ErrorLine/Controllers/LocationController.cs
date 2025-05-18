using ErrorLine.Dtos;
using ErrorLine.Entities;
using ErrorLine.Exceptions;
using ErrorLine.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ErrorLine.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class LocationController : ControllerBase
    {
        private readonly ILocationService _LocationService;

        public LocationController(ILocationService locationService)
        {
            _LocationService = locationService;
        }
        [Authorize(Roles = "Student,Admin")]
        [HttpGet("Admin/Get/AllLocations")]
        public async Task<IActionResult> GetAllLocations()
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var locations = await _LocationService.GetAllLocationsAsync(userId);
                return Ok(new ApiResponseDto<object>(200, "Locations has been listed succesfully.",locations));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [Authorize(Roles = "Student,Admin")]
        [HttpGet("Admin/Get/LocationById/{id}")]
        public async Task<IActionResult> GetLocationById(int id)
        {
            try
            {

                var userid = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var locations = await _LocationService.GetLocationByIdAsync(id, userid);
                return Ok(new ApiResponseDto<object>(200, "Location has been found succesfully.", locations));
            }
            catch (LocationNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (LocationNotInYourDormitaryException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("Admin/Create/Location")]
        public async Task<IActionResult> CreateLocation([FromBody] CreateLocationDto dto)
        {
            try
            {
                var userid = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var location = await _LocationService.AddLocationAsync(dto, userid);
                return Ok(new ApiResponseDto<object>(200, "Location has been created succesfully.", location));
            }
            catch (LocationAlreadyExistsException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("Admin/Delete/Location/{id}")]
        public async Task<IActionResult> DeleteLocation(int id)
        {
            try
            {
                var userid = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                await _LocationService.DeleteLocationAsync(id, userid);
                return Ok(new ApiResponseDto<object>(200, "Location has been deleted succesfully."));
            }
            catch (LocationNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (LocationNotInYourDormitaryException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }


        }
        [Authorize(Roles = "Admin")]
        [HttpPut("Admin/Update/Location/{id}")]
        public async Task<IActionResult> UpdateLocation(int id, [FromBody] UpdateLocationDto dto)
        {
            try
            {
                var userid = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var location = await _LocationService.UpdateLocationAsync(id, dto, userid);
                return Ok(new ApiResponseDto<object>(200, "Location has been deleted succesfully.", location));
            }
            catch (LocationNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (LocationNotInYourDormitaryException ex)
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
