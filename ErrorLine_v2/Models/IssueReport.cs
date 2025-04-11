namespace ErrorLine_v2.Models
{
    public enum IssueStatus
    {
        New,
        InProgress,
        Completed,
        Closed
    }

    public class IssueReport
    {
        public int Id { get; set; }
        public DateOnly Date { get; set; }
        public int LocationId { get; set; }
        public Location Location { get; set; }
        public int IssueId { get; set; }
        public IssueType IssueType { get; set; }
        public int WorkerId { get; set; }
        public MaintananceWorker MaintananceWorker { get; set; }
        public int ReporterId { get; set; }
        public Student Reporter { get; set; }
        public string Description { get; set; }
        public IssueStatus Status { get; set; }
    }
}
