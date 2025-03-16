namespace WebApplication_HibaVonal
{
    public enum OrderStatus
    {
        Pending,
        Ordered,
        Delivered
    }
    public class Order
    {
        public int Id { get; set; }
        public int ManagerId { get; set; }
        public MaintananceManager Manager { get; set; }
        public DateOnly OrderDate { get; set; }
        public DateOnly ArrivalDate { get; set; }
        public OrderStatus Status { get; set; }
        public ICollection<OrderEquipmentItem> OrderItems { get; set; }
    }
}
