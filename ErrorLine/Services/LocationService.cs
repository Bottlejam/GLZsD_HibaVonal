using AutoMapper;
using ErrorLine.Context;
using ErrorLine.Dtos;
using ErrorLine.Entities;
using Microsoft.EntityFrameworkCore;

namespace ErrorLine.Services
{
    public interface ILocationService
    {
        Task<IEnumerable<LocationDto>> GetAllLocationsAsync(int userid);
        Task<LocationDto> GetLocationByIdAsync(int locid, int userid);
        Task<LocationDto> AddLocationAsync(CreateLocationDto dto, int userId);
        Task<bool> DeleteLocationAsync(int locationid, int userid);
        Task<LocationDto> UpdateLocationAsync(int id, UpdateLocationDto dto, int userid);
    }
    public class LocationService:ILocationService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public LocationService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<IEnumerable<LocationDto>> GetAllLocationsAsync(int userid)
        {
            var user = await _context.Users.FindAsync(userid);

            var locations = await _context.Locations.Where(e => e.DormitaryId == user.DormitaryId)
                .ToListAsync();
            return _mapper.Map<IEnumerable<LocationDto>>(locations);
        }
        public async Task<LocationDto> GetLocationByIdAsync(int locid,int userid)
        {
            var user = await _context.Users.FindAsync(userid);

            var location = await _context.Locations.FirstOrDefaultAsync(l => l.DormitaryId == user.DormitaryId && locid==l.Id);

            if (location == null)
            {
                throw new KeyNotFoundException("location not found.");
            }
            return _mapper.Map<LocationDto>(location);
        }
        public async Task<LocationDto> AddLocationAsync(CreateLocationDto dto, int userId)
        {
            var user = await _context.Users.FindAsync(userId);

            var existingLocation = await _context.Locations
            .FirstOrDefaultAsync(l => l.Name == dto.Name && l.LocationType == dto.LocationType && l.DormitaryId == user.DormitaryId);

            if (existingLocation != null)
            {
                throw new InvalidOperationException("A location with the same name and type already exists in a dormitory.");
            }
            var Location = new Location
            {
                Name = dto.Name,
                LocationType = dto.LocationType,
                DormitaryId = user.DormitaryId,
                
            };

            await _context.Locations.AddAsync(Location);
            await _context.SaveChangesAsync();
            return _mapper.Map<LocationDto>(Location);


        }
        public async Task<bool> DeleteLocationAsync(int locationid, int userid)
        {
            var user = await _context.Users.FindAsync(userid);
            var location = await _context.Locations.FindAsync(locationid);
            if (location == null)
            {
                throw new KeyNotFoundException("Location not found.");
            }
            if (user.DormitaryId != location.DormitaryId)
            {
                throw new UnauthorizedAccessException("You cannot delete other dormitary's location");
            }
            _context.Locations.Remove(location);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<LocationDto> UpdateLocationAsync(int id, UpdateLocationDto dto, int userid)
        {
            var user = await _context.Users.FindAsync(userid);
            var location = await _context.Locations.FindAsync(id);
            if (location == null)
            {
                throw new KeyNotFoundException("Location not found.");
            }
            if (location.DormitaryId != user.DormitaryId)
            {
                throw new UnauthorizedAccessException("You are not allowed to update another user's note");
            }

            _mapper.Map(dto, location);
            _context.Locations.Update(location);
            await _context.SaveChangesAsync();

            return _mapper.Map<LocationDto>(location);
        }

    }
}
