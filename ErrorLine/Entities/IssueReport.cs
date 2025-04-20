namespace ErrorLine.Entities
{
    public enum IssueStatus
    {
        New,
        InProgress,
        Completed,
        Closed,
        Validated
    }
    public class IssueReport
    {
        public int Id { get; set; }
        public DateOnly Date { get; set; }
        public int LocationId { get; set; }
        public Location Location { get; set; }
        public int IssueTypeId { get; set; }
        public IssueType IssueType { get; set; }
        public int? AssignedWorkerId { get; set; }
        public User? AssignedWorker { get; set; }
        public int ReporterId { get; set; }
        public User Reporter { get; set; }
        public string Description { get; set; }
        public IssueStatus IssueStatus { get; set; }
        public int DormitaryId { get; set; }
        public Dormitary Dormitary { get; set; }
        public ICollection<Note> Notes { get; set; }

    }
}
