using ErrorLine.Dtos;
using ErrorLine.Exceptions;
using ErrorLine.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ErrorLine.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "SystemAdmin")]
    public class DormitoryController : ControllerBase
    {
        private readonly IDormitaryService _DormitoryService;

        public DormitoryController(IDormitaryService dormitaryService)
        {
            _DormitoryService = dormitaryService;
        }
        [HttpGet("SystemAdmin/Get/AllDormitorories")]
        public async Task<IActionResult> GetAllDormitories()
        {
            try
            {
               
                var dormitories = await _DormitoryService.GetAllDormitoriesAsync();
                return Ok(new ApiResponseDto<object>(200, "Dormitories has been listed succesfully.", dormitories));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [HttpGet("SystemAdmin/Get/DormitoryById/{id}")]
        public async Task<IActionResult> GetDormitoryById(int id)
        {
            try
            {

               
                var dormitory = await _DormitoryService.GetDormitoryByIdAsync(id);
                return Ok(new ApiResponseDto<object>(200, "Dormitory has been found succesfully.", dormitory));
            }
            catch (DormitoryNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [HttpPost("SystemAdmin/Create/Dormitory")]
        public async Task<IActionResult> CreateDormitory([FromBody] CreateDormitoryDto dto)
        {
            try
            {
               
                var dormitory = await _DormitoryService.AddDormitoryAsync(dto);
                return Ok(new ApiResponseDto<object>(200, "Dormitory has been created succesfully.", dormitory));
            }
            catch (DormitoryWithThisAddressAlereadyExistsException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [HttpDelete("SystemAdmin/Delete/Dormitory/{id}")]
        public async Task<IActionResult> DeleteDormitory(int id)
        {
            try
            {
                
                await _DormitoryService.DeleteDormitoryAsync(id);
                return Ok(new ApiResponseDto<object>(200, "Dormitory has been deleted succesfully."));
            }
            catch (DormitoryNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }


        }
        [HttpPut("SystemAdmin/Update/Location/{id}")]
        public async Task<IActionResult> UpdateDomritory(int id, [FromBody] UpdateDormitoryDto dto)
        {
            try
            {
               
                var location = await _DormitoryService.UpdateDormitoryAsync(id, dto);
                return Ok(new ApiResponseDto<object>(200, "Dormitory has been updated succesfully.", location));
            }
            catch (DormitoryNotFoundException ex)
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
