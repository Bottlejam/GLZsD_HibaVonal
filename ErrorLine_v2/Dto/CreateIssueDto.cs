using ErrorLine_v2.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ErrorLine_v2.Dto
{
    public class CreateIssueDto
    {
        [Required]
        public DateOnly Date { get; set; }

        [Required]
        public int LocationId { get; set; }

        [Required]
        public int IssueId { get; set; }

        [Required]
        public int ReporterId { get; set; }

        [Required]
        [StringLength(1000)]
        public string Description { get; set; }
    }
}
