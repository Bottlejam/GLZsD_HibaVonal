using AutoMapper;
using ErrorLine.Context;
using ErrorLine.Dtos;
using Microsoft.EntityFrameworkCore;
using ErrorLine.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Globalization;
using System.Security.Claims;
using System.Data;
using ErrorLine.Exceptions;

namespace ErrorLine.Services
{
    public interface IUserService
    {
        Task<UserDto> RegisterStudentAsync(StudentUserRegisterDto userDto);
        Task<string> LoginAsync(UserLoginDto userDto);
        Task<IEnumerable<UserDto>> GetAdminUsersAsync();
        Task<IEnumerable<UserDto>> GetUsersInDormitoryAsync(int id);
        Task<UserDto> RegisterMaintenanceStaffInDormitoryAsync(MaintenanceStaffUserRegisterDto userDto, int id);
        Task<UserDto> RegisterAdminAsync(AdminUserRegisterDto userDto);
        Task<UserDto> RegisterSystemAdminAsync(SystemAdminUserRegisterDto userDto);
        Task<IEnumerable<UserDto>> GetMaintenanceWorkersInDormitoryAsync(int userId);
    }
    public class UserService:IUserService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        public UserService(
            AppDbContext context,
            IMapper mapper,
            IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<string> LoginAsync(UserLoginDto userDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == userDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(userDto.Password, user.Password))
            {
                throw new InvalidCredentialsException();
            }

            return await GenerateToken(user);
        }

        private async Task<string> GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(_configuration["Jwt:ExpireDays"]));

            var id = await GetClaimsIdentity(user);
            var token = new JwtSecurityToken(_configuration["Jwt:Issuer"], _configuration["Jwt:Audience"], id.Claims, expires: expires, signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private async Task<ClaimsIdentity> GetClaimsIdentity(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username), // Fix for CS1061: Changed user.UserName to user.Name
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Sid, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.AuthTime, DateTime.Now.ToString(CultureInfo.InvariantCulture))
            };

            if (user.Role != null )
            {
                claims.Add(new Claim(ClaimTypes.Role, user.Role.ToString())); ;
            }

            return new ClaimsIdentity(claims, "Token");
        }
        public async Task<UserDto> RegisterStudentAsync(StudentUserRegisterDto userDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            {
                throw new EmailAlreadyExistsException();
            }
            var user = _mapper.Map<User>(userDto);
            user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            user.DormitoryId = userDto.DormitoryId;

            if (!_context.Dormitories.Any(d => d.Id == userDto.DormitoryId))
            {
               throw new DormitoryNotFoundException();
            }

            user.Role = UserRole.Student;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();


            await _context.Entry(user)
                  .Reference(u => u.Dormitory)
                  .LoadAsync();

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> RegisterMaintenanceStaffInDormitoryAsync(MaintenanceStaffUserRegisterDto userDto,int id)
        {
            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            {
                throw new EmailAlreadyExistsException();
            }
            if (!(userDto.Role == UserRole.MaintenanceWorker || userDto.Role == UserRole.MaintenanceManager))
            {
                throw new InvalidRoleInUserRegistrationException();
            }
            var u = await _context.Users.FindAsync(id);
            var user = _mapper.Map<User>(userDto);
            user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            user.DormitoryId = u.DormitoryId;

           

           

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();


            await _context.Entry(user)
                  .Reference(u => u.Dormitory)
                  .LoadAsync();

            return _mapper.Map<UserDto>(user);
        }
        public async Task<UserDto> RegisterAdminAsync(AdminUserRegisterDto userDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            {
                throw new EmailAlreadyExistsException();
            }

            var user = _mapper.Map<User>(userDto);
            user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            

            if (!_context.Dormitories.Any(d=>d.Id==userDto.DormitoryId))
            {
                throw new DormitoryNotFoundException();
            }
            user.Role = UserRole.Admin;


            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            await _context.Entry(user)
                  .Reference(u => u.Dormitory)
                  .LoadAsync();

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> RegisterSystemAdminAsync(SystemAdminUserRegisterDto userDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            {
                throw new EmailAlreadyExistsException();
            }
            var user = _mapper.Map<User>(userDto);
            user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            user.Role = UserRole.SystemAdmin;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

           

            return _mapper.Map<UserDto>(user);
        }

        public async Task<IEnumerable<UserDto>> GetAdminUsersAsync()
        {
            var users = await _context.Users.Where(u => u.Role == UserRole.Admin).Include(a=>a.Dormitory).ToListAsync();

           

            return _mapper.Map<IEnumerable<UserDto>>(users);
        }
        public async Task<IEnumerable<UserDto>> GetUsersInDormitoryAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            var users = await _context.Users.Where(u => u.DormitoryId==user.DormitoryId).Include(u=>u.Dormitory).ToListAsync();

            return _mapper.Map<IEnumerable<UserDto>>(users);
        }
        public async Task<IEnumerable<UserDto>> GetMaintenanceWorkersInDormitoryAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            var users = await _context.Users
                .Where(u => u.DormitoryId == user.DormitoryId && u.Role==UserRole.MaintenanceWorker)
                .Include(o => o.Dormitory)
                .ToListAsync();

            return _mapper.Map<IEnumerable<UserDto>>(users);

        }
    }
}
