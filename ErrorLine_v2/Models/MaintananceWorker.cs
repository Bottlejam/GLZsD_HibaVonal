namespace ErrorLine_v2.Models
{
    public class MaintananceWorker : User
    {
        public ICollection<IssueReport> AssignedReports { get; set; }
    }
}
