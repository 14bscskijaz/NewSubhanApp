using Microsoft.AspNetCore.Mvc;
using BusServiceAPI.Common;
using BusServiceAPI.Models;
using global::BusServiceAPI.Models.DTOs;

namespace BusServiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllEmployees()
        {
            var employees = _context.Employees
                .Select(e => new EmployeeDTO
                {
                    Id = e.Id,
                    FirstName = e.FirstName,
                    LastName = e.LastName,
                    CNIC = e.CNIC,
                    MobileNumber = e.MobileNumber,
                    EmployeeStatus = e.EmployeeStatus
                }).ToList();

            return Ok(employees);
        }

        [HttpGet("{id}")]
        public IActionResult GetEmployee(int id)
        {
            var employee = _context.Employees
                .Select(e => new EmployeeDTO
                {
                    Id = e.Id,
                    FirstName = e.FirstName,
                    LastName = e.LastName,
                    CNIC = e.CNIC,
                    MobileNumber = e.MobileNumber,
                    EmployeeStatus = e.EmployeeStatus
                })
                .FirstOrDefault(e => e.Id == id);

            if (employee == null) return NotFound();
            return Ok(employee);
        }

        [HttpPost]
        public IActionResult CreateEmployee([FromBody] EmployeeDTO employeeDto)
        {
            if (employeeDto == null) return BadRequest();

            var employee = new Employee
            {
                FirstName = employeeDto.FirstName,
                LastName = employeeDto.LastName,
                CNIC = employeeDto.CNIC,
                MobileNumber = employeeDto.MobileNumber,
                EmployeeStatus = employeeDto.EmployeeStatus
            };

            _context.Employees.Add(employee);
            _context.SaveChanges();

            var createdEmployee = new EmployeeDTO
            {
                Id = employee.Id,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                CNIC = employee.CNIC,
                MobileNumber = employee.MobileNumber,
                EmployeeStatus = employee.EmployeeStatus
            };

            return CreatedAtAction(nameof(GetEmployee), new { id = createdEmployee.Id }, createdEmployee);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateEmployee(int id, [FromBody] EmployeeDTO employeeDto)
        {
            var employee = _context.Employees.Find(id);
            if (employee == null) return NotFound();

            employee.FirstName = employeeDto.FirstName;
            employee.LastName = employeeDto.LastName;
            employee.CNIC = employeeDto.CNIC;
            employee.MobileNumber = employeeDto.MobileNumber;
            employee.EmployeeStatus = employeeDto.EmployeeStatus;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEmployee(int id)
        {
            var employee = _context.Employees.Find(id);
            if (employee == null) return NotFound();

            _context.Employees.Remove(employee);
            _context.SaveChanges();
            return NoContent();
        }
    }
}


