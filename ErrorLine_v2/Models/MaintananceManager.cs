namespace ErrorLine_v2.Models
{
    public class MaintananceManager : User
    {
        public ICollection<Order> Orders { get; set; }
    }
}
