namespace ErrorLine_v2.Repositories
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        IQueryable<TEntity> GetAll();
        Task<TEntity?> GetByIdAsync(int id);
        Task CreateAsync(TEntity entity);
        Task UpdateByIdAsync(int id);
        Task DeleteByIdAsync(int id);
        Task SaveAsync();
    }
}
