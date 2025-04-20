using ErrorLine.Entities;
using System.ComponentModel.DataAnnotations;

namespace ErrorLine.Dtos
{
    public class EquipmentDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Stock { get; set; }
        public decimal Price { get; set; }
        public LocationDto Location { get; set; }
        public DormitaryDto Dormitary { get; set; }
    }

    public class EquipmentCreateDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public int Stock { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        

        public int LocationId { get; set; }
        
    }

    public class EquipmentUpdateDto
    {
        public string Name { get; set; }
        public int Stock { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        public int LocationId { get; set; }
    }



}
