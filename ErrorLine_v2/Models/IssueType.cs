namespace ErrorLine_v2.Models
{
    public class IssueType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<IssueReport> Reports { get; set; }
    }
}
