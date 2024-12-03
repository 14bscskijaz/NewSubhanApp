using BusServiceAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BusServiceAPI.Common
{
    using BusServiceAPI.Models;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Reflection.Emit;

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        // DbSet for each model
        public DbSet<Bus> Buses { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Route> Routes { get; set; }
        public DbSet<TicketPricing> TicketPricings { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<FixedTripExpense> FixedTripExpenses { get; set; }
        public DbSet<FixedBusClosingExpense> FixedBusClosingExpenses { get; set; }
        public DbSet<BusClosingVoucher> BusClosingVouchers { get; set; }
        public DbSet<Expense> Expenses { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Bus Configuration
            modelBuilder.Entity<Bus>(entity =>
            {
                entity.Property(e => e.BusType)
                      .HasMaxLength(15)
                      .IsRequired()
                      .HasConversion<string>();

                entity.Property(e => e.BusNumber)
                      .IsRequired()
                      .HasMaxLength(9);

                entity.Property(e => e.BusStatus)
                      .HasMaxLength(20);
            });

            // Employee Configuration
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.Property(e => e.CNIC)
                      .IsRequired()
                      .HasMaxLength(16);
            });
    

            // TicketPricing Configuration
            modelBuilder.Entity<TicketPricing>(entity =>
            {
                entity.Property(e => e.TicketPrice)
                      .IsRequired();

                entity.HasOne(tp => tp.Route)
                      .WithMany(e => e.TicketPricings)
                      .HasForeignKey(e => e.RouteId)
                      .OnDelete(DeleteBehavior.Cascade);      
            });

            // Trip Configuration
            modelBuilder.Entity<Trip>(entity =>
            {
                entity.Property(e => e.RevenueDiffExplanation)
                      .HasMaxLength(255);

                entity.Property(e => e.Date)
                      .IsRequired();

                entity.HasOne(tr => tr.Route)
                      .WithMany(e => e.Trips)
                      .HasForeignKey(e => e.RouteId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // FixedTripExpense Configuration
            modelBuilder.Entity<FixedTripExpense>(entity =>
            {
                entity.HasOne(fte => fte.Route)
                      .WithMany( e =>e.FixedTripExpenses)
                      .HasForeignKey(e => e.RouteId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // FixedBusClosingExpense Configuration
            modelBuilder.Entity<FixedBusClosingExpense>(entity =>
            {
                entity.HasOne(fbce => fbce.Route)
                      .WithMany(fte => fte.FixedBusClosingExpenses)
                      .HasForeignKey(fte => fte.RouteId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // BusClosingVoucher Configuration
            modelBuilder.Entity<BusClosingVoucher>(entity =>
            {
                entity.HasOne(bcv => bcv.Driver)
              .WithMany(e => e.BusClosingVouchersAsDriver)
              .HasForeignKey(bcv => bcv.DriverId)
              .OnDelete(DeleteBehavior.Restrict); // Adjust behavior as needed

                // Define relationship with Conductor
                entity.HasOne(bcv => bcv.Conductor)
                      .WithMany(e => e.BusClosingVouchersAsConductor)
                      .HasForeignKey(bcv => bcv.ConductorId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Configure Bus relationship
                entity.HasOne(b => b.Bus)
                      .WithMany(e => e.BusClosingVouchers)
                      .HasForeignKey(e => e.BusId)  // Explicit foreign key
                      .OnDelete(DeleteBehavior.Restrict);

                // Configure Bus relationship
                entity.HasOne(b => b.Route)
                      .WithMany(e => e.BusClosingVouchers)
                      .HasForeignKey(e => e.RouteId)  // Explicit foreign key
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Expense Configuration
            modelBuilder.Entity<Expense>(entity =>
            {
                entity.Property(e => e.Type)
                      .IsRequired()
                      .HasMaxLength(32);

                entity.Property(e => e.Description)
                      .HasMaxLength(255);

                entity.HasOne(e => e.Bus)
                      .WithMany(e => e.Expenses)
                      .HasForeignKey(e => e.BusId)  // Explicit foreign key
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }

    }
}