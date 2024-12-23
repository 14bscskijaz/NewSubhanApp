using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BusServiceAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using BusServiceAPI.Models.DTOs;
using BusServiceAPI.Common;
using System.Reflection.Emit;


namespace BusServiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusClosingVoucherController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BusClosingVoucherController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/BusClosingVoucher
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BusClosingVoucherDTO>>> GetBusClosingVouchers()
        {
            var vouchers = await _context.BusClosingVouchers
                .Include(b => b.Bus)
                .Include(b => b.Driver)
                .Include(b => b.Conductor)
                .Include(b => b.Route)
                .ToListAsync();

            return vouchers.Select(v => new BusClosingVoucherDTO
            {
                Id = v.Id,
                Date = v.Date,
                VoucherNumber = v.VoucherNumber,
                DriverId = v.DriverId,
                ConductorId = v.ConductorId ?? 0,
                BusId = v.BusId,
                RouteId = v.RouteId,
                Commission = v.Commission,
                Diesel = v.Diesel,
                DieselLitres = v.DieselLitres,
                COilTechnician = v.COilTechnician,
                Toll = v.Toll,
                Cleaning = v.Cleaning,
                Alliedmor = v.Alliedmor,
                CityParchi = v.CityParchi,
                Refreshment = v.Refreshment,
                Revenue = v.Revenue,
                Repair = v.Repair,
                MiscellaneousExpense = v.MiscellaneousExpense,
                Explanation = v.Explanation,
                Generator = v.Generator,
            }).ToList();
        }

        // GET: api/BusClosingVoucher/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BusClosingVoucherDTO>> GetBusClosingVoucher(int id)
        {
            var voucher = await _context.BusClosingVouchers
                .Include(b => b.Bus)
                .Include(b => b.Driver)
                .Include(b => b.Conductor)
                .Include(b => b.Route)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (voucher == null)
            {
                return NotFound();
            }

            var voucherDto = new BusClosingVoucherDTO
            {
                Id = voucher.Id,
                Date = voucher.Date,
                VoucherNumber = voucher.VoucherNumber,
                DriverId = voucher.DriverId,
                ConductorId = voucher.ConductorId ?? 0,
                BusId = voucher.BusId,
                RouteId = voucher.RouteId,
                Commission = voucher.Commission,
                Diesel = voucher.Diesel,
                DieselLitres = voucher.DieselLitres,
                COilTechnician = voucher.COilTechnician,
                Toll = voucher.Toll,
                Cleaning = voucher.Cleaning,
                Alliedmor = voucher.Alliedmor,
                CityParchi = voucher.CityParchi,
                Refreshment = voucher.Refreshment,
                Revenue = voucher.Revenue,
                Repair = voucher.Repair,
                MiscellaneousExpense = voucher.MiscellaneousExpense,
                Explanation = voucher.Explanation,
                Generator = voucher.Generator,
            };

            return voucherDto;
        }

        // POST: api/BusClosingVoucher
        [HttpPost]
        public async Task<ActionResult<BusClosingVoucherDTO>> CreateBusClosingVoucher(BusClosingVoucherDTO voucherDto)
        {
            // Verify that related entities exist
            var bus = await _context.Buses.FindAsync(voucherDto.BusId);
            var driver = await _context.Employees.FindAsync(voucherDto.DriverId);
            var route = await _context.Routes.FindAsync(voucherDto.RouteId);

            if (bus == null || driver == null || route == null)
            {
                return BadRequest("Invalid Bus, Driver, or Route ID");
            }

            // If ConductorId is provided, verify it exists
            if (voucherDto.ConductorId != 0)
            {
                var conductor = await _context.Employees.FindAsync(voucherDto.ConductorId);
                if (conductor == null)
                {
                    return BadRequest("Invalid Conductor ID");
                }
            }

            var voucher = new BusClosingVoucher
            {
                Date = voucherDto.Date,
                VoucherNumber = voucherDto.VoucherNumber,
                BusId = voucherDto.BusId,
                DriverId = voucherDto.DriverId,
                ConductorId = voucherDto.ConductorId == 0 ? null : voucherDto.ConductorId,
                RouteId = voucherDto.RouteId,
                Commission = voucherDto.Commission,
                Diesel = voucherDto.Diesel,
                DieselLitres = voucherDto.DieselLitres,
                COilTechnician = voucherDto.COilTechnician,
                Toll = voucherDto.Toll,
                Cleaning = voucherDto.Cleaning,
                Alliedmor = voucherDto.Alliedmor,
                CityParchi = voucherDto.CityParchi,
                Refreshment = voucherDto.Refreshment,
                Revenue = voucherDto.Revenue,
                Repair = voucherDto.Repair,
                MiscellaneousExpense = voucherDto.MiscellaneousExpense,
                Explanation = voucherDto.Explanation,
                Generator = voucherDto.Generator,
            };

            _context.BusClosingVouchers.Add(voucher);

            try
            {
                await _context.SaveChangesAsync();
                // Create response DTO with the saved data
                var createdVoucherDto = new BusClosingVoucherDTO
                {
                    Id = voucher.Id,
                    Date = voucher.Date,
                    VoucherNumber = voucher.VoucherNumber,
                    DriverId = voucher.DriverId,
                    ConductorId = voucher.ConductorId ?? 0,
                    BusId = voucher.BusId,
                    RouteId = voucher.RouteId,
                    Commission = voucher.Commission,
                    Diesel = voucher.Diesel,
                    DieselLitres = voucher.DieselLitres,
                    COilTechnician = voucher.COilTechnician,
                    Toll = voucher.Toll,
                    Cleaning = voucher.Cleaning,
                    Alliedmor = voucher.Alliedmor,
                    CityParchi = voucher.CityParchi,
                    Refreshment = voucher.Refreshment,
                    Revenue = voucher.Revenue,
                    Repair = voucher.Repair,
                    MiscellaneousExpense = voucher.MiscellaneousExpense,
                    Explanation = voucher.Explanation,
                    Generator = voucher.Generator,
                };

                return CreatedAtAction(
                    nameof(GetBusClosingVoucher),
                    new { id = createdVoucherDto.Id },
                    createdVoucherDto
                );
            }
            catch (DbUpdateException)
            {
                return BadRequest("Unable to save the voucher. Please verify all required fields.");
            }

        }

        // PUT: api/BusClosingVoucher/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBusClosingVoucher(int id, BusClosingVoucherDTO voucherDto)
        {
            if (id != voucherDto.Id)
            {
                return BadRequest();
            }

            var voucher = await _context.BusClosingVouchers.FindAsync(id);
            if (voucher == null)
            {
                return NotFound();
            }

            // Verify that related entities exist
            var bus = await _context.Buses.FindAsync(voucherDto.BusId);
            var driver = await _context.Employees.FindAsync(voucherDto.DriverId);
            var route = await _context.Routes.FindAsync(voucherDto.RouteId);

            if (bus == null || driver == null || route == null)
            {
                return BadRequest("Invalid Bus, Driver, or Route ID");
            }

            // Update voucher properties
            voucher.Date = voucherDto.Date;
            voucher.VoucherNumber = voucherDto.VoucherNumber;
            voucher.BusId = voucherDto.BusId;
            voucher.DriverId = voucherDto.DriverId;
            voucher.ConductorId = voucherDto.ConductorId == 0 ? null : voucherDto.ConductorId;
            voucher.RouteId = voucherDto.RouteId;
            voucher.Commission = voucherDto.Commission;
            voucher.Diesel = voucherDto.Diesel;
            voucher.DieselLitres = voucherDto.DieselLitres;
            voucher.COilTechnician = voucherDto.COilTechnician;
            voucher.Toll = voucherDto.Toll;
            voucher.Cleaning = voucherDto.Cleaning;
            voucher.Alliedmor = voucherDto.Alliedmor;
            voucher.CityParchi = voucherDto.CityParchi;
            voucher.Refreshment = voucherDto.Refreshment;
            voucher.Revenue = voucherDto.Revenue;
            voucher.Repair = voucherDto.Repair;
            voucher.MiscellaneousExpense = voucherDto.MiscellaneousExpense;
            voucher.Explanation = voucherDto.Explanation;
            voucher.Generator = voucherDto.Generator;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BusClosingVoucherExists(id))
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

        // DELETE: api/BusClosingVoucher/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBusClosingVoucher(int id)
        {
            var voucher = await _context.BusClosingVouchers.FindAsync(id);
            if (voucher == null)
            {
                return NotFound();
            }

            _context.BusClosingVouchers.Remove(voucher);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BusClosingVoucherExists(int id)
        {
            return _context.BusClosingVouchers.Any(e => e.Id == id);
        }
    }
}

