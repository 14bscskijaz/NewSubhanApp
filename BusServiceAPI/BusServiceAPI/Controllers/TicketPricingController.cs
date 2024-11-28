﻿using Microsoft.AspNetCore.Mvc;
using BusServiceAPI.Common;
using BusServiceAPI.Models;
using System.Linq;
using BusServiceAPI.Models.DTOs;

namespace BusServiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketPricingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TicketPricingController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllTicketPricings()
        {
            var ticketPricings = _context.TicketPricings
                .Select(tp => new TicketPricingDTO
                {
                    Id = tp.Id,
                    RouteId = tp.Route.Id,
                    TicketPrice = tp.TicketPrice
                }).ToList();

            return Ok(ticketPricings);
        }

        [HttpGet("{id}")]
        public IActionResult GetTicketPricing(int id)
        {
            var ticketPricing = _context.TicketPricings
                .Select(tp => new TicketPricingDTO
                {
                    Id = tp.Id,
                    RouteId = tp.Route.Id,
                    TicketPrice = tp.TicketPrice
                })
                .FirstOrDefault(tp => tp.Id == id);

            if (ticketPricing == null) return NotFound();
            return Ok(ticketPricing);
        }

        [HttpPost]
        public IActionResult CreateTicketPricing([FromBody] TicketPricingDTO ticketPricingDto)
        {
            if (ticketPricingDto == null) return BadRequest();

            var ticketPricing = new TicketPricing
            {
                Id = ticketPricingDto.RouteId,
                TicketPrice = ticketPricingDto.TicketPrice
            };

            _context.TicketPricings.Add(ticketPricing);
            _context.SaveChanges();

            var createdTicketPricing = new TicketPricingDTO
            {
                Id = ticketPricing.Id,
                RouteId = ticketPricing.Route.Id,
                TicketPrice = ticketPricing.TicketPrice
            };

            return CreatedAtAction(nameof(GetTicketPricing), new { id = createdTicketPricing.Id }, createdTicketPricing);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTicketPricing(int id, [FromBody] TicketPricingDTO ticketPricingDto)
        {
            var ticketPricing = _context.TicketPricings.Find(id);
            if (ticketPricing == null) return NotFound();

            ticketPricing.Route.Id = ticketPricingDto.RouteId;
            ticketPricing.TicketPrice = ticketPricingDto.TicketPrice;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTicketPricing(int id)
        {
            var ticketPricing = _context.TicketPricings.Find(id);
            if (ticketPricing == null) return NotFound();

            _context.TicketPricings.Remove(ticketPricing);
            _context.SaveChanges();
            return NoContent();
        }
    }
}