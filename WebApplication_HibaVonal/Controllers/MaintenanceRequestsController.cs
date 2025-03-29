using Microsoft.AspNetCore.Mvc;
using WebApplication_HibaVonal.Models;
using Microsoft.EntityFrameworkCore;

namespace WebApplication_HibaVonal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaintenanceRequestController : ControllerBase
    {
        private readonly ErrorLineDbContext _context;

        public MaintenanceRequestController(ErrorLineDbContext context)
        {
            _context = context;
        }

        // GET: api/maintenancerequest
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MaintenanceRequest>>> GetMaintenanceRequests()
        {
            return await _context.MaintenanceRequests.ToListAsync();
        }

        // GET: api/maintenancerequest/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenanceRequest>> GetMaintenanceRequest(int id)
        {
            var maintenanceRequest = await _context.MaintenanceRequests.FindAsync(id);

            if (maintenanceRequest == null)
            {
                return NotFound();
            }

            return maintenanceRequest;
        }

        // POST: api/maintenancerequest
        [HttpPost]
        public async Task<ActionResult<MaintenanceRequest>> PostMaintenanceRequest(MaintenanceRequest maintenanceRequest)
        {
            _context.MaintenanceRequests.Add(maintenanceRequest);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMaintenanceRequest", new { id = maintenanceRequest.Id }, maintenanceRequest);
        }

    }
}