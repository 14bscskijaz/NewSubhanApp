using Microsoft.AspNetCore.Mvc;
using BusServiceAPI.Common;
using BusServiceAPI.Models;
using Microsoft.EntityFrameworkCore;
using BusServiceAPI.Models.DTOs;

namespace BusServiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BusController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllBuses()
        {
            var buses = _context.Buses
                .Select(b => new BusDTO
                {
                    Id = b.Id,
                    BusNumber = b.BusNumber,
                    BusType = b.BusType.ToString() ,
                    BusOwner = b.BusOwner,
                    Description = b.Description,
                    BusStatus = b.BusStatus,
                    BusBrand = b.BusBrand,
                }).ToList();

            return Ok(buses);
        }

        [HttpGet("{id}")]
        public IActionResult GetBus(int id)
        {
            var bus = _context.Buses
                .Select(b => new BusDTO
                {
                    Id = b.Id,
                    BusNumber = b.BusNumber,
                    BusType = b.BusType.ToString() ,
                    BusOwner = b.BusOwner,
                    Description = b.Description,
                    BusBrand = b.BusBrand,
                    BusStatus = b.BusStatus
                })
                .FirstOrDefault(b => b.Id == id);

            if (bus == null) return NotFound();
            return Ok(bus);
        }

        // TODO: Khizar bhai check this method's implementation
        // GET: api/Bus/Report
        [HttpGet("Report")]
        public IActionResult GetBusReport(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery(Name = "busId")] List<int>? busIds = null)
        {
            try
            {
                // Console.WriteLine($"-----------------------------------------------------------");
                // Initialize the list to store bus reports
                var busReports = new List<BusReportDTO>();

                // Start with base query for buses
                IQueryable<Bus> busQuery = _context.Buses.AsQueryable();

                // Filter by specific bus IDs if provided
                if (busIds != null && busIds.Any())
                {
                    busQuery = busQuery.Where(b => busIds.Contains(b.Id));
                }

                // Get all buses that match the filter
                var buses = busQuery.Select(b => new { b.Id, b.BusNumber, b.BusOwner }).ToList();

                // Console.WriteLine($"buses: {string.Join(",", buses)}");

                foreach (var bus in buses)
                {
                    // Console.WriteLine($"Processing bus: {bus.BusNumber} (ID: {bus.Id})");
                    
                    // Get vouchers for this bus within date range
                    var voucherQuery = _context.BusClosingVouchers
                        .Where(v => v.BusId == bus.Id);
                    
                    if (startDate.HasValue)
                        voucherQuery = voucherQuery.Where(v => v.Date >= startDate);
                    if (endDate.HasValue)
                        voucherQuery = voucherQuery.Where(v => v.Date <= endDate);

                    var vouchers = voucherQuery
                        .Select(v => new { 
                            v.Id, 
                            v.Revenue,
                            v.Commission,
                            v.Diesel,
                            v.COilTechnician,
                            v.Toll,
                            v.Cleaning,
                            v.Alliedmor,
                            v.CityParchi,
                            v.Refreshment,
                            v.Repair,
                            v.Generator,
                            v.MiscellaneousExpense
                        })
                        .ToList();

                    // Console.WriteLine($"Found {vouchers.Count} vouchers for bus {bus.BusNumber}");

                    // Get trips related to these vouchers
                    var voucherIds = vouchers.Select(v => v.Id).ToList();
                    var trips = _context.Trips
                        .Where(t => voucherIds.Contains(t.RouteClosingVoucherId ?? 0))
                        .Select(t => new { t.PassengerCount })
                        .ToList();

                    // Console.WriteLine($"Found {trips.Count} trips for bus {bus.BusNumber}");

                    // Get additional expenses for this bus within date range
                    var expenseQuery = _context.Expenses
                        .Where(e => e.BusId == bus.Id);
                    
                    if (startDate.HasValue)
                        expenseQuery = expenseQuery.Where(e => e.Date >= startDate);
                    if (endDate.HasValue)
                        expenseQuery = expenseQuery.Where(e => e.Date <= endDate);

                    var additionalExpenses = expenseQuery
                        .Select(e => new { e.Amount })
                        .ToList();

                    // Console.WriteLine($"Found {additionalExpenses.Count} additional expenses for bus {bus.BusNumber}");

                    // Calculate aggregated values
                    var tripsCount = trips.Count;
                    var totalPassengers = trips.Sum(t => t.PassengerCount ?? 0);
                    var totalRevenue = vouchers.Sum(v => v.Revenue ?? 0);
                    var voucherExpenses = vouchers.Sum(v => 
                        (v.Commission ?? 0) + 
                        (v.Diesel ?? 0) + 
                        (v.COilTechnician ?? 0) + 
                        (v.Toll ?? 0) + 
                        (v.Cleaning ?? 0) + 
                        (v.Alliedmor ?? 0) + 
                        (v.CityParchi ?? 0) + 
                        (v.Refreshment ?? 0) + 
                        (v.Repair ?? 0) + 
                        (v.Generator ?? 0) + 
                        (v.MiscellaneousExpense ?? 0));
                    var additionalExpenseAmount = additionalExpenses.Sum(e => e.Amount ?? 0);
                    var totalExpenses = voucherExpenses + additionalExpenseAmount;

                    // Console.WriteLine($"Bus {bus.BusNumber} - Trips: {tripsCount}, Passengers: {totalPassengers}, Revenue: {totalRevenue}, Expenses: {totalExpenses}");

                    // Only include buses that have some activity
                    if (tripsCount > 0 || totalRevenue > 0 || totalExpenses > 0)
                    {
                        // Console.WriteLine($"Adding bus {bus.BusNumber} to report");
                        busReports.Add(new BusReportDTO
                        {
                            BusNumber = bus.BusNumber,
                            BusOwner = bus.BusOwner,
                            TripsCount = tripsCount,
                            Passengers = totalPassengers,
                            Revenue = totalRevenue,
                            Expenses = totalExpenses
                        });
                    }
                    else
                    {
                        // Console.WriteLine($"Skipping bus {bus.BusNumber} - no activity");
                    }
                }

                // Sort by bus number and apply pagination
                var sortedReports = busReports.OrderBy(r => r.BusNumber).ToList();
                // Console.WriteLine($"sortedReports count: {sortedReports.Count}");
                // Console.WriteLine($"sortedReports: {System.Text.Json.JsonSerializer.Serialize(sortedReports, new System.Text.Json.JsonSerializerOptions { WriteIndented = true })}");
                
                var totalCount = sortedReports.Count;
                // Console.WriteLine($"Pagination parameters - page: {page}, pageSize: {pageSize}, skip: {(page - 1) * pageSize}, totalCount: {totalCount}");
                
                var paginatedReports = sortedReports
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
                
                // Console.WriteLine($"Paginated results count: {paginatedReports.Count}");
                // Console.WriteLine($"These are the paginated results: {System.Text.Json.JsonSerializer.Serialize(paginatedReports, new System.Text.Json.JsonSerializerOptions { WriteIndented = true })}");

                // Create response with pagination metadata
                var response = new
                {
                    TotalItems = totalCount,
                    PageNumber = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
                    Items = paginatedReports,
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetBusReport: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, "An error occurred while generating the bus report.");
            }
        }

        [HttpPost]
        public IActionResult CreateBus([FromBody] BusDTO busDto)
        {
            if (busDto == null) return BadRequest();

            var bus = new Bus
            {
                BusNumber = busDto.BusNumber,
                BusType = !string.IsNullOrEmpty(busDto.BusType) 
                    ? (BusTypeEnum)Enum.Parse(typeof(BusTypeEnum), busDto.BusType)
                    : BusTypeEnum.Standard,
                BusOwner = busDto.BusOwner,
                Description = busDto.Description,
                BusBrand = busDto.BusBrand,
                BusStatus = busDto.BusStatus
            };

            _context.Buses.Add(bus);
            _context.SaveChanges();

            var createdBus = new BusDTO
            {
                Id = bus.Id,
                BusNumber = bus.BusNumber,
                BusType = bus.BusType.ToString(),
                BusOwner = bus.BusOwner,
                Description = bus.Description,
                BusBrand = bus.BusBrand,
                BusStatus = bus.BusStatus
            };

            return CreatedAtAction(nameof(GetBus), new { id = createdBus.Id }, createdBus);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateBus(int id, [FromBody] BusDTO busDto)
        {
            var bus = _context.Buses.Find(id);
            if (bus == null) return NotFound();

            bus.BusNumber = busDto.BusNumber;
            bus.BusType = !string.IsNullOrEmpty(busDto.BusType) 
                ? (BusTypeEnum)Enum.Parse(typeof(BusTypeEnum), busDto.BusType)
                : BusTypeEnum.Standard;
            bus.BusOwner = busDto.BusOwner;
            bus.Description = busDto.Description;
            bus.BusBrand = busDto.BusBrand;
            bus.BusStatus = busDto.BusStatus;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBus(int id)
        {
            var bus = _context.Buses.Find(id);
            if (bus == null) return NotFound();

            _context.Buses.Remove(bus);
            _context.SaveChanges();
            return NoContent();
        }
    }
}