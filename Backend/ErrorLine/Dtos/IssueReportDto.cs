using ErrorLine.Entities;
using Microsoft.Identity.Client;
using System.ComponentModel.DataAnnotations;

namespace ErrorLine.Dtos
{
    public class IssueReportDto
    {
        public int Id { get; set; }
        public DateOnly Date { get; set; }
        public string Description { get; set; }
        public UserDto Reporter { get; set; }
        public IssueTypeDto IssueType { get; set; }
        public DormitoryDto Dormitory { get; set; }
        public LocationDto Location { get; set; }
        public IssueStatus IssueStatus { get; set; }
        public IEnumerable<NoteDto> Notes { get; set; }
        public UserDto AssignedWorker { get; set; }

    }

    public class CreateIssueReportDto
    {
        [Required]
        [MaxLength(500)]
        public string Description { get; set; }


        [Required]
        public int LocationId { get; set; }
        [Required]
        public int IssueTypeId { get; set; }
       
    }

    public class IssueUpdateDto
    {
        public IssueStatus? IssueStatus { get; set; }
        public int? AssignedWorkerId { get; set; }
    }
   
}
