﻿using Microsoft.AspNetCore.Mvc;
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

        [HttpPost]
        public IActionResult CreateBus([FromBody] BusDTO busDto)
        {
            if (busDto == null) return BadRequest();

            var bus = new Bus
            {
                BusNumber = busDto.BusNumber,
                BusType = (BusTypeEnum)Enum.Parse(typeof(BusTypeEnum), busDto.BusType),
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
            bus.BusType = (BusTypeEnum)Enum.Parse(typeof(BusTypeEnum), busDto.BusType);
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