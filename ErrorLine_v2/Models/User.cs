namespace ErrorLine_v2.Models
{
    public enum UserRole
    {
        Student,
        MaintananceWorker,
        MaintananceManager,
        Admin
    }
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public UserRole Role { get; set; }
    }
}
