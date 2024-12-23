using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusServiceAPI.Migrations
{
    public partial class FourNewFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CheckerExpense",
                table: "Trips",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Explanation",
                table: "BusClosingVouchers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Generator",
                table: "BusClosingVouchers",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MiscellaneousExpense",
                table: "BusClosingVouchers",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Repair",
                table: "BusClosingVouchers",
                type: "integer",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CheckerExpense",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "Explanation",
                table: "BusClosingVouchers");

            migrationBuilder.DropColumn(
                name: "Generator",
                table: "BusClosingVouchers");

            migrationBuilder.DropColumn(
                name: "MiscellaneousExpense",
                table: "BusClosingVouchers");

            migrationBuilder.DropColumn(
                name: "Repair",
                table: "BusClosingVouchers");
        }
    }
}
