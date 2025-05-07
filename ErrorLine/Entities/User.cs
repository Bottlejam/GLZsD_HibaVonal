using System.ComponentModel.DataAnnotations;

namespace ErrorLine.Entities
{
    public enum UserRole
    {
        Student,
        MaintenanceWorker,
        MaintenanceManager,
        Admin
    }
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public UserRole Role { get; set; }
        public int DormitoryId { get; set; }
        public Dormitory Dormitory { get; set; }
        
    }
    
}
