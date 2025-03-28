using Microsoft.EntityFrameworkCore;
using WebApplication_HibaVonal.Models;

namespace WebApplication_HibaVonal
{
    public class ErrorLineDbContext : DbContext
    {
        public ErrorLineDbContext(DbContextOptions<ErrorLineDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Issue> Issues { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<MaintenanceRequest> MaintenanceRequests { get; set; }
        public DbSet<Equipment> Equipments { get; set; }

       
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Issue>()
                .Property(i => i.Status)
                .HasConversion<int>(); 

            modelBuilder.Entity<MaintenanceRequest>()
                .Property(m => m.Status)
                .HasConversion<int>(); 

        }
    }
}
