namespace WebApplication_HibaVonal
{
    public class IssueType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<IssueReport> Reports { get; set; }
    }
}
