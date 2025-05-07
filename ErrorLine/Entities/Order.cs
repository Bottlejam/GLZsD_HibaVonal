namespace ErrorLine.Entities
{
    public enum OrderStatus
    {
        Pending,
        Ordered,
        Delivered,
        Cancelled
    }
    public class Order
    {

        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public DateTime OrderDate { get; set; }
        public DateTime? ArrivalDate { get; set; }

        public OrderStatus OrderStatus { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; }
        public int DormitoryId { get; set; }
        public Dormitory Dormitory { get; set; }



    }
}
