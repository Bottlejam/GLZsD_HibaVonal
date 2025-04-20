using ErrorLine.Entities;
using Microsoft.EntityFrameworkCore;

namespace ErrorLine.Context
{
    public class AppDbContext:DbContext
    {
        

        public DbSet<User> Users { get; set; }
        public DbSet<IssueReport> IssueReports { get; set; }
        public DbSet<IssueType> IssueTypes { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Equipment> Equipment { get; set; }
        public DbSet<Dormitary> Dormitary { get; set; }
        public DbSet<Note> Note { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
      
}
