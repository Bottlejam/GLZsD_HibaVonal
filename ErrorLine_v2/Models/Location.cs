namespace ErrorLine_v2.Models
{
    public enum LocationType
    {
        CommonPlace,
        Room
    }
    public class Location
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public LocationType Type { get; set; }
        public ICollection<IssueReport> Reports { get; set; }
    }
}
