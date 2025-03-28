using System.ComponentModel.DataAnnotations;

public class Room
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = null!;

    public List<Issue> Issues { get; set; } = new();

}
