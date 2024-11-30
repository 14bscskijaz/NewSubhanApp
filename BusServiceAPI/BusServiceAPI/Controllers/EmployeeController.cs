using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BusServiceAPI.Models;
using BusServiceAPI.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using BusServiceAPI.Common;

namespace BusServiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeDTO>>> GetEmployees()
        {
            var employees = await _context.Employees.ToListAsync();
            var employeeDTOs = employees.Select(e => new EmployeeDTO
            {
                Id = e.Id,
                CNIC = e.CNIC,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Address = e.Address,
                MobileNumber = e.MobileNumber,
                HireDate = e.HireDate,
                EmployeeStatus = e.EmployeeStatus,
                DOB = e.DOB,
                Notes = e.Notes,
                EmployeeType = e.EmployeeType.ToString()
            }).ToList();

            return Ok(employeeDTOs);
        }

        // GET: api/Employees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDTO>> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            var employeeDTO = new EmployeeDTO
            {
                Id = employee.Id,
                CNIC = employee.CNIC,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Address = employee.Address,
                MobileNumber = employee.MobileNumber,
                HireDate = employee.HireDate,
                EmployeeStatus = employee.EmployeeStatus,
                DOB = employee.DOB,
                Notes = employee.Notes,
                EmployeeType = employee.EmployeeType.ToString()
            };

            return Ok(employeeDTO);
        }

        // POST: api/Employees
        [HttpPost]
        public async Task<ActionResult<EmployeeDTO>> PostEmployee(EmployeeDTO employeeDTO)
        {
            if (EmployeeExists(employeeDTO.CNIC))
            {
                return BadRequest("Employee with this CNIC already exists.");
            }

            var employee = new Employee
            {
                CNIC = employeeDTO.CNIC,
                FirstName = employeeDTO.FirstName,
                LastName = employeeDTO.LastName,
                Address = employeeDTO.Address,
                MobileNumber = employeeDTO.MobileNumber,
                HireDate = employeeDTO.HireDate,
                EmployeeStatus = employeeDTO.EmployeeStatus,
                DOB = employeeDTO.DOB,
                Notes = employeeDTO.Notes,
                EmployeeType = Enum.Parse<EmployeeTypeEnum>(employeeDTO.EmployeeType)
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employeeDTO);
        }

        // PUT: api/Employees/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(int id, EmployeeDTO employeeDTO)
        {
            if (id != employeeDTO.Id)
            {
                return BadRequest();
            }

            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            employee.CNIC = employeeDTO.CNIC;
            employee.FirstName = employeeDTO.FirstName;
            employee.LastName = employeeDTO.LastName;
            employee.Address = employeeDTO.Address;
            employee.MobileNumber = employeeDTO.MobileNumber;
            employee.HireDate = employeeDTO.HireDate;
            employee.EmployeeStatus = employeeDTO.EmployeeStatus;
            employee.DOB = employeeDTO.DOB;
            employee.Notes = employeeDTO.Notes;
            employee.EmployeeType = Enum.Parse<EmployeeTypeEnum>(employeeDTO.EmployeeType);

            _context.Entry(employee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Employees/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployeeExists(int id)
        {
            return _context.Employees.Any(e => e.Id == id);
        }

        private bool EmployeeExists(string cnic)
        {
            return _context.Employees.Any(e => e.CNIC == cnic);
        }
    }
}
