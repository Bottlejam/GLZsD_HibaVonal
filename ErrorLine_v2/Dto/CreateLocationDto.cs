using ErrorLine_v2.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ErrorLine_v2.Dto
{
    public class CreateLocationDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public LocationType Type { get; set; }
    }
}
