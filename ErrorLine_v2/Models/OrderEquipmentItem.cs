namespace ErrorLine_v2.Models
{
    public class OrderEquipmentItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public int EquipmentId { get; set; }
        public Equipment Equipment { get; set; }
        public int Quantity { get; set; }

    }
}
