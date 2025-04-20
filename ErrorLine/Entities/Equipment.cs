using Microsoft.EntityFrameworkCore;

namespace ErrorLine.Entities
{
    public class Equipment
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Stock { get; set; }
        [Precision(10, 2)]
        public decimal Price { get; set; }
        public int LocationId { get; set; }
        public Location Location { get; set; }
        public int DormitaryId { get; set; }
        public Dormitary Dormitary { get; set; }

    }
}
