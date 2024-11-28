using Microsoft.AspNetCore.Mvc;
using BusServiceAPI.Models;
using BusServiceAPI.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using BusServiceAPI.Common;

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
        public IActionResult GetAllBusClosingVouchers()
        {
            var vouchers = _context.BusClosingVouchers
                .Include(b => b.Driver)
                .Include(b => b.Conductor)
                .Include(b => b.Bus)
                .Select(b => new BusClosingVoucherDTO
                {
                    Id = b.Id,
                    Date = b.Date,
                    VoucherNumber = b.VoucherNumber,
                    Commission = b.Commission,
                    Diesel = b.Diesel,
                    DieselLitres = b.DieselLitres,
                    COilTechnician = b.COilTechnician,
                    Toll = b.Toll,
                    Cleaning = b.Cleaning,
                    Alliedmor = b.Alliedmor,
                    CityParchi = b.CityParchi,
                    Refreshment = b.Refreshment,
                    Revenue = b.Revenue
                }).ToList();

            return Ok(vouchers);
        }

        // GET: api/BusClosingVoucher/5
        [HttpGet("{id}")]
        public IActionResult GetBusClosingVoucher(int id)
        {
            var voucher = _context.BusClosingVouchers
                .Include(b => b.Driver)
                .Include(b => b.Conductor)
                .Include(b => b.Bus)
                .Select(b => new BusClosingVoucherDTO
                {
                    Id = b.Id,
                    Date = b.Date,
                    VoucherNumber = b.VoucherNumber,
                    Commission = b.Commission,
                    Diesel = b.Diesel,
                    DieselLitres = b.DieselLitres,
                    COilTechnician = b.COilTechnician,
                    Toll = b.Toll,
                    Cleaning = b.Cleaning,
                    Alliedmor = b.Alliedmor,
                    CityParchi = b.CityParchi,
                    Refreshment = b.Refreshment,
                    Revenue = b.Revenue
                })
                .FirstOrDefault(b => b.Id == id);

            if (voucher == null) return NotFound();
            return Ok(voucher);
        }

        // POST: api/BusClosingVoucher
        [HttpPost]
        public IActionResult CreateBusClosingVoucher([FromBody] BusClosingVoucherDTO voucherDto)
        {
            if (voucherDto == null) return BadRequest();

            var voucher = new BusClosingVoucher
            {
                Date = voucherDto.Date,
                VoucherNumber = voucherDto.VoucherNumber,
                Commission = voucherDto.Commission,
                Diesel = voucherDto.Diesel,
                DieselLitres = voucherDto.DieselLitres,
                COilTechnician = voucherDto.COilTechnician,
                Toll = voucherDto.Toll,
                Cleaning = voucherDto.Cleaning,
                Alliedmor = voucherDto.Alliedmor,
                CityParchi = voucherDto.CityParchi,
                Refreshment = voucherDto.Refreshment,
                Revenue = voucherDto.Revenue
            };

            _context.BusClosingVouchers.Add(voucher);
            _context.SaveChanges();

            var createdVoucher = new BusClosingVoucherDTO
            {
                Id = voucher.Id,
                Date = voucher.Date,
                VoucherNumber = voucher.VoucherNumber,
                Commission = voucher.Commission,
                Diesel = voucher.Diesel,
                DieselLitres = voucher.DieselLitres,
                COilTechnician = voucher.COilTechnician,
                Toll = voucher.Toll,
                Cleaning = voucher.Cleaning,
                Alliedmor = voucher.Alliedmor,
                CityParchi = voucher.CityParchi,
                Refreshment = voucher.Refreshment,
                Revenue = voucher.Revenue
            };

            return CreatedAtAction(nameof(GetBusClosingVoucher), new { id = createdVoucher.Id }, createdVoucher);
        }

        // PUT: api/BusClosingVoucher/5
        [HttpPut("{id}")]
        public IActionResult UpdateBusClosingVoucher(int id, [FromBody] BusClosingVoucherDTO voucherDto)
        {
            var voucher = _context.BusClosingVouchers.Find(id);
            if (voucher == null) return NotFound();

            voucher.Date = voucherDto.Date;
            voucher.VoucherNumber = voucherDto.VoucherNumber;
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

            _context.SaveChanges();
            return NoContent();
        }

        // DELETE: api/BusClosingVoucher/5
        [HttpDelete("{id}")]
        public IActionResult DeleteBusClosingVoucher(int id)
        {
            var voucher = _context.BusClosingVouchers.Find(id);
            if (voucher == null) return NotFound();

            _context.BusClosingVouchers.Remove(voucher);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
