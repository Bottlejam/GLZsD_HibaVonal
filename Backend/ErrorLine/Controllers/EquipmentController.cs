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
    
    public class EquipmentController : ControllerBase
    {
        private readonly IEquipmentService _EquipmentService;

        public EquipmentController(IEquipmentService EqupmentService)
        {
            _EquipmentService = EqupmentService;
        }
        [Authorize(Roles = "Admin,MaintenanceManager,MaintenanceWorker")]
        [HttpGet("Admin/Get/AllEquipments")]
        public async Task<IActionResult> GetAllEquipments()
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var equipments = await _EquipmentService.GetAllEquipmentsAsync(userId);
                return Ok(new ApiResponseDto<object>(200, "Your dormitary's equipments has been listed succesfully.", equipments));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("Admin/Get/EquipmentById/{id}")]
        public async Task<IActionResult> GetEquipmentByid(int id)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var equipment = await _EquipmentService.GetEquipmentByIdAsync(id, userId);
                return Ok(new ApiResponseDto<object>(200, "Equipment has been found successfully.", equipment));
            }
            catch (EquipmentNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("Admin/Create/Equipment")]
        public async Task<IActionResult> CreateEquipment([FromBody] EquipmentCreateDto dto)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var equipment = await _EquipmentService.AddEquipmentAsync(dto, userId);
                return Ok(new ApiResponseDto<object>(200, "Equipment has been created successfully.", equipment));
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
        [HttpDelete("Admin/Delete/Equipment/{id}")]
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                await _EquipmentService.DeleteEquipmentAsync(id, userId);
                return Ok(new ApiResponseDto<object>(200, "Equipment has been deleted successfully."));
            }
            catch (EquipmentNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (EquipmentNotInYourDormitaryException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("Admin/Update/Equipment/{id}")]
        public async Task<IActionResult> UpdateEquipment(int id, [FromBody] EquipmentUpdateDto EquipmentDto)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var equipment = await _EquipmentService.UpdateEquipmentAsync(id, EquipmentDto, userId);
                return Ok(new ApiResponseDto<object>(200, "Equipment has been updated successfully.", equipment));
            }
            catch (EquipmentNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (EquipmentNotInYourDormitaryException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
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
