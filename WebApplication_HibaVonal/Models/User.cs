using System.ComponentModel.DataAnnotations;
using WebApplication_HibaVonal.Enums;

namespace WebApplication_HibaVonal.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = null!;

        [Required, EmailAddress, MaxLength(100)]
        public string Email { get; set; } = null!;

        [Required]
        public UserRole Role { get; set; }

        public List<Issue> Issues { get; set; } = new();
    }
}
