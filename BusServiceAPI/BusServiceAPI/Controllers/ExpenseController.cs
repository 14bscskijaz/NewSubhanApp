using Microsoft.AspNetCore.Mvc;
using BusServiceAPI.Common;
using BusServiceAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using BusServiceAPI.Models.DTOs;

namespace BusServiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExpenseController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Expense
        [HttpGet]
        public IActionResult GetAllExpenses()
        {
            var expenses = _context.Expenses
                .Include(e => e.Bus)  // Include Bus information if necessary
                .Include(e => e.BusClosingVoucher)
                .Select(e => new ExpenseDTO
                {
                    Id = e.Id,
                    Date = e.Date,
                    Type = e.Type.ToString(),
                    BusId = e.Bus != null ? e.Bus.Id : e.BusId,
                    BusClosingVoucherId = e.BusClosingVoucherId,
                    Amount = e.Amount,
                    Description = e.Description
                }).ToList();

            return Ok(expenses);
        }

        // GET: api/Expense/5
        [HttpGet("{id}")]
        public IActionResult GetExpense(int id)
        {
            var expense = _context.Expenses
                .Include(e => e.Bus)  // Include Bus information if needed
                .Include(e => e.BusClosingVoucher) // Include BusClosingVoucher to prevent null reference
                .Select(e => new ExpenseDTO
                {
                    Id = e.Id,
                    Date = e.Date,
                    Type = e.Type.ToString(),
                    BusId = e.Bus.Id,
                    BusClosingVoucherId = e.BusClosingVoucher.Id,
                    Amount = e.Amount,
                    Description = e.Description
                })
                .FirstOrDefault(e => e.Id == id);

            if (expense == null) return NotFound();
            return Ok(expense);
        }

        // GET: api/Expense/Report
        [HttpGet("Report")]
        public IActionResult GetExpenseReport(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string? type = null,
            [FromQuery(Name = "busId")] List<int> busIds = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            IQueryable<Expense> query = _context.Expenses
                .Include(e => e.Bus)
                .Include(e => e.BusClosingVoucher);

            // Print the incoming parameters for debugging
            Console.WriteLine($"startDate: {startDate}, endDate: {endDate}, Type: {type}");
            Console.WriteLine($"BusId: {(busIds != null ? string.Join(",", busIds) : "null")}, Page: {page}, PageSize: {pageSize}");

            // Apply filters
            if (startDate.HasValue)
            {
                query = query.Where(e => e.Date >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                // Add one day to include the end date fully
                var nextDay = endDate.Value.AddDays(1);
                query = query.Where(e => e.Date < nextDay);
            }

            if (!string.IsNullOrEmpty(type))
            {
                if (Enum.TryParse<ExpenseType>(type, true, out var expenseType))
                {
                    query = query.Where(e => e.Type == expenseType);
                }
            }

            if (busIds != null && busIds.Any())
            {
                query = query.Where(e => e.BusId.HasValue && busIds.Contains(e.BusId.Value));
            }

            // Filter entries with 0 amount
            query = query.Where(e => e.Amount > 0);

            // Calculate total for pagination metadata
            var totalItems = query.Count();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            // Apply pagination
            var expenses = query
                .OrderByDescending(e => e.Date)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(e => new ExpenseReportDTO
                {
                    Id = e.Id,
                    Date = e.Date,
                    Type = e.Type.ToString(),
                    BusId = e.Bus != null ? e.Bus.Id : e.BusId,
                    BusNumber = e.Bus != null ? e.Bus.BusNumber : string.Empty,
                    BusClosingVoucherId = e.BusClosingVoucherId,
                    Amount = e.Amount,
                    Description = e.Description
                })
                .ToList();

            // Calculate total amount
            var totalAmount = expenses.Sum(e => e.Amount);
            var columnTotals = new 
            {
                amount = totalAmount
            };

            // Create response with pagination metadata
            var result = new 
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = page,
                PageSize = pageSize,
                Items = expenses,
                ColumnTotals = columnTotals
            };

            return Ok(result);
        }

        // POST: api/Expense
        [HttpPost]
        public IActionResult CreateExpense([FromBody] ExpenseDTO expenseDto)
        {
            if (expenseDto == null) return BadRequest();

            var expense = new Expense
            {
                Date = expenseDto.Date,
                Type = !string.IsNullOrEmpty(expenseDto.Type) ? Enum.Parse<ExpenseType>(expenseDto.Type) : ExpenseType.general,
                BusId = expenseDto.BusId,
                BusClosingVoucherId = expenseDto.BusClosingVoucherId,
                Amount = expenseDto.Amount,
                Description = expenseDto.Description
            };

            _context.Expenses.Add(expense);
            _context.SaveChanges();

            var createdExpense = new ExpenseDTO
            {
                Id = expense.Id,
                Date = expense.Date,
                Type = expense.Type.ToString(),
                BusId = expense.BusId,
                BusClosingVoucherId = expense.BusClosingVoucherId,
                Amount = expense.Amount,
                Description = expense.Description
            };

            return CreatedAtAction(nameof(GetExpense), new { id = createdExpense.Id }, createdExpense);
        }

        // PUT: api/Expense/5
        [HttpPut("{id}")]
        public IActionResult UpdateExpense(int id, [FromBody] ExpenseDTO expenseDto)
        {
            var expense = _context.Expenses.Find(id);
            if (expense == null) return NotFound();

            expense.Date = expenseDto.Date;
            expense.Type = !string.IsNullOrEmpty(expenseDto.Type) ? Enum.Parse<ExpenseType>(expenseDto.Type) : ExpenseType.general;
            expense.BusId = expenseDto.BusId;
            expense.BusClosingVoucherId = expenseDto.BusClosingVoucherId;
            expense.Amount = expenseDto.Amount;
            expense.Description = expenseDto.Description;

            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/Expense/5
        [HttpDelete("{id}")]
        public IActionResult DeleteExpense(int id)
        {
            var expense = _context.Expenses.Find(id);
            if (expense == null) return NotFound();

            _context.Expenses.Remove(expense);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
