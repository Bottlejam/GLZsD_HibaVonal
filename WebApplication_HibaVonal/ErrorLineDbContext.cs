using Microsoft.EntityFrameworkCore;

namespace WebApplication_HibaVonal
{
    public class ErrorLineDbContext : DbContext
    {
        public ErrorLineDbContext(DbContextOptions<ErrorLineDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<MaintananceWorker> MaintananceWorkers { get; set; }
        public DbSet<MaintananceManager> MaintananceManagers { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<IssueReport> IssueReports { get; set; }
        public DbSet<IssueType> IssueTypes { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderEquipmentItem> OrderEquipmentItems { get; set; }
        public DbSet<Equipment> Equipment { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 📌 TPT (Table Per Type) öröklődés konfiguráció a User leszármazottakhoz
            modelBuilder.Entity<Student>().ToTable("Students");
            modelBuilder.Entity<MaintananceWorker>().ToTable("MaintananceWorkers");
            modelBuilder.Entity<MaintananceManager>().ToTable("MaintananceManagers");
            modelBuilder.Entity<Admin>().ToTable("Admins");

            // 📌 IssueReport konfiguráció
            modelBuilder.Entity<IssueReport>()
                .HasOne(ir => ir.Location)
                .WithMany(l => l.Reports)
                .HasForeignKey(ir => ir.LocationId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<IssueReport>()
                .HasOne(ir => ir.IssueType)
                .WithMany(it => it.Reports)
                .HasForeignKey(ir => ir.IssueId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<IssueReport>()
                .HasOne(ir => ir.MaintananceWorker)
                .WithMany(w => w.AssignedReports)
                .HasForeignKey(ir => ir.WorkerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<IssueReport>()
                .HasOne(ir => ir.Reporter)
                .WithMany(s => s.Reports)
                .HasForeignKey(ir => ir.ReporterId)
                .OnDelete(DeleteBehavior.Restrict);

            // 📌 Order konfiguráció
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Manager)
                .WithMany(m => m.Orders)
                .HasForeignKey(o => o.ManagerId)
                .OnDelete(DeleteBehavior.Restrict);

            // 📌 OrderEquipmentItem konfiguráció
            modelBuilder.Entity<OrderEquipmentItem>()
                .HasOne(oe => oe.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oe => oe.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderEquipmentItem>()
                .HasOne(oe => oe.Equipment)
                .WithMany()
                .HasForeignKey(oe => oe.EquipmentId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
