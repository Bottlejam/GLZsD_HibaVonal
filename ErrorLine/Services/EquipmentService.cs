using AutoMapper;
using ErrorLine.Context;
using ErrorLine.Dtos;
using ErrorLine.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ErrorLine.Services
{
    public interface IEquipmentService
    {
        Task<IEnumerable<EquipmentDto>> GetAllEquipmentsAsync(int userid);
        Task<EquipmentDto> GetEquipmentByIdAsync(int id, int userid);
        Task<EquipmentDto> AddEquipmentAsync(EquipmentCreateDto dto, int userid);
        Task<bool> DeleteEquipmentAsync(int equipmentid, int userid);
        Task<EquipmentDto> UpdateEquipmentAsync(int id, EquipmentUpdateDto dto, int userId);


    }
    public class EquipmentService : IEquipmentService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public EquipmentService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<EquipmentDto>> GetAllEquipmentsAsync(int userid)
        {
            var user = await _context.Users.FindAsync(userid);
           
            var equipments = await _context.Equipment.Where(e=>e.DormitaryId==user.DormitaryId)
                .Include(e => e.Location)
                .ThenInclude(e => e.Dormitary)
                .ToListAsync();
            return _mapper.Map<IEnumerable<EquipmentDto>>(equipments);
        }
        public async Task<EquipmentDto> GetEquipmentByIdAsync(int id,int userid)
        {
            var user = await _context.Users.FindAsync(userid);

            var equipment = await _context.Equipment.Where(e=>e.Id==id && user.DormitaryId==e.DormitaryId)
                .Include(e => e.Location)
                .ThenInclude(e => e.Dormitary)
                .FirstOrDefaultAsync();
            if (equipment == null)
            {
                throw new KeyNotFoundException("Equipment not found.");
            }
            return _mapper.Map<EquipmentDto>(equipment);
        }
        public async Task<EquipmentDto> AddEquipmentAsync(EquipmentCreateDto dto,int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            
            var location = await _context.Locations.FindAsync(dto.LocationId);
            if (location == null || location.DormitaryId != user.DormitaryId)
            {
                throw new UnauthorizedAccessException("You cannot assign this equipment to a location from another dormitory.");
            }

            var existingEquipment = await _context.Equipment
           .FirstOrDefaultAsync(e =>
           e.Name == dto.Name &&
           e.LocationId == dto.LocationId &&
           e.Price==dto.Price);

            if (existingEquipment != null)
            {
                existingEquipment.Stock += dto.Stock;
                await _context.SaveChangesAsync();
                return _mapper.Map<EquipmentDto>(existingEquipment);
            }

            var equipment = new Equipment
            {
                Name = dto.Name,
                Stock = dto.Stock,
                Price = dto.Price,
                LocationId = dto.LocationId,
                DormitaryId = user.DormitaryId
            };

            await _context.Equipment.AddAsync(equipment);
            await _context.SaveChangesAsync();
            return _mapper.Map<EquipmentDto>(equipment);

           
        }

        public async Task<bool> DeleteEquipmentAsync(int equipmentid,int userid)
        {
            var user = await _context.Users.FindAsync(userid);
            var equipment = await _context.Equipment.FindAsync(equipmentid);
            if (equipment == null)
            {
                throw new KeyNotFoundException("Equipment not found.");
            }
            if (user.DormitaryId != equipment.DormitaryId)
            {
                throw new UnauthorizedAccessException("You cannot delete other dormitary's equipment");
            }
            _context.Equipment.Remove(equipment);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<EquipmentDto> UpdateEquipmentAsync(int id, EquipmentUpdateDto dto,int userId)
        {
            var equipment = await _context.Equipment.FindAsync(id);
            if (equipment == null)
            {
                throw new KeyNotFoundException("Equipment not found.");
            }

            
            var user = await _context.Users.FindAsync(userId);
           

            // Csak a saját kollégiumában található eszközt módosíthatja a felhasználó (nem engedélyezett más kollégium eszközeinek módosítása)
            if (user.DormitaryId != equipment.DormitaryId)
            {
                throw new UnauthorizedAccessException("You cannot modify equipment in other dormitories.");
            }

            // Ellenőrizni, hogy a módosított LocationId az adott kollégiumhoz tartozik-e
            var location = await _context.Locations.FindAsync(dto.LocationId);
            if (location == null || location.DormitaryId != equipment.DormitaryId)
            {
                throw new UnauthorizedAccessException("You cannot assign this equipment to a location from another dormitory.");
            }

            // Ellenőrizzük, hogy van-e már ilyen eszköz a megadott helyszínen és árral
            var existingEquipment = await _context.Equipment
                .FirstOrDefaultAsync(e =>
                    e.Name == dto.Name &&
                    e.LocationId == dto.LocationId &&
                    e.Price == dto.Price &&
                    e.Id != id); // Kivéve, ha ugyanaz az eszköz

            if (existingEquipment != null)
            {
                // Ha van ilyen eszköz, összevonjuk a stockot
                existingEquipment.Stock += dto.Stock;
                _context.Equipment.Update(existingEquipment);
                _context.Equipment.Remove(equipment);  // És a módosított eszköz törlődik
                await _context.SaveChangesAsync();

                // Visszatérünk a frissített eszközhöz
                return _mapper.Map<EquipmentDto>(existingEquipment);
            }

            // Ha nincs ütközés, frissítjük az eszközt
            _mapper.Map(dto, equipment);
            _context.Equipment.Update(equipment);
            await _context.SaveChangesAsync();

            return _mapper.Map<EquipmentDto>(equipment);
        }

    }
}
