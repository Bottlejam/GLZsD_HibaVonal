namespace WebApplication_HibaVonal
{
    public class MaintananceWorker : User
    {
        public ICollection<IssueReport> AssignedReports { get; set; } 
    }
}
