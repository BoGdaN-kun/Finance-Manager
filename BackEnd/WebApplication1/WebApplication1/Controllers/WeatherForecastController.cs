using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Datacontext;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly GeneratingUsers _generatingUsers;

        public WeatherForecastController(DataContext context)
        {
            _context = context;
            _generatingUsers = new GeneratingUsers();
        }

        [HttpPost("generate-sample-data")]
        public IActionResult GenerateSampleData()
        {
            var users = _generatingUsers.GenerateSampleData(100000, 5); // Generate 10 users with 5 transactions each
            _context.Users.AddRange(users);
            _context.SaveChanges();
            //_context.GenerateSampleData(10, 5); // Generate 10 users with 5 transactions each
            return Ok("Sample data generated successfully.");
        }
    }
}
