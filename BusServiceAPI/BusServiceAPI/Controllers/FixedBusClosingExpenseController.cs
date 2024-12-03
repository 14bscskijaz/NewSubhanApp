using Microsoft.AspNetCore.Mvc;
using BusServiceAPI.Models;
using BusServiceAPI.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using BusServiceAPI.Common;

namespace BusServiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FixedBusClosingExpenseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FixedBusClosingExpenseController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/FixedBusClosingExpense
        [HttpGet]
        public IActionResult GetAllFixedBusClosingExpense()
        {
            var Expense = _context.FixedBusClosingExpenses
                .Include(e => e.Route) // Include Route if needed
                .Select(e => new FixedBusClosingExpenseDTO
                {
                    Id = e.Id,
                    RouteId = e.RouteId,
                    DriverCommission = e.DriverCommission,
                    COilExpense = e.COilExpense,
                    TollTax = e.TollTax,
                    HalfSafai = e.HalfSafai,
                    FullSafai = e.FullSafai,
                    DcPerchi = e.DcPerchi,
                    RefreshmentRate = e.RefreshmentRate,
                    AlliedMorde = e.AlliedMorde
                }).ToList();

            return Ok(Expense);
        }

        // GET: api/FixedBusClosingExpense/5
        [HttpGet("{id}")]
        public IActionResult GetFixedBusClosingExpense(int id)
        {
            var expense = _context.FixedBusClosingExpenses
                .Include(e => e.Route) // Include Route if needed
                .Select(e => new FixedBusClosingExpenseDTO
                {
                    Id = e.Id,
                    RouteId = e.RouteId,
                    DriverCommission = e.DriverCommission,
                    COilExpense = e.COilExpense,
                    TollTax = e.TollTax,
                    HalfSafai = e.HalfSafai,
                    FullSafai = e.FullSafai,
                    DcPerchi = e.DcPerchi,
                    RefreshmentRate = e.RefreshmentRate,
                    AlliedMorde = e.AlliedMorde
                })
                .FirstOrDefault(e => e.Id == id);

            if (expense == null)
                return NotFound();

            return Ok(expense);
        }

        // POST: api/FixedBusClosingExpense
        [HttpPost]
        public async Task<IActionResult> CreateFixedBusClosingExpense([FromBody] FixedBusClosingExpenseDTO expenseDto)
        {
            if (expenseDto == null)
                return BadRequest("Expense data is required");

            // Check if route exists
            var routeExists = await _context.Routes.AnyAsync(r => r.Id == expenseDto.RouteId);
            if (!routeExists)
            {
                return BadRequest($"Route with ID {expenseDto.RouteId} does not exist");
            }

            var expense = new FixedBusClosingExpense
            {
                RouteId = expenseDto.RouteId,
                DriverCommission = expenseDto.DriverCommission,
                COilExpense = expenseDto.COilExpense,
                TollTax = expenseDto.TollTax,
                HalfSafai = expenseDto.HalfSafai,
                FullSafai = expenseDto.FullSafai,
                DcPerchi = expenseDto.DcPerchi,
                RefreshmentRate = expenseDto.RefreshmentRate,
                AlliedMorde = expenseDto.AlliedMorde
            };

            try
            {
                _context.FixedBusClosingExpenses.Add(expense);
                await _context.SaveChangesAsync();

                var createdExpense = new FixedBusClosingExpenseDTO
                {
                    Id = expense.Id,
                    RouteId = expense.RouteId,
                    DriverCommission = expense.DriverCommission,
                    COilExpense = expense.COilExpense,
                    TollTax = expense.TollTax,
                    HalfSafai = expense.HalfSafai,
                    FullSafai = expense.FullSafai,
                    DcPerchi = expense.DcPerchi,
                    RefreshmentRate = expense.RefreshmentRate,
                    AlliedMorde = expense.AlliedMorde
                };

                return CreatedAtAction(nameof(GetFixedBusClosingExpense),
                    new { id = createdExpense.Id },
                    createdExpense);
            }
            catch (DbUpdateException ex)
            {
                return BadRequest($"Failed to create expense: {ex.InnerException?.Message ?? ex.Message}");
            }
        }
        // PUT: api/FixedBusClosingExpense/5
        [HttpPut("{id}")]
        public IActionResult UpdateFixedBusClosingExpense(int id, [FromBody] FixedBusClosingExpenseDTO expenseDto)
        {
            var expense = _context.FixedBusClosingExpenses.Find(id);
            if (expense == null)
                return NotFound();

            expense.RouteId = expenseDto.RouteId;
            expense.DriverCommission = expenseDto.DriverCommission;
            expense.COilExpense = expenseDto.COilExpense;
            expense.TollTax = expenseDto.TollTax;
            expense.HalfSafai = expenseDto.HalfSafai;
            expense.FullSafai = expenseDto.FullSafai;
            expense.DcPerchi = expenseDto.DcPerchi;
            expense.RefreshmentRate = expenseDto.RefreshmentRate;
            expense.AlliedMorde = expenseDto.AlliedMorde;

            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/FixedBusClosingExpense/5
        [HttpDelete("{id}")]
        public IActionResult DeleteFixedBusClosingExpense(int id)
        {
            var expense = _context.FixedBusClosingExpenses.Find(id);
            if (expense == null)
                return NotFound();

            _context.FixedBusClosingExpenses.Remove(expense);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
