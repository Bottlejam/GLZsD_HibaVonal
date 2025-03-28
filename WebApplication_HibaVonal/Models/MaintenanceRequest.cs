using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebApplication_HibaVonal.Enums;
using WebApplication_HibaVonal.Models;  // Enum namespace importálása

public class MaintenanceRequest
{
    public int Id { get; set; }

    [Required]
    public int IssueId { get; set; }

    [ForeignKey("IssueId")]
    public Issue Issue { get; set; } = null!;

    [Required]
    public int AssignedTo { get; set; }

    [ForeignKey("AssignedTo")]
    public User AssignedUser { get; set; } = null!;

    [Required]
    public MaintenanceStatus Status { get; set; } = MaintenanceStatus.Elfogadva;  // Enum típusként
}
