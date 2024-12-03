using Microsoft.AspNetCore.Mvc;
using BusServiceAPI.Models;
using BusServiceAPI.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using BusServiceAPI.Common;

namespace BusServiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FixedTripExpenseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FixedTripExpenseController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/FixedTripExpense
        [HttpGet]
        public IActionResult GetAllFixedTripExpenses()
        {
            var expenses = _context.FixedTripExpenses
                .Include(e => e.Route) // Include Route if needed
                .Select(e => new FixedTripExpenseDTO
                {
                    Id = e.Id,
                    RouteId = e.RouteId,
                    RouteCommission = e.RouteCommission,
                    RewardCommission = e.RewardCommission,
                    Steward = e.Steward,
                    Counter = e.Counter,
                    DcParchi = e.DcParchi,
                    Refreshment = e.Refreshment
                }).ToList();

            return Ok(expenses);
        }

        // GET: api/FixedTripExpense/5
        [HttpGet("{id}")]
        public IActionResult GetFixedTripExpense(int id)
        {
            var expense = _context.FixedTripExpenses
                .Include(e => e.Route) // Include Route if needed
                .Select(e => new FixedTripExpenseDTO
                {
                    Id = e.Id,
                    RouteId = e.RouteId,
                    RouteCommission = e.RouteCommission,
                    RewardCommission = e.RewardCommission,
                    Steward = e.Steward,
                    Counter = e.Counter,
                    DcParchi = e.DcParchi,
                    Refreshment = e.Refreshment
                })
                .FirstOrDefault(e => e.Id == id);

            if (expense == null)
                return NotFound();

            return Ok(expense);
        }

        // POST: api/FixedTripExpense
        [HttpPost]
        public IActionResult CreateFixedTripExpense([FromBody] FixedTripExpenseDTO expenseDto)
        {
            if (expenseDto == null)
                return BadRequest();

            var expense = new FixedTripExpense
            {
                RouteId = expenseDto.RouteId,
                RouteCommission = expenseDto.RouteCommission,
                RewardCommission = expenseDto.RewardCommission,
                Steward = expenseDto.Steward,
                Counter = expenseDto.Counter,
                DcParchi = expenseDto.DcParchi,
                Refreshment = expenseDto.Refreshment
            };

            _context.FixedTripExpenses.Add(expense);
            _context.SaveChanges();

            var createdExpense = new FixedTripExpenseDTO
            {
                Id = expense.Id,
                RouteId = expense.RouteId,
                RouteCommission = expense.RouteCommission,
                RewardCommission = expense.RewardCommission,
                Steward = expense.Steward,
                Counter = expense.Counter,
                DcParchi = expense.DcParchi,
                Refreshment = expense.Refreshment
            };

            return CreatedAtAction(nameof(GetFixedTripExpense), new { id = createdExpense.Id }, createdExpense);
        }

        // PUT: api/FixedTripExpense/5
        [HttpPut("{id}")]
        public IActionResult UpdateFixedTripExpense(int id, [FromBody] FixedTripExpenseDTO expenseDto)
        {
            var expense = _context.FixedTripExpenses.Find(id);
            if (expense == null)
                return NotFound();

            expense.RouteId = expenseDto.RouteId;
            expense.RouteCommission = expenseDto.RouteCommission;
            expense.RewardCommission = expenseDto.RewardCommission;
            expense.Steward = expenseDto.Steward;
            expense.Counter = expenseDto.Counter;
            expense.DcParchi = expenseDto.DcParchi;
            expense.Refreshment = expenseDto.Refreshment;

            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/FixedTripExpense/5
        [HttpDelete("{id}")]
        public IActionResult DeleteFixedTripExpense(int id)
        {
            var expense = _context.FixedTripExpenses.Find(id);
            if (expense == null)
                return NotFound();

            _context.FixedTripExpenses.Remove(expense);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
