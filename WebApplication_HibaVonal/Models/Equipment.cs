using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Equipment
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = null!;

    public int? RoomId { get; set; }

    [ForeignKey("RoomId")]
    public Room? Room { get; set; }
}
