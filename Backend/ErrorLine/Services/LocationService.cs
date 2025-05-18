using AutoMapper;
using ErrorLine.Context;
using ErrorLine.Dtos;
using ErrorLine.Entities;
using ErrorLine.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace ErrorLine.Services
{
    public interface ILocationService
    {
        Task<IEnumerable<LocationDto>> GetAllLocationsAsync(int userid);
        Task<LocationDto> GetLocationByIdAsync(int locid, int userid);
        Task<LocationDto> AddLocationAsync(CreateLocationDto dto, int userId);
        Task DeleteLocationAsync(int locationid, int userid);
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

            var locations = await _context.Locations.Where(e => e.DormitoryId == user.DormitoryId)
                .ToListAsync();
            return _mapper.Map<IEnumerable<LocationDto>>(locations);
        }
        public async Task<LocationDto> GetLocationByIdAsync(int locid,int userid)
        {
            var user = await _context.Users.FindAsync(userid);

            var location = await _context.Locations.FirstOrDefaultAsync(l => l.DormitoryId == user.DormitoryId && locid==l.Id);

            if (location == null)
            {
                throw new LocationNotFoundException();
            }
            if(location.DormitoryId!=user.DormitoryId)
            {
                throw new LocationNotInYourDormitaryException();
            }
            return _mapper.Map<LocationDto>(location);
        }
        public async Task<LocationDto> AddLocationAsync(CreateLocationDto dto, int userId)
        {
            var user = await _context.Users.FindAsync(userId);

            var existingLocation = await _context.Locations
            .FirstOrDefaultAsync(l => l.Name == dto.Name && l.LocationType == dto.LocationType && l.DormitoryId == user.DormitoryId);

            if (existingLocation != null)
            {
                throw new LocationAlreadyExistsException();
            }
            var Location = new Location
            {
                Name = dto.Name,
                LocationType = dto.LocationType,
                DormitoryId = user.DormitoryId ?? 0,
                
            };

            await _context.Locations.AddAsync(Location);
            await _context.SaveChangesAsync();
            return _mapper.Map<LocationDto>(Location);


        }
        public async Task DeleteLocationAsync(int locationid, int userid)
        {
            var user = await _context.Users.FindAsync(userid);
            var location = await _context.Locations.FindAsync(locationid);
            if (location == null)
            {
                throw new LocationNotFoundException();
            }
            if (user.DormitoryId != location.DormitoryId)
            {
                throw new LocationNotInYourDormitaryException();
            }
            _context.Locations.Remove(location);
            await _context.SaveChangesAsync();

            
        }
        public async Task<LocationDto> UpdateLocationAsync(int id, UpdateLocationDto dto, int userid)
        {
            var user = await _context.Users.FindAsync(userid);
            var location = await _context.Locations.FindAsync(id);
            if (location == null)
            {
                throw new LocationNotFoundException();
            }
            if (location.DormitoryId != user.DormitoryId)
            {
                throw new LocationNotInYourDormitaryException();
            }

            _mapper.Map(dto, location);
            _context.Locations.Update(location);
            await _context.SaveChangesAsync();

            return _mapper.Map<LocationDto>(location);
        }

    }
}
