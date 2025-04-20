using System.ComponentModel.DataAnnotations;

namespace ErrorLine.Dtos
{
    public class NoteDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public int IssueReportId { get; set; }
        public int CreatedById { get; set; }
    }
    public class NoteCreateDto
    {
        [Required]
        public string Text { get; set; }
        
        

    }
    public class NoteUpdateDto
    {
        [Required]
        public string Text { get; set; }



    }
}
