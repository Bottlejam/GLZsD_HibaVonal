using ErrorLine.Entities;

namespace ErrorLine.Dtos
{
    public class LocationDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public LocationType LocationType { get; set; }
        public DormitaryDto Dormitary { get; set; }
    }
    public class CreateLocationDto
    {
        public string Name { get; set; }
        public LocationType LocationType { get; set; }
      
    }
    public class UpdateLocationDto
    {
        public string Name { get; set; }
        public LocationType LocationType { get; set; }

    }
}
