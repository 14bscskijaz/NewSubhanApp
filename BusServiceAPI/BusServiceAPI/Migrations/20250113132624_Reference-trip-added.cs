using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusServiceAPI.Migrations
{
    public partial class Referencetripadded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Reference",
                table: "Trips",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Reference",
                table: "Trips");
        }
    }
}
