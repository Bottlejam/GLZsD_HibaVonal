using AutoMapper;
using ErrorLine.Context;
using ErrorLine.Dtos;
using ErrorLine.Entities;
using ErrorLine.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ErrorLine.Services
{
    public interface IEquipmentService
    {
        Task<IEnumerable<EquipmentDto>> GetAllEquipmentsAsync(int userid);
        Task<EquipmentDto> GetEquipmentByIdAsync(int id, int userid);
        Task<EquipmentDto> AddEquipmentAsync(EquipmentCreateDto dto, int userid);
        Task DeleteEquipmentAsync(int equipmentid, int userid);
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
           
            var equipments = await _context.Equipments.Where(e=>e.DormitoryId==user.DormitoryId)
                .Include(e => e.Location)
                .ThenInclude(e => e.Dormitory)
                .ToListAsync();
            return _mapper.Map<IEnumerable<EquipmentDto>>(equipments);
        }
        public async Task<EquipmentDto> GetEquipmentByIdAsync(int id,int userid)
        {
            var user = await _context.Users.FindAsync(userid);

            var equipment = await _context.Equipments.Where(e=>e.Id==id && user.DormitoryId==e.DormitoryId)
                .Include(e => e.Location)
                .ThenInclude(e => e.Dormitory)
                .FirstOrDefaultAsync();
            if (equipment == null)
            {
                throw new EquipmentNotFoundException();
            }
            return _mapper.Map<EquipmentDto>(equipment);
        }
        public async Task<EquipmentDto> AddEquipmentAsync(EquipmentCreateDto dto,int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            
            var location = await _context.Locations.FindAsync(dto.LocationId);
            if (location == null)
            {
                throw new LocationNotFoundException();
            }
            if ( location.DormitoryId != user.DormitoryId)
            {
                throw new LocationNotInYourDormitaryException();
            }

            var existingEquipment = await _context.Equipments
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
                DormitoryId = user.DormitoryId
            };

            await _context.Equipments.AddAsync(equipment);
            await _context.SaveChangesAsync();
            return _mapper.Map<EquipmentDto>(equipment);

           
        }

        public async Task DeleteEquipmentAsync(int equipmentid,int userid)
        {
            var user = await _context.Users.FindAsync(userid);
            var equipment = await _context.Equipments.FindAsync(equipmentid);
            if (equipment == null)
            {
                throw new EquipmentNotFoundException();
            }
            if (user.DormitoryId != equipment.DormitoryId)
            {
                throw new EquipmentNotInYourDormitaryException();
            }
            _context.Equipments.Remove(equipment);
            await _context.SaveChangesAsync();

        }
        public async Task<EquipmentDto> UpdateEquipmentAsync(int id, EquipmentUpdateDto dto,int userId)
        {
            var equipment = await _context.Equipments.FindAsync(id);
            if (equipment == null)
            {
                throw new EquipmentNotFoundException();
            }

            
            var user = await _context.Users.FindAsync(userId);
           

            // Csak a saját kollégiumában található eszközt módosíthatja a felhasználó (nem engedélyezett más kollégium eszközeinek módosítása)
            if (user.DormitoryId != equipment.DormitoryId)
            {
                throw new EquipmentNotInYourDormitaryException();
            }

            // Ellenőrizni, hogy a módosított LocationId az adott kollégiumhoz tartozik-e
            var location = await _context.Locations.FindAsync(dto.LocationId);
            if (location == null )
            {
                throw new LocationNotFoundException();
            }
            if ( location.DormitoryId != equipment.DormitoryId)
            {
                throw new LocationNotInYourDormitaryException();
            }

            // Ellenőrizzük, hogy van-e már ilyen eszköz a megadott helyszínen és árral
            var existingEquipment = await _context.Equipments
                .FirstOrDefaultAsync(e =>
                    e.Name == dto.Name &&
                    e.LocationId == dto.LocationId &&
                    e.Price == dto.Price &&
                    e.Id != id); // Kivéve, ha ugyanaz az eszköz

            if (existingEquipment != null)
            {
                // Ha van ilyen eszköz, összevonjuk a stockot
                existingEquipment.Stock += dto.Stock;
                _context.Equipments.Update(existingEquipment);
                _context.Equipments.Remove(equipment);  // És a módosított eszköz törlődik
                await _context.SaveChangesAsync();

                // Visszatérünk a frissített eszközhöz
                return _mapper.Map<EquipmentDto>(existingEquipment);
            }

            // Ha nincs ütközés, frissítjük az eszközt
            _mapper.Map(dto, equipment);
            _context.Equipments.Update(equipment);
            await _context.SaveChangesAsync();

            return _mapper.Map<EquipmentDto>(equipment);
        }

    }
}
