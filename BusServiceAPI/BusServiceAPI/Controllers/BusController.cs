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
                .AsNoTracking()
                .ToList()
                .Select(b => new BusDTO
                {
                    Id = b.Id,
                    BusNumber = b.BusNumber,
                    BusType = b.BusType?.ToString(),
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
                .AsNoTracking()
                .FirstOrDefault(b => b.Id == id);

            if (bus == null) return NotFound();
            return Ok(new BusDTO
            {
                Id = bus.Id,
                BusNumber = bus.BusNumber,
                BusType = bus.BusType?.ToString(),
                BusOwner = bus.BusOwner,
                Description = bus.Description,
                BusBrand = bus.BusBrand,
                BusStatus = bus.BusStatus
            });
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
                Console.WriteLine($"-----------------------------------------------------------");
                // Console.WriteLine($"Bus Ids: {busIds?.ToList()}");
                // Console.WriteLine($"Another way to print bus Ids: {(busIds != null ? string.Join(",", busIds) : "null")}");
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
                    var tripsCount = vouchers.Count;  // Use vouchers count as trips count
                    var totalPassengers = trips.Sum(t => t.PassengerCount ?? 0);
                    var totalRevenue = vouchers.Sum(v => v.Revenue ?? 0);
                    var voucherExpenseAmount = vouchers.Sum(v =>
                        (decimal)(v.Commission ?? 0) +
                        (decimal)(v.Diesel ?? 0) +
                        (decimal)(v.COilTechnician ?? 0) +
                        (decimal)(v.Toll ?? 0) +
                        (decimal)(v.Cleaning ?? 0) +
                        (decimal)(v.Alliedmor ?? 0) +
                        (decimal)(v.CityParchi ?? 0) +
                        (decimal)(v.Refreshment ?? 0) +
                        (decimal)(v.Repair ?? 0) +
                        (decimal)(v.Generator ?? 0) +
                        (decimal)(v.MiscellaneousExpense ?? 0)
                    );
                    var additionalExpenseAmount = additionalExpenses.Sum(e => (decimal)(e.Amount ?? 0));
                    var totalExpenses = voucherExpenseAmount + additionalExpenseAmount;

                    // Console.WriteLine($"Bus {bus.BusNumber} - Trips: {tripsCount}, Passengers: {totalPassengers}, Revenue: {totalRevenue}, Expenses: {totalExpenses}");

                    // Only include buses that have some activity
                    if (tripsCount > 0 || totalRevenue > 0 || totalExpenses > 0)
                    {
                        // Console.WriteLine($"Adding bus {bus.BusNumber} to report");
                        busReports.Add(new BusReportDTO
                        {
                            BusId = bus.Id,
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
                var columnTotals = new
                {
                    tripsCount = sortedReports.Sum(r => r.TripsCount),
                    passengers = sortedReports.Sum(r => r.Passengers),
                    expenses = sortedReports.Sum(r => r.Expenses),
                    revenue = sortedReports.Sum(r => r.Revenue)
                };
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
                    ColumnTotals = columnTotals
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

        // GET: api/Bus/Report/Detail?busId=1&startDate=...&endDate=...
        [HttpGet("Report/Detail")]
        public IActionResult GetBusReportDetail(
            [FromQuery] int busId,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var bus = _context.Buses
                    .AsNoTracking()
                    .FirstOrDefault(b => b.Id == busId);

                if (bus == null) return NotFound();

                // Get vouchers for this bus within date range
                var voucherQuery = _context.BusClosingVouchers
                    .Where(v => v.BusId == busId);

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

                var voucherIds = vouchers.Select(v => v.Id).ToList();

                var totalPassengers = _context.Trips
                    .Where(t => voucherIds.Contains(t.RouteClosingVoucherId ?? 0))
                    .Sum(t => (int?)(t.PassengerCount ?? 0)) ?? 0;

                // Get additional expenses
                var expenseQuery = _context.Expenses
                    .Where(e => e.BusId == busId);

                if (startDate.HasValue)
                    expenseQuery = expenseQuery.Where(e => e.Date >= startDate);
                if (endDate.HasValue)
                    expenseQuery = expenseQuery.Where(e => e.Date <= endDate);

                var additionalExpenseItems = expenseQuery
                    .Select(e => new AdditionalExpenseItemDTO
                    {
                        Id = e.Id,
                        Date = e.Date,
                        Description = e.Description,
                        Amount = e.Amount
                    })
                    .ToList();

                var detail = new BusReportDetailDTO
                {
                    BusId = bus.Id,
                    BusNumber = bus.BusNumber,
                    BusOwner = bus.BusOwner,
                    TripsCount = vouchers.Count,
                    Passengers = totalPassengers,
                    Revenue = vouchers.Sum(v => v.Revenue ?? 0),
                    Commission = vouchers.Sum(v => (decimal)(v.Commission ?? 0)),
                    Diesel = vouchers.Sum(v => (decimal)(v.Diesel ?? 0)),
                    COilTechnician = vouchers.Sum(v => (decimal)(v.COilTechnician ?? 0)),
                    Toll = vouchers.Sum(v => (decimal)(v.Toll ?? 0)),
                    Cleaning = vouchers.Sum(v => (decimal)(v.Cleaning ?? 0)),
                    Alliedmor = vouchers.Sum(v => (decimal)(v.Alliedmor ?? 0)),
                    CityParchi = vouchers.Sum(v => (decimal)(v.CityParchi ?? 0)),
                    Refreshment = vouchers.Sum(v => (decimal)(v.Refreshment ?? 0)),
                    Repair = vouchers.Sum(v => (decimal)(v.Repair ?? 0)),
                    Generator = vouchers.Sum(v => (decimal)(v.Generator ?? 0)),
                    MiscellaneousExpense = vouchers.Sum(v => (decimal)(v.MiscellaneousExpense ?? 0)),
                    AdditionalExpenses = additionalExpenseItems.Sum(e => (decimal)(e.Amount ?? 0)),
                    AdditionalExpenseItems = additionalExpenseItems
                };

                detail.TotalExpenses = detail.Commission + detail.Diesel + detail.COilTechnician
                    + detail.Toll + detail.Cleaning + detail.Alliedmor + detail.CityParchi
                    + detail.Refreshment + detail.Repair + detail.Generator
                    + detail.MiscellaneousExpense + detail.AdditionalExpenses;

                return Ok(detail);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetBusReportDetail: {ex.Message}");
                return StatusCode(500, "An error occurred while generating bus report detail.");
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
