using ErrorLine.Dtos;
using ErrorLine.Entities;
using ErrorLine.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ErrorLine.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class EquipmentController : ControllerBase
    {
        private readonly IEquipmentService _EquipmentService;

        public EquipmentController(IEquipmentService EqupmentService)
        {
            _EquipmentService = EqupmentService;
        }

        [HttpGet("Admin/Get/AllEquipments")]
        public async Task<IActionResult> GetAllEquipments()
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var equipments = await _EquipmentService.GetAllEquipmentsAsync(userId); 
            return Ok(equipments);
        }
        [HttpGet("Admin/Get/EquipmentById/{id}")]
        public async Task<IActionResult> GetEquipmentByid(int id)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var equipment = await _EquipmentService.GetEquipmentByIdAsync(id,userId);
            return Ok(equipment);
        }
        [HttpPost("Admin/Create/Equipment")]
        public async Task<IActionResult> CreateEquipment([FromBody] EquipmentCreateDto dto)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var issue = await _EquipmentService.AddEquipmentAsync(dto, userId);
            return Ok(issue);
        }
        [HttpDelete("Admin/Delete/Equipment/{id}")]
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var result = await _EquipmentService.DeleteEquipmentAsync(id,userId);
            if (result)
            {
                return NoContent();
            }
            return NotFound();
        }
        [HttpPut("Admin/Update/Equipment/{id}")]
        public async Task<IActionResult> UpdateEquipment(int id, [FromBody] EquipmentUpdateDto EquipmentDto)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var equipment = await _EquipmentService.UpdateEquipmentAsync(id, EquipmentDto,userId);
            return Ok(equipment);
        }
    }
}
