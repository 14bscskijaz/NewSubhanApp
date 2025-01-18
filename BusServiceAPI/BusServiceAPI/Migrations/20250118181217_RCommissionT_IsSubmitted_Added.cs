using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusServiceAPI.Migrations
{
    public partial class RCommissionT_IsSubmitted_Added : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RouteCommissionType",
                table: "FixedTripExpenses",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsSubmitted",
                table: "BusClosingVouchers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RouteCommissionType",
                table: "FixedTripExpenses");

            migrationBuilder.DropColumn(
                name: "IsSubmitted",
                table: "BusClosingVouchers");
        }
    }
}
