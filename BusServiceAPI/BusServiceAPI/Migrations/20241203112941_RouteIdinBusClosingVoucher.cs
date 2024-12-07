using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusServiceAPI.Migrations
{
    public partial class RouteIdinBusClosingVoucher : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "ConductorId",
                table: "BusClosingVouchers",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "RouteId",
                table: "BusClosingVouchers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_BusClosingVouchers_RouteId",
                table: "BusClosingVouchers",
                column: "RouteId");

            migrationBuilder.AddForeignKey(
                name: "FK_BusClosingVouchers_Routes_RouteId",
                table: "BusClosingVouchers",
                column: "RouteId",
                principalTable: "Routes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BusClosingVouchers_Routes_RouteId",
                table: "BusClosingVouchers");

            migrationBuilder.DropIndex(
                name: "IX_BusClosingVouchers_RouteId",
                table: "BusClosingVouchers");

            migrationBuilder.DropColumn(
                name: "RouteId",
                table: "BusClosingVouchers");

            migrationBuilder.AlterColumn<int>(
                name: "ConductorId",
                table: "BusClosingVouchers",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }
    }
}
