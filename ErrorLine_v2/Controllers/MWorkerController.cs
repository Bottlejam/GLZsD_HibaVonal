using ErrorLine_v2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ErrorLine_v2.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MWorkerController : Controller
    {
        private readonly ErrorLineDbContext _context;

        public MWorkerController(ErrorLineDbContext context)
        {
            _context = context;
        }

        // Hozzárendelt hibabejelentések megtekintése
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<IssueReport>>> GetIssue(int workerId)
        {
            return await _context.IssueReports.Where(ir => ir.WorkerId == workerId).ToListAsync();
        }

        // Hibabejelentés visszaigazolása

        // Eszközrendelés kérelmezése
    }
}
