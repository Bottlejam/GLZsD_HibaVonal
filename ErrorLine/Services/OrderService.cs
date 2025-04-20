using AutoMapper;
using ErrorLine.Context;
using ErrorLine.Dtos;
using ErrorLine.Entities;
using Microsoft.EntityFrameworkCore;

namespace ErrorLine.Services
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderAsync(OrderCreateDto orderDto, int userId);
        Task<OrderDto> TrackOrderAsync(int orderId, int u);
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync(int userId);
        Task<bool> CancelOrderAsync(int orderId, int userId);
    }
    public class OrderService:IOrderService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public OrderService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<OrderDto> CreateOrderAsync(OrderCreateDto orderDto, int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            var order = new Order
            {
                DormitaryId= user.DormitaryId,
                OrderStatus = OrderStatus.Pending,
                OrderDate = DateTime.Now,
                UserId = user.Id,
               
                OrderItems = new List<OrderItem>(),
                
            };
            if (orderDto.Items == null || !orderDto.Items.Any())
            {
                throw new ArgumentException("Order must contain at least one item.");
            }

            foreach (var item in orderDto.Items)
            {
                if (item.Quantity <= 0)
                {
                    throw new ArgumentException("Quantity must be greater than zero.");
                }

                var equipment = await _context.Equipment.FindAsync(item.EquipmentId);
                if (equipment == null)
                {
                    throw new KeyNotFoundException($"Equipment with ID {item.EquipmentId} not found.");
                }

                order.OrderItems.Add(new OrderItem
                {
                    EquipmentId = item.EquipmentId,
                    Quantity = item.Quantity
                });
            }

            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            await _context.Entry(order).Reference(o => o.Dormitary).LoadAsync();

            return _mapper.Map<OrderDto>(order);
        }
        public async Task<OrderDto> TrackOrderAsync(int orderId,int userid )
        {
            var user = await _context.Users.FindAsync(userid);
            var order = await _context.Orders.Where(o=>o.DormitaryId==user.DormitaryId)               
                .Include(o => o.OrderItems)
                .ThenInclude(i => i.Equipment)
                .Include(i => i.Dormitary)

                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                throw new KeyNotFoundException("Order not found.");
            }
            return _mapper.Map<OrderDto>(order);
        }
        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync(int userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            var orders = await _context.Orders.Where(o => o.DormitaryId == user.DormitaryId)
                .Include(o => o.OrderItems)
                    .ThenInclude(i => i.Equipment)
                .Include(o => o.Dormitary)
                .ToListAsync();

            return _mapper.Map<IEnumerable<OrderDto>>(orders);
        }
        public async Task<bool> CancelOrderAsync(int orderId,int userId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null)
            {
                throw new KeyNotFoundException("Order not found.");
            }
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (order.DormitaryId != user.DormitaryId)
            {
                throw new InvalidOperationException("You can only cancel your dormitary's orders.");
            }

            if (order.OrderStatus != OrderStatus.Pending)
            {
                throw new InvalidOperationException("You can only cancel pending orders.");
            }


            order.OrderStatus = OrderStatus.Cancelled;
            await _context.SaveChangesAsync();
            return true;
        }


    }
}
