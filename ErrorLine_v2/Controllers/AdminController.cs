using ErrorLine_v2.Dto;
using ErrorLine_v2.Models;
using ErrorLine_v2.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ErrorLine_v2.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdminController : Controller
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly ErrorLineDbContext _context;

        public AdminController(UnitOfWork unitOfWork, ErrorLineDbContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        // Hibabejelentések listázása
        [HttpGet("GetIssueReports")]
        public async Task<ActionResult<IssueReport>> GetIssues()
        {
            var reports = await _unitOfWork.IssueReports.GetAll()
                .Include(r => r.IssueType)
                .Include(r => r.Location)
                .Include(r => r.Reporter)
                .ToListAsync();

            return Ok(reports);
        }

        // Hibabejelentés
        [HttpPost("PostIssue")]
        public async Task<ActionResult<IEnumerable<IssueReport>>> PostIssue(CreateIssueDto createIssueDto)
        {
            var location = _context.Locations.FirstOrDefault(l => l.Id == createIssueDto.LocationId);
            if (location == null)
            {
                return BadRequest($"Nincs ilyen azonosítójú helység: {createIssueDto.LocationId}");
            }
            var issueType = _context.IssueTypes.FirstOrDefault(it => it.Id == createIssueDto.IssueId);
            if (issueType == null)
            {
                return BadRequest($"Nincs ilyen azonosítójú hibatípus: {createIssueDto.IssueId}");
            }
            var reporter = _context.Students.FirstOrDefault(s => s.Id == createIssueDto.ReporterId);
            if (reporter == null)
            {
                return BadRequest($"Nincs ilyen azonosítójú kollégista: {createIssueDto.ReporterId}");
            }

            IssueReport issueReport = new IssueReport
            {
                Date = createIssueDto.Date,
                LocationId = createIssueDto.LocationId,
                IssueId = createIssueDto.IssueId,
                ReporterId = createIssueDto.ReporterId,
                Description = createIssueDto.Description,
                Status = IssueStatus.New
            };

            _context.IssueReports.Add(issueReport);
            await _context.SaveChangesAsync();

            return Ok(issueReport);
        }

        [HttpDelete("DeleteIssueReport")]
        public async Task<ActionResult<IssueReport>> DeleteIssueReport(int reportId)
        {
            await _unitOfWork.IssueReports.DeleteByIdAsync(reportId);
            await _unitOfWork.SaveAsync();

            return Ok();
        }

        //Hibatípusok listázása
        [HttpGet("GetIssueTypes")]
        public async Task<ActionResult<IEnumerable<IssueType>>> GetIssueTypes()
        {
            var issueTypes = await _unitOfWork.IssueTypes.GetAll().ToListAsync();
            return Ok(issueTypes);
        }

        // Hibatípus hozzáadása
        [HttpPost("PostIssueType")]
        public async Task<ActionResult<IssueType>> PostIssueType(string typeName)
        {
            IssueType issueType = new IssueType
            {
                Name = typeName
            };

            _context.IssueTypes.Add(issueType);
            await _context.SaveChangesAsync();

            return Ok(issueType);
        }

        //Hibatípus törlése
        [HttpDelete("DeleteIssueType")]
        public async Task<ActionResult<IssueType>> DeleteIssueType(int typeId)
        {
            var issueType = await _context.IssueTypes.FirstOrDefaultAsync(t => t.Id == typeId);
            if (issueType == null)
            {
                return BadRequest($"Nincs ilyen azonosítójú hivatípus: {typeId}");
            }
            _context.IssueTypes.Remove(issueType);
            await _context.SaveChangesAsync();

            return Ok(issueType);
        }

        // Felszerelések listázása
        [HttpGet("GetEquipments")]
        public async Task<ActionResult<IEnumerable<Equipment>>> GetEquipment()
        {
            var equipments = await _unitOfWork.Equipments.GetAll().ToListAsync();
            return Ok(equipments);
        }

        // Felszerelés létrehozása
        [HttpPost("PostEquipment")]
        public async Task<ActionResult<Equipment>> PostEquipment(CreateEquipmentDto createEquipmentDto)
        {
            Equipment equipment = new Equipment
            {
                Name = createEquipmentDto.Name,
                Stock = createEquipmentDto.Stock
            };

            _context.Equipment.Add(equipment);
            await _context.SaveChangesAsync();

            return Ok(equipment);
        }

        //Felszerelés eltávolítása
        [HttpDelete("DeleteEquipment")]
        public async Task<ActionResult<Equipment>> DeleteEquipment(int equipmentId)
        {
            var equipment = await _context.Equipment.FirstOrDefaultAsync(e => e.Id == equipmentId);
            if (equipment == null)
            {
                return BadRequest($"Nincs ilyen azonosítójú felszerelés: {equipmentId}");
            }
            _context.Equipment.Remove(equipment);
            await _context.SaveChangesAsync();

            return Ok(equipment);
        }

        // Helységek listázása
        [HttpGet("GetLocations")]
        public async Task<ActionResult<IEnumerable<Location>>> GetLocations()
        {
            var locations = await _unitOfWork.Locations.GetAll().ToListAsync();
            return Ok(locations);
        }

        // Helység létrehozása
        [HttpPost("PostLocation")]
        public async Task<ActionResult<Location>> PostLocation(CreateLocationDto createLocationDto)
        {

            Location  location = new Location
            {
                Name = createLocationDto.Name,
                Type = createLocationDto.Type,
            };

            _context.Locations.Add(location);
            await _context.SaveChangesAsync();

            return Ok(location);
        }

        // Helység eltávolítása
        [HttpDelete("DeleteLocation")]
        public async Task<ActionResult<Location>> DeleteLocation(int locationId)
        {
            var location = await _context.Locations.FirstOrDefaultAsync(l => l.Id == locationId);
            if (location == null)
            {
                return BadRequest($"Nincs ilyen azonosítójú helység: {locationId}");
            }
            _context.Locations.Remove(location);
            await _context.SaveChangesAsync();

            return Ok(location);
        }

        // Kollégisták lekérése
        [HttpGet("GetStudents")]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            var students = await _unitOfWork.Students.GetAll().ToListAsync();
            return Ok(students);
        }

        // Kollégista felvétele
        [HttpPost("PostStudent")]
        public async Task<ActionResult<Student>> PostStudent(CreateStudentDto createStudentDto)
        {
            var location = _context.Locations.FirstOrDefault(l => l.Id == createStudentDto.RoomId && l.Type == LocationType.Room);
            if (location == null)
            {
                BadRequest($"Nincs ilyen azonosítójú szoba {createStudentDto.RoomId}");
            }
            Student student = new Student
            {
                Name = createStudentDto.Name,
                Email = createStudentDto.Email,
                Role = UserRole.Student,
                RoomId = createStudentDto.RoomId
            };
            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok(student);
        }

        // Kollégista törlése
        [HttpDelete("DeleteStudent")]
        public async Task<ActionResult<Student>> DeleteStudent(int studentId)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == studentId);
            if (student == null)
            {
                return BadRequest($"Nincs ilyen azonosítójú helység: {studentId}");
            }
            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return Ok(student);
        }
    }
}
