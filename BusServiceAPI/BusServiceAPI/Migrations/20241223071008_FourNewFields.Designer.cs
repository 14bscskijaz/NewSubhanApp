﻿// <auto-generated />
using System;
using BusServiceAPI.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BusServiceAPI.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20241223071008_FourNewFields")]
    partial class FourNewFields
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("BusServiceAPI.Models.Bus", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("BusBrand")
                        .HasColumnType("text");

                    b.Property<string>("BusNumber")
                        .IsRequired()
                        .HasMaxLength(9)
                        .HasColumnType("character varying(9)");

                    b.Property<string>("BusOwner")
                        .HasColumnType("text");

                    b.Property<string>("BusStatus")
                        .HasMaxLength(20)
                        .HasColumnType("character varying(20)");

                    b.Property<string>("BusType")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("character varying(15)");

                    b.Property<string>("Description")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Buses");
                });

            modelBuilder.Entity("BusServiceAPI.Models.BusClosingVoucher", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("Alliedmor")
                        .HasColumnType("integer");

                    b.Property<int?>("BusId")
                        .HasColumnType("integer");

                    b.Property<int?>("COilTechnician")
                        .HasColumnType("integer");

                    b.Property<int?>("CityParchi")
                        .HasColumnType("integer");

                    b.Property<int?>("Cleaning")
                        .HasColumnType("integer");

                    b.Property<int?>("Commission")
                        .HasColumnType("integer");

                    b.Property<int?>("ConductorId")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("Date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("Diesel")
                        .HasColumnType("integer");

                    b.Property<double?>("DieselLitres")
                        .HasColumnType("double precision");

                    b.Property<int?>("DriverId")
                        .HasColumnType("integer");

                    b.Property<string>("Explanation")
                        .HasColumnType("text");

                    b.Property<int?>("Generator")
                        .HasColumnType("integer");

                    b.Property<int?>("MiscellaneousExpense")
                        .HasColumnType("integer");

                    b.Property<int?>("Refreshment")
                        .HasColumnType("integer");

                    b.Property<int?>("Repair")
                        .HasColumnType("integer");

                    b.Property<int?>("Revenue")
                        .HasColumnType("integer");

                    b.Property<int?>("RouteId")
                        .HasColumnType("integer");

                    b.Property<int?>("Toll")
                        .HasColumnType("integer");

                    b.Property<int?>("VoucherNumber")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("BusId");

                    b.HasIndex("ConductorId");

                    b.HasIndex("DriverId");

                    b.HasIndex("RouteId");

                    b.ToTable("BusClosingVouchers");
                });

            modelBuilder.Entity("BusServiceAPI.Models.Employee", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Address")
                        .HasColumnType("text");

                    b.Property<string>("CNIC")
                        .IsRequired()
                        .HasMaxLength(16)
                        .HasColumnType("character varying(16)");

                    b.Property<DateTime?>("DOB")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("EmployeeStatus")
                        .HasColumnType("text");

                    b.Property<int?>("EmployeeType")
                        .HasColumnType("integer");

                    b.Property<string>("FirstName")
                        .HasColumnType("text");

                    b.Property<DateTime?>("HireDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("LastName")
                        .HasColumnType("text");

                    b.Property<string>("MobileNumber")
                        .HasColumnType("text");

                    b.Property<string>("Notes")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Employees");
                });

            modelBuilder.Entity("BusServiceAPI.Models.Expense", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("Amount")
                        .HasColumnType("integer");

                    b.Property<int?>("BusClosingVoucherId")
                        .HasColumnType("integer");

                    b.Property<int?>("BusId")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("Date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Description")
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<int>("Type")
                        .HasMaxLength(32)
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("BusClosingVoucherId");

                    b.HasIndex("BusId");

                    b.ToTable("Expenses");
                });

            modelBuilder.Entity("BusServiceAPI.Models.FixedBusClosingExpense", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("AlliedMorde")
                        .HasColumnType("integer");

                    b.Property<int?>("COilExpense")
                        .HasColumnType("integer");

                    b.Property<int?>("DcPerchi")
                        .HasColumnType("integer");

                    b.Property<int?>("DriverCommission")
                        .HasColumnType("integer");

                    b.Property<int?>("FullSafai")
                        .HasColumnType("integer");

                    b.Property<int?>("HalfSafai")
                        .HasColumnType("integer");

                    b.Property<int?>("RefreshmentRate")
                        .HasColumnType("integer");

                    b.Property<int?>("RouteId")
                        .HasColumnType("integer");

                    b.Property<int?>("TollTax")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("RouteId");

                    b.ToTable("FixedBusClosingExpenses");
                });

            modelBuilder.Entity("BusServiceAPI.Models.FixedTripExpense", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("Counter")
                        .HasColumnType("integer");

                    b.Property<int?>("DcParchi")
                        .HasColumnType("integer");

                    b.Property<int?>("Refreshment")
                        .HasColumnType("integer");

                    b.Property<int?>("RewardCommission")
                        .HasColumnType("integer");

                    b.Property<double?>("RouteCommission")
                        .HasColumnType("double precision");

                    b.Property<int?>("RouteId")
                        .HasColumnType("integer");

                    b.Property<int?>("Steward")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("RouteId");

                    b.ToTable("FixedTripExpenses");
                });

            modelBuilder.Entity("BusServiceAPI.Models.Route", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("DestinationAdda")
                        .HasColumnType("text");

                    b.Property<string>("DestinationCity")
                        .HasColumnType("text");

                    b.Property<string>("SourceAdda")
                        .HasColumnType("text");

                    b.Property<string>("SourceCity")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Routes");
                });

            modelBuilder.Entity("BusServiceAPI.Models.TicketPricing", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("BusType")
                        .HasColumnType("integer");

                    b.Property<int>("RouteId")
                        .HasColumnType("integer");

                    b.Property<int>("TicketPrice")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("RouteId");

                    b.ToTable("TicketPricings");
                });

            modelBuilder.Entity("BusServiceAPI.Models.Trip", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("CheckerExpense")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("Date")
                        .IsRequired()
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("FreeTicketCount")
                        .HasColumnType("integer");

                    b.Property<int?>("FullTicketCount")
                        .HasColumnType("integer");

                    b.Property<int?>("HalfTicketCount")
                        .HasColumnType("integer");

                    b.Property<int?>("LoadEarning")
                        .HasColumnType("integer");

                    b.Property<int?>("PassengerCount")
                        .HasColumnType("integer");

                    b.Property<int?>("RefreshmentExpense")
                        .HasColumnType("integer");

                    b.Property<int?>("Revenue")
                        .HasColumnType("integer");

                    b.Property<string>("RevenueDiffExplanation")
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<int?>("RewardCommission")
                        .HasColumnType("integer");

                    b.Property<int?>("RouteClosingVoucherId")
                        .HasColumnType("integer");

                    b.Property<int?>("RouteId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("RouteId");

                    b.ToTable("Trips");
                });

            modelBuilder.Entity("BusServiceAPI.Models.BusClosingVoucher", b =>
                {
                    b.HasOne("BusServiceAPI.Models.Bus", "Bus")
                        .WithMany("BusClosingVouchers")
                        .HasForeignKey("BusId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("BusServiceAPI.Models.Employee", "Conductor")
                        .WithMany("BusClosingVouchersAsConductor")
                        .HasForeignKey("ConductorId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("BusServiceAPI.Models.Employee", "Driver")
                        .WithMany("BusClosingVouchersAsDriver")
                        .HasForeignKey("DriverId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("BusServiceAPI.Models.Route", "Route")
                        .WithMany("BusClosingVouchers")
                        .HasForeignKey("RouteId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Bus");

                    b.Navigation("Conductor");

                    b.Navigation("Driver");

                    b.Navigation("Route");
                });

            modelBuilder.Entity("BusServiceAPI.Models.Expense", b =>
                {
                    b.HasOne("BusServiceAPI.Models.BusClosingVoucher", "BusClosingVoucher")
                        .WithMany()
                        .HasForeignKey("BusClosingVoucherId");

                    b.HasOne("BusServiceAPI.Models.Bus", "Bus")
                        .WithMany("Expenses")
                        .HasForeignKey("BusId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Bus");

                    b.Navigation("BusClosingVoucher");
                });

            modelBuilder.Entity("BusServiceAPI.Models.FixedBusClosingExpense", b =>
                {
                    b.HasOne("BusServiceAPI.Models.Route", "Route")
                        .WithMany("FixedBusClosingExpenses")
                        .HasForeignKey("RouteId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Route");
                });

            modelBuilder.Entity("BusServiceAPI.Models.FixedTripExpense", b =>
                {
                    b.HasOne("BusServiceAPI.Models.Route", "Route")
                        .WithMany("FixedTripExpenses")
                        .HasForeignKey("RouteId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Route");
                });

            modelBuilder.Entity("BusServiceAPI.Models.TicketPricing", b =>
                {
                    b.HasOne("BusServiceAPI.Models.Route", "Route")
                        .WithMany("TicketPricings")
                        .HasForeignKey("RouteId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Route");
                });

            modelBuilder.Entity("BusServiceAPI.Models.Trip", b =>
                {
                    b.HasOne("BusServiceAPI.Models.Route", "Route")
                        .WithMany("Trips")
                        .HasForeignKey("RouteId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Route");
                });

            modelBuilder.Entity("BusServiceAPI.Models.Bus", b =>
                {
                    b.Navigation("BusClosingVouchers");

                    b.Navigation("Expenses");
                });

            modelBuilder.Entity("BusServiceAPI.Models.Employee", b =>
                {
                    b.Navigation("BusClosingVouchersAsConductor");

                    b.Navigation("BusClosingVouchersAsDriver");
                });

            modelBuilder.Entity("BusServiceAPI.Models.Route", b =>
                {
                    b.Navigation("BusClosingVouchers");

                    b.Navigation("FixedBusClosingExpenses");

                    b.Navigation("FixedTripExpenses");

                    b.Navigation("TicketPricings");

                    b.Navigation("Trips");
                });
#pragma warning restore 612, 618
        }
    }
}
