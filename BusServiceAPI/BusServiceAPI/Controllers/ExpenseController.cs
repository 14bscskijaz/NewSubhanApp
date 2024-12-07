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
                .Select(e => new ExpenseDTO
                {
                    Id = e.Id,
                    Date = e.Date,
                    Type = e.Type.ToString(),
                    BusId = e.Bus.Id,
                    BusClosingVoucherId = e.BusClosingVoucher.Id,
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

        // POST: api/Expense
        [HttpPost]
        public IActionResult CreateExpense([FromBody] ExpenseDTO expenseDto)
        {
            if (expenseDto == null) return BadRequest();

            var expense = new Expense
            {
                Date = expenseDto.Date,
                Type = Enum.Parse<ExpenseType>(expenseDto.Type),
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
            expense.Type = Enum.Parse<ExpenseType>(expenseDto.Type);
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
