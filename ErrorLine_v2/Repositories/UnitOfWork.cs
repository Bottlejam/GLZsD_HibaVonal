using ErrorLine_v2.Models;

namespace ErrorLine_v2.Repositories
{
    public class UnitOfWork
    {
        private readonly ErrorLineDbContext _context;
        public IGenericRepository<Location> Locations { get; set; }
        public IGenericRepository<IssueType> IssueTypes { get; set; }
        public IGenericRepository<Equipment> Equipments { get; set; }
        public IGenericRepository<IssueReport> IssueReports { get; set; }
        public IGenericRepository<Student> Students { get; set; }

        public UnitOfWork(ErrorLineDbContext context)
        {
            _context = context;
            Locations = new GenericRepository<Location>(context);
            IssueTypes = new GenericRepository<IssueType>(context);
            Equipments = new GenericRepository<Equipment>(context);
            IssueReports = new GenericRepository<IssueReport>(context);
            Students = new GenericRepository<Student>(context);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
