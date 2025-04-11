namespace ErrorLine_v2.Models
{
    public class Student : User
    {
        public int RoomId { get; set; }
        public Location Room { get; set; }
        public ICollection<IssueReport> Reports { get; set; }
    }
}
