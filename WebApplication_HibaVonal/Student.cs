namespace WebApplication_HibaVonal
{
    public class Student : User
    {
        public Location Room {  get; set; }
        public ICollection<IssueReport> Reports { get; set; }
    }
}
