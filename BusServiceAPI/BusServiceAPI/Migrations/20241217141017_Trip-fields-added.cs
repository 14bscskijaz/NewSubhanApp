using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusServiceAPI.Migrations
{
    public partial class Tripfieldsadded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LoadEarning",
                table: "Trips",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RefreshmentExpense",
                table: "Trips",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RewardCommission",
                table: "Trips",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BusBrand",
                table: "Buses",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoadEarning",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "RefreshmentExpense",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "RewardCommission",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "BusBrand",
                table: "Buses");
        }
    }
}
