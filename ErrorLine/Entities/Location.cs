namespace ErrorLine.Entities
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
        public LocationType LocationType { get; set; }
        public ICollection<Equipment> Equipments { get; set; }
        public int DormitaryId { get; set; }
        public Dormitary Dormitary { get; set; }
    }
}
