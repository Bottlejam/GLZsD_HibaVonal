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
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var order = await _OrderService.CreateOrderAsync(orderDto, userId);
            
            return CreatedAtAction(nameof(TrackOrder), new { orderId = order.Id }, order);
        }
        [Authorize(Roles = "MaintenanceManager")]
        [HttpGet("Get/OrderById/{orderId}")]
        public async Task<IActionResult> TrackOrder(int orderId)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var order = await _OrderService.TrackOrderAsync(orderId,userId);
            return Ok(order);
        }
        [Authorize(Roles = "MaintenanceWorker,MaintenanceManager")]
        [HttpGet("MaintenanceWorker&Manager/Get/Allorders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var orders = await _OrderService.GetAllOrdersAsync(userId);
            return Ok(orders);
        }
        [Authorize(Roles = "MaintenanceManager")]
        [HttpPatch("MaintenanceManager/CancelOrder/{orderId}")]
        public async Task<IActionResult> CancelOrder(int orderId)
        {
            var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var result = await _OrderService.CancelOrderAsync(orderId,userId);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Order cannot be cancelled.");
        }
    }
}
