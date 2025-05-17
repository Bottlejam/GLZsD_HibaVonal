using AutoMapper;
using ErrorLine.Context;
using ErrorLine.Dtos;
using ErrorLine.Entities;
using ErrorLine.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace ErrorLine.Services
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderAsync(OrderCreateDto orderDto, int userId);
        Task<OrderDto> TrackOrderAsync(int orderId, int u);
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync(int userId);
        Task CancelOrderAsync(int orderId, int userId);
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
                DormitoryId= user.DormitoryId,
                OrderStatus = OrderStatus.Pending,
                OrderDate = DateTime.Now,
                UserId = user.Id,
               
                OrderItems = new List<OrderItem>(),
                
            };
            if (orderDto.Items == null || !orderDto.Items.Any())
            {
                throw new OrderEmptyException();
            }

            foreach (var item in orderDto.Items)
            {
                if (item.Quantity <= 0)
                {
                    throw new InvalidQuantityException();
                }

                var equipment = await _context.Equipments.FindAsync(item.EquipmentId);
                if (equipment == null)
                {
                    throw new EquipmentNotFoundException();
                }

                order.OrderItems.Add(new OrderItem
                {
                    EquipmentId = item.EquipmentId,
                    Quantity = item.Quantity
                });
            }

            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            await _context.Entry(order).Reference(o => o.Dormitory).LoadAsync();

            return _mapper.Map<OrderDto>(order);
        }
        public async Task<OrderDto> TrackOrderAsync(int orderId,int userid )
        {
            var user = await _context.Users.FindAsync(userid);
            var order = await _context.Orders.Where(o=>o.DormitoryId==user.DormitoryId)               
                .Include(o => o.OrderItems)
                .ThenInclude(i => i.Equipment)
                .Include(i => i.Dormitory)

                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                throw new OrderNotFoundException();
            }
            return _mapper.Map<OrderDto>(order);
        }
        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync(int userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            var orders = await _context.Orders.Where(o => o.DormitoryId == user.DormitoryId)
                .Include(o => o.OrderItems)
                    .ThenInclude(i => i.Equipment)
                .Include(o => o.Dormitory)
                .ToListAsync();

            return _mapper.Map<IEnumerable<OrderDto>>(orders);
        }
        public async Task CancelOrderAsync(int orderId,int userId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null)
            {
                throw new OrderNotFoundException();
            }
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (order.DormitoryId != user.DormitoryId)
            {
                throw new OrderNotInSameDormitaryAsYouException();
            }

            if (order.OrderStatus != OrderStatus.Pending)
            {
                throw new OrderStatusIsNotPendingException();
            }


            order.OrderStatus = OrderStatus.Cancelled;
            await _context.SaveChangesAsync();
           
        }


    }
}
