using Microsoft.AspNetCore.Mvc;
using BusServiceAPI.Common;
using BusServiceAPI.Models;
using System.Linq;
using BusServiceAPI.Models.DTOs;

namespace BusServiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RouteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RouteController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllRoutes()
        {
            var routes = _context.Routes
                .Select(r => new RouteDTO
                {
                    Id = r.Id,
                    SourceCity = r.SourceCity,
                    SourceAdda = r.SourceAdda,
                    DestinationCity = r.DestinationCity,
                    DestinationAdda = r.DestinationAdda
                }).ToList();

            return Ok(routes);
        }

        [HttpGet("{id}")]
        public IActionResult GetRoute(int id)
        {
            var route = _context.Routes
                .Select(r => new RouteDTO
                {
                    Id = r.Id,
                    SourceCity = r.SourceCity,
                    SourceAdda = r.SourceAdda,
                    DestinationCity = r.DestinationCity,
                    DestinationAdda = r.DestinationAdda
                })
                .FirstOrDefault(r => r.Id == id);

            if (route == null) return NotFound();
            return Ok(route);
        }

        [HttpPost]
        public IActionResult CreateRoute([FromBody] RouteDTO routeDto)
        {
            if (routeDto == null) return BadRequest();

            var route = new BusServiceAPI.Models.Route
            {
                SourceCity = routeDto.SourceCity,
                SourceAdda = routeDto.SourceAdda,
                DestinationCity = routeDto.DestinationCity,
                DestinationAdda = routeDto.DestinationAdda
            };

            _context.Routes.Add(route);
            _context.SaveChanges();

            var createdRoute = new RouteDTO
            {
                Id = route.Id,
                SourceCity = route.SourceCity,
                SourceAdda = route.SourceAdda,
                DestinationCity = route.DestinationCity,
                DestinationAdda = route.DestinationAdda
            };

            return CreatedAtAction(nameof(GetRoute), new { id = createdRoute.Id }, createdRoute);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateRoute(int id, [FromBody] RouteDTO routeDto)
        {
            var route = _context.Routes.Find(id);
            if (route == null) return NotFound();

            route.SourceCity = routeDto.SourceCity;
            route.SourceAdda = routeDto.SourceAdda;
            route.DestinationCity = routeDto.DestinationCity;
            route.DestinationAdda = routeDto.DestinationAdda;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteRoute(int id)
        {
            var route = _context.Routes.Find(id);
            if (route == null) return NotFound();

            _context.Routes.Remove(route);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
