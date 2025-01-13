
using Microsoft.AspNetCore.Mvc;
using BusServiceAPI.Models;
using BusServiceAPI.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using BusServiceAPI.Common;

namespace BusServiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TripController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Trip
        [HttpGet]
        public IActionResult GetAllTrips()
        {
            var trips = _context.Trips
                .Include(t => t.Route) // Include Route if needed
              .Select(t => new TripDTO
              {
                  Id = t.Id,
                  RouteClosingVoucherId = t.RouteClosingVoucherId,
                  RouteId = t.RouteId,
                  PassengerCount = t.PassengerCount,
                  FullTicketCount = t.FullTicketCount,
                  HalfTicketCount = t.HalfTicketCount,
                  FreeTicketCount = t.FreeTicketCount,
                  RefreshmentExpense = t.RefreshmentExpense,
                  LoadEarning = t.LoadEarning,
                  RewardCommission = t.RewardCommission,
                  Revenue = t.Revenue,
                  RevenueDiffExplanation = t.RevenueDiffExplanation,
                  Date = t.Date,
                  CheckerExpense = t.CheckerExpense,
                  Reference = t.Reference
              }).ToList();

            return Ok(trips);
        }

        // GET: api/Trip/5
        [HttpGet("{id}")]
        public IActionResult GetTrip(int id)
        {
            var trip = _context.Trips
                .Include(t => t.Route) // Include Route if needed
               .Select(t => new TripDTO
               {
                   Id = t.Id,
                   RouteClosingVoucherId = t.RouteClosingVoucherId,
                   RouteId = t.RouteId,
                   PassengerCount = t.PassengerCount,
                   FullTicketCount = t.FullTicketCount,
                   HalfTicketCount = t.HalfTicketCount,
                   FreeTicketCount = t.FreeTicketCount,
                   RefreshmentExpense = t.RefreshmentExpense,
                   LoadEarning = t.LoadEarning,
                   RewardCommission = t.RewardCommission,
                   Revenue = t.Revenue,
                   RevenueDiffExplanation = t.RevenueDiffExplanation,
                   Date = t.Date,
                   CheckerExpense = t.CheckerExpense,
                   Reference = t.Reference
               })
                .FirstOrDefault(t => t.Id == id);

            if (trip == null)
                return NotFound();

            return Ok(trip);
        }

        // POST: api/Trip
        [HttpPost]
        public IActionResult CreateTrip([FromBody] TripDTO tripDto)
        {
            if (tripDto == null)
                return BadRequest();

            var trip = new Trip
            {
                RouteClosingVoucherId = tripDto.RouteClosingVoucherId,
                RouteId = tripDto.RouteId,
                PassengerCount = tripDto.PassengerCount,
                FullTicketCount = tripDto.FullTicketCount,
                HalfTicketCount = tripDto.HalfTicketCount,
                FreeTicketCount = tripDto.FreeTicketCount,
                RefreshmentExpense = tripDto.RefreshmentExpense,
                LoadEarning = tripDto.LoadEarning,
                RewardCommission = tripDto.RewardCommission,
                Revenue = tripDto.Revenue,
                RevenueDiffExplanation = tripDto.RevenueDiffExplanation,
                Date = tripDto.Date,
                CheckerExpense = tripDto.CheckerExpense,
                Reference = tripDto.Reference
            };

            _context.Trips.Add(trip);
            _context.SaveChanges();

            var createdTrip = new TripDTO
            {
                Id = trip.Id,
                RouteClosingVoucherId = trip.RouteClosingVoucherId,
                RouteId = trip.RouteId,
                PassengerCount = trip.PassengerCount,
                FullTicketCount = trip.FullTicketCount,
                HalfTicketCount = trip.HalfTicketCount,
                FreeTicketCount = trip.FreeTicketCount,
                RefreshmentExpense = trip.RefreshmentExpense,
                LoadEarning = trip.LoadEarning,
                RewardCommission = trip.RewardCommission,
                Revenue = trip.Revenue,
                RevenueDiffExplanation = trip.RevenueDiffExplanation,
                Date = trip.Date,
                CheckerExpense = trip.CheckerExpense,
                Reference = trip.Reference
            };

            return CreatedAtAction(nameof(GetTrip), new { id = createdTrip.Id }, createdTrip);
        }

        // PUT: api/Trip/5
        [HttpPut("{id}")]
        public IActionResult UpdateTrip(int id, [FromBody] TripDTO tripDto)
        {
            var trip = _context.Trips.Find(id);
            if (trip == null)
                return NotFound();

            trip.RouteClosingVoucherId = tripDto.RouteClosingVoucherId;
            trip.RouteId = tripDto.RouteId;
            trip.PassengerCount = tripDto.PassengerCount;
            trip.FullTicketCount = tripDto.FullTicketCount;
            trip.HalfTicketCount = tripDto.HalfTicketCount;
            trip.FreeTicketCount = tripDto.FreeTicketCount;
            trip.RefreshmentExpense = tripDto.RefreshmentExpense;
            trip.LoadEarning = tripDto.LoadEarning;
            trip.RewardCommission = tripDto.RewardCommission;
            trip.Revenue = tripDto.Revenue;
            trip.RevenueDiffExplanation = tripDto.RevenueDiffExplanation;
            trip.Date = tripDto.Date;
            trip.CheckerExpense = tripDto.CheckerExpense;
            trip.Reference = tripDto.Reference;
            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/Trip/5
        [HttpDelete("{id}")]
        public IActionResult DeleteTrip(int id)
        {
            var trip = _context.Trips.Find(id);
            if (trip == null)
                return NotFound();

            _context.Trips.Remove(trip);
            _context.SaveChanges();

            return NoContent();
        }
    }
}