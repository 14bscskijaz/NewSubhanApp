using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BusServiceAPI.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Buses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BusNumber = table.Column<string>(type: "character varying(9)", maxLength: 9, nullable: false),
                    BusType = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: false),
                    BusOwner = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    BusStatus = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Buses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CNIC = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: false),
                    MobileNumber = table.Column<string>(type: "text", nullable: false),
                    HireDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EmployeeStatus = table.Column<string>(type: "text", nullable: false),
                    DOB = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false),
                    EmployeeType = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Routes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SourceCity = table.Column<string>(type: "text", nullable: false),
                    SourceAdda = table.Column<string>(type: "text", nullable: false),
                    DestinationCity = table.Column<string>(type: "text", nullable: false),
                    DestinationAdda = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Routes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BusClosingVouchers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    VoucherNumber = table.Column<int>(type: "integer", nullable: false),
                    Commission = table.Column<int>(type: "integer", nullable: false),
                    Diesel = table.Column<int>(type: "integer", nullable: false),
                    DieselLitres = table.Column<double>(type: "double precision", nullable: false),
                    COilTechnician = table.Column<int>(type: "integer", nullable: false),
                    Toll = table.Column<int>(type: "integer", nullable: false),
                    Cleaning = table.Column<int>(type: "integer", nullable: false),
                    Alliedmor = table.Column<int>(type: "integer", nullable: false),
                    CityParchi = table.Column<int>(type: "integer", nullable: false),
                    Refreshment = table.Column<int>(type: "integer", nullable: false),
                    Revenue = table.Column<int>(type: "integer", nullable: false),
                    BusId = table.Column<int>(type: "integer", nullable: false),
                    DriverId = table.Column<int>(type: "integer", nullable: false),
                    ConductorId = table.Column<int>(type: "integer", nullable: true),
                    RouteId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusClosingVouchers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BusClosingVouchers_Buses_BusId",
                        column: x => x.BusId,
                        principalTable: "Buses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BusClosingVouchers_Employees_ConductorId",
                        column: x => x.ConductorId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BusClosingVouchers_Employees_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BusClosingVouchers_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FixedBusClosingExpenses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DriverCommission = table.Column<int>(type: "integer", nullable: false),
                    COilExpense = table.Column<int>(type: "integer", nullable: false),
                    TollTax = table.Column<int>(type: "integer", nullable: false),
                    HalfSafai = table.Column<int>(type: "integer", nullable: false),
                    FullSafai = table.Column<int>(type: "integer", nullable: false),
                    DcPerchi = table.Column<int>(type: "integer", nullable: false),
                    RefreshmentRate = table.Column<int>(type: "integer", nullable: false),
                    AlliedMorde = table.Column<int>(type: "integer", nullable: false),
                    RouteId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FixedBusClosingExpenses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FixedBusClosingExpenses_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FixedTripExpenses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RouteCommission = table.Column<double>(type: "double precision", nullable: false),
                    RewardCommission = table.Column<int>(type: "integer", nullable: false),
                    Steward = table.Column<int>(type: "integer", nullable: false),
                    Counter = table.Column<int>(type: "integer", nullable: false),
                    DcParchi = table.Column<int>(type: "integer", nullable: false),
                    Refreshment = table.Column<int>(type: "integer", nullable: false),
                    RouteId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FixedTripExpenses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FixedTripExpenses_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TicketPricings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BusType = table.Column<int>(type: "integer", nullable: false),
                    TicketPrice = table.Column<int>(type: "integer", nullable: false),
                    RouteId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketPricings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TicketPricings_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Trips",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RouteClosingVoucherId = table.Column<int>(type: "integer", nullable: false),
                    PassengerCount = table.Column<int>(type: "integer", nullable: false),
                    FullTicketCount = table.Column<int>(type: "integer", nullable: false),
                    HalfTicketCount = table.Column<int>(type: "integer", nullable: false),
                    FreeTicketCount = table.Column<int>(type: "integer", nullable: false),
                    Revenue = table.Column<int>(type: "integer", nullable: false),
                    RevenueDiffExplanation = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RouteId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trips", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Trips_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Expenses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Type = table.Column<int>(type: "integer", maxLength: 32, nullable: false),
                    Amount = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    BusId = table.Column<int>(type: "integer", nullable: true),
                    BusClosingVoucherId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Expenses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Expenses_BusClosingVouchers_BusClosingVoucherId",
                        column: x => x.BusClosingVoucherId,
                        principalTable: "BusClosingVouchers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Expenses_Buses_BusId",
                        column: x => x.BusId,
                        principalTable: "Buses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BusClosingVouchers_BusId",
                table: "BusClosingVouchers",
                column: "BusId");

            migrationBuilder.CreateIndex(
                name: "IX_BusClosingVouchers_ConductorId",
                table: "BusClosingVouchers",
                column: "ConductorId");

            migrationBuilder.CreateIndex(
                name: "IX_BusClosingVouchers_DriverId",
                table: "BusClosingVouchers",
                column: "DriverId");

            migrationBuilder.CreateIndex(
                name: "IX_BusClosingVouchers_RouteId",
                table: "BusClosingVouchers",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_BusClosingVoucherId",
                table: "Expenses",
                column: "BusClosingVoucherId");

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_BusId",
                table: "Expenses",
                column: "BusId");

            migrationBuilder.CreateIndex(
                name: "IX_FixedBusClosingExpenses_RouteId",
                table: "FixedBusClosingExpenses",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_FixedTripExpenses_RouteId",
                table: "FixedTripExpenses",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketPricings_RouteId",
                table: "TicketPricings",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_Trips_RouteId",
                table: "Trips",
                column: "RouteId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Expenses");

            migrationBuilder.DropTable(
                name: "FixedBusClosingExpenses");

            migrationBuilder.DropTable(
                name: "FixedTripExpenses");

            migrationBuilder.DropTable(
                name: "TicketPricings");

            migrationBuilder.DropTable(
                name: "Trips");

            migrationBuilder.DropTable(
                name: "BusClosingVouchers");

            migrationBuilder.DropTable(
                name: "Buses");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "Routes");
        }
    }
}
