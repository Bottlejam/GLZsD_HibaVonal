using System.ComponentModel.DataAnnotations;

namespace ErrorLine_v2.Dto
{
    public class CreateEquipmentDto
    {
        [Required]
        public String Name { get; set; }

        [Required]
        public int Stock { get; set; }
    }
}
