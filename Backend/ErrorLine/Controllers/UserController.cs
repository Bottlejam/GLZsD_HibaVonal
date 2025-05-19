using ErrorLine.Dtos;
using ErrorLine.Entities;
using ErrorLine.Exceptions;
using ErrorLine.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ErrorLine.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _UserService;

        public UserController(IUserService userService)
        {
            _UserService = userService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userDto)
        {
            try
            {
                var token = await _UserService.LoginAsync(userDto);
                return Ok(new ApiResponseDto<object>(200, "Login has been successful.", token));
            }
            catch (InvalidCredentialsException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, $"Unexpected error occured: {ex.Message}"));
            }

        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] StudentUserRegisterDto userDto)
        {
            try
            {
                var user = await _UserService.RegisterStudentAsync(userDto);
                return Ok(new ApiResponseDto<object>(200, "Registration has been succesful.",user));
            }
             catch (DormitoryNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (EmailAlreadyExistsException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }

        [HttpPost("Admin/registerMaintenanceStaff")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RegisterMaintenanceStaff([FromBody] MaintenanceStaffUserRegisterDto userDto)
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var user = await _UserService.RegisterMaintenanceStaffInDormitoryAsync(userDto,userId);
                return Ok(new ApiResponseDto<object>(200, "Registration has been succesful.", user));
            }
            catch (InvalidRoleInUserRegistrationException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (EmailAlreadyExistsException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, $"Unexpected error occured: {ex.Message}"));
            }
        }

        [HttpPost("SystemAdmin/registerAdmin")]
        [Authorize(Roles = "SystemAdmin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] AdminUserRegisterDto userDto)
        {
            try
            {
               
                var user = await _UserService.RegisterAdminAsync(userDto);
                return Ok(new ApiResponseDto<object>(200, "Registration has been succesful.", user));
            } 
            catch (DormitoryNotFoundException ex)
            {
                return NotFound(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (EmailAlreadyExistsException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }

        [HttpPost("SystemAdmin/registerSystemAdmin")]
        [Authorize(Roles = "SystemAdmin")]
        public async Task<IActionResult> RegisterSystemAdmin([FromBody] SystemAdminUserRegisterDto userDto)
        {
            try
            {
                var user = await _UserService.RegisterSystemAdminAsync(userDto);
                return Ok(new ApiResponseDto<object>(200, "Registration has been succesful.", user));
            }
            catch (EmailAlreadyExistsException ex)
            {
                return BadRequest(new ApiResponseDto<object>(ex.StatusCode, ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }

        [HttpGet("SystemAdmin/Get/AllAdminUsers")]
        [Authorize(Roles = "SystemAdmin")]
        public async Task<IActionResult> GetAllAdminUsers()
        {
            try
            {
                var users = await _UserService.GetAdminUsersAsync();
                return Ok(new ApiResponseDto<object>(200, "Admin Users has been listed succesfully.", users));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }

        [HttpGet("Admin/Get/AllUsersInDormitory")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsersInDormitory()
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var users = await _UserService.GetUsersInDormitoryAsync(userId);
                return Ok(new ApiResponseDto<object>(200, "Users has been listed succesfully in your dormitory.", users));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }

        [HttpGet("MaintenanceManager/Get/AllMaintenanceWorkersInDormitory")]
        [Authorize(Roles = "MaintenanceManager")]
        public async Task<IActionResult> GetAllMaintenanceWorkersInDormitory()
        {
            try
            {
                var userId = int.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
                var users = await _UserService.GetMaintenanceWorkersInDormitoryAsync(userId);
                return Ok(new ApiResponseDto<object>(200, "Maintenance workers has been listed succesfully in your dormitory.", users));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponseDto<object>(500, "Unexpected error occured."));
            }
        }

    }
}
