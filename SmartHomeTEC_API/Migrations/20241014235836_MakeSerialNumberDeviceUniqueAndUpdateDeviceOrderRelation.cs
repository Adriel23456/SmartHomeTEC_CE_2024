using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartHomeTEC_API.Migrations
{
    /// <inheritdoc />
    public partial class MakeSerialNumberDeviceUniqueAndUpdateDeviceOrderRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Order_SerialNumberDevice",
                table: "Order");

            migrationBuilder.CreateIndex(
                name: "IX_Order_SerialNumberDevice",
                table: "Order",
                column: "SerialNumberDevice",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Order_SerialNumberDevice",
                table: "Order");

            migrationBuilder.CreateIndex(
                name: "IX_Order_SerialNumberDevice",
                table: "Order",
                column: "SerialNumberDevice");
        }
    }
}
