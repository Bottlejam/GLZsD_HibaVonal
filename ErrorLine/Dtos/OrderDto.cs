using ErrorLine.Entities;
using System.ComponentModel.DataAnnotations;

namespace ErrorLine.Dtos
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public IEnumerable<OrderItemDto> OrderItems { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public DateTime CreatedAt { get; set; }
        public DormitaryDto Dormitary { get; set; }
    }

    public class OrderItemDto
    {
        public int Id { get; set; }
        public int EquipmentId { get; set; }
        public string EquipmentName { get; set; }
        public int Quantity { get; set; }
        public int EquipmentPrice { get; set; }
    }

    public class OrderCreateDto
    {
        [Required]
        public IEnumerable<OrderItemCreateDto> Items { get; set; }
      
    }
    public class OrderItemCreateDto
    {
        [Required]
        public int EquipmentId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }
}
