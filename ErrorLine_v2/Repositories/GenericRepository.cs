using Microsoft.EntityFrameworkCore;

namespace ErrorLine_v2.Repositories
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity>
        where TEntity : class
    {
        private readonly ErrorLineDbContext _context;
        private readonly DbSet<TEntity> _dbset;
        public GenericRepository(ErrorLineDbContext context)
        {
            _context = context;
            _dbset = _context.Set<TEntity>();
        }

        public IQueryable<TEntity> GetAll()
        {
            return _dbset.AsQueryable();
        }

        public async Task<TEntity?> GetByIdAsync(int id)
        {
            return await _dbset.FindAsync(id);
        }

        public async Task CreateAsync(TEntity entity)
        {
            await _dbset.AddAsync(entity);
        }
        public async Task UpdateByIdAsync(int id)
        {
            var entity = await _dbset.FindAsync(id);
            if (entity != null)
            {
                _dbset.Update(entity);
            }
        }
        public async Task DeleteByIdAsync(int id)
        {
            var entity = await _dbset.FindAsync(id);
            if (entity != null)
            {
                _dbset.Remove(entity);
            }
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
