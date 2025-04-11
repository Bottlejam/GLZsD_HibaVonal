using ErrorLine_v2.Models;
using System.ComponentModel.DataAnnotations;

namespace ErrorLine_v2.Dto
{
    public class CreateStudentDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public int RoomId { get; set; }
    }
}
