using ErrorLine_v2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ErrorLine_v2.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MManagerController : Controller
    {
        private readonly ErrorLineDbContext _context;

        public MManagerController(ErrorLineDbContext context)
        {
            _context = context;
        }

        //Hibabejelentések megtekintése
        [HttpGet(Name = "GetIssues")]
        public async Task<ActionResult<IEnumerable<IssueReport>>> GetIssues()
        {
            return await _context.IssueReports.ToListAsync();
        }

        //Hibabejelentés státuszának módosítása

        //Hibabejelentés karbantartóhoz rendelése

        //Eszközrendelés leadása
    }
}
