namespace WebApplication_HibaVonal
{
    public class MaintananceManager : User
    {
        public ICollection<Order> Orders {  get; set; }
    }
}
