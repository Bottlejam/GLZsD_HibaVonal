using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebApplication_HibaVonal.Enums;
using WebApplication_HibaVonal.Models;  

public class Issue
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    public int? RoomId { get; set; }

    [ForeignKey("RoomId")]
    public Room? Room { get; set; }

    [Required]
    public string Description { get; set; } = null!;

    [Required]
    public IssueStatus Status { get; set; } = IssueStatus.Bejelentve;  

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
