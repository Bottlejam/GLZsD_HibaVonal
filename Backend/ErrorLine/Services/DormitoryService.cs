using AutoMapper;
using ErrorLine.Context;
using ErrorLine.Dtos;
using ErrorLine.Entities;
using ErrorLine.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace ErrorLine.Services
{
    public interface IDormitaryService
    {
        Task<IEnumerable<DormitoryDto>> GetAllDormitoriesAsync();
        Task<DormitoryDto> GetDormitoryByIdAsync(int dormid);
        Task<DormitoryDto> AddDormitoryAsync(CreateDormitoryDto dto);
        Task DeleteDormitoryAsync(int dormitoryid);
        Task<DormitoryDto> UpdateDormitoryAsync(int id, UpdateDormitoryDto dto);
    }
    public class DormitoryService:IDormitaryService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public DormitoryService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<IEnumerable<DormitoryDto>> GetAllDormitoriesAsync()
        {


            var dormitories = await _context.Dormitories.ToListAsync();
            return _mapper.Map<IEnumerable<DormitoryDto>>(dormitories);
        }
        public async Task<DormitoryDto> GetDormitoryByIdAsync(int dormitoryid)
        {
            var dormitory = await _context.Dormitories.FindAsync(dormitoryid);
            if (dormitory == null)
            {
                throw new DormitoryNotFoundException();
            }

            return _mapper.Map<DormitoryDto>(dormitory);
        }

        public async Task<DormitoryDto> AddDormitoryAsync(CreateDormitoryDto dto)
        {
            
            var existingDormitory = await _context.Dormitories
            .FirstOrDefaultAsync(d =>dto.Address == d.Address);

            if (existingDormitory != null)
            {
                throw new DormitoryWithThisAddressAlereadyExistsException();
            }
            var Dormitory = new Dormitory
            {
                Name = dto.Name,
                Address=dto.Address
            };

            await _context.Dormitories.AddAsync(Dormitory);
            await _context.SaveChangesAsync();
            return _mapper.Map<DormitoryDto>(Dormitory);
        }

        public async Task DeleteDormitoryAsync(int dormitoryid)
        {
           
            var dormitory = await _context.Dormitories.FindAsync(dormitoryid);
            if (dormitory == null)
            {
                throw new DormitoryNotFoundException();
            }
         
            _context.Dormitories.Remove(dormitory);
            await _context.SaveChangesAsync();
        }

       

      

        public async Task<DormitoryDto> UpdateDormitoryAsync(int id, UpdateDormitoryDto dto)
        {
            
            var dormitory = await _context.Dormitories.FindAsync(id);
            if (dormitory== null)
            {
                throw new DormitoryNotFoundException();
            }
            

            _mapper.Map(dto, dormitory);
            _context.Dormitories.Update(dormitory);
            await _context.SaveChangesAsync();

            return _mapper.Map<DormitoryDto>(dormitory);
        }
    }
}
