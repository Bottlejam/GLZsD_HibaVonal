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
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _OrderService;

        public OrderController(IOrderService OrderService)
        {
            _OrderService =OrderService;
        }
        [Authorize(Roles = "MaintenanceWorker,MaintenanceManager")]
        [HttpPost("MaintenanceWorker&Manager/Create/Order")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto orderDto)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var order = await _OrderService.CreateOrderAsync(orderDto, userId);
                return Ok(new ApiResponseDto<object>(200, "The order has been made succesfully.", order));
            }
            catch (OrderEmptyException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (InvalidQuantityException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
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
        [Authorize(Roles = "MaintenanceManager")]
        [HttpGet("Get/MaintenanceManager/OrderById/{orderId}")]
        public async Task<IActionResult> TrackOrder(int orderId)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var order = await _OrderService.TrackOrderAsync(orderId, userId);
                return Ok(new ApiResponseDto<object>(200, "The order has been found succesfully.", order));
            }
            catch (OrderNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [Authorize(Roles = "MaintenanceWorker,MaintenanceManager")]
        [HttpGet("MaintenanceWorker&Manager/Get/Allorders")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var orders = await _OrderService.GetAllOrdersAsync(userId);
                return Ok(new ApiResponseDto<object>(200, "The orders has been listed succesfully.", orders));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }
        [Authorize(Roles = "MaintenanceManager")]
        [HttpPatch("MaintenanceManager/CancelOrder/{orderId}")]
        public async Task<IActionResult> CancelOrder(int orderId)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                await _OrderService.CancelOrderAsync(orderId, userId);
                return Ok(new ApiResponseDto<object>(200, "The order has been cancelled succesfully."));
            }
            catch (OrderNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (OrderNotInSameDormitaryAsYouException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (OrderStatusIsNotPendingException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }




        }
    }
}
