using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SmartHomeTEC_API.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderEntityAndRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Order",
                columns: table => new
                {
                    OrderID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    State = table.Column<string>(type: "text", nullable: false),
                    OrderTime = table.Column<string>(type: "text", nullable: false),
                    OrderDate = table.Column<string>(type: "text", nullable: false),
                    OrderClientNum = table.Column<int>(type: "integer", nullable: true),
                    Brand = table.Column<string>(type: "text", nullable: true),
                    SerialNumberDevice = table.Column<string>(type: "text", nullable: false),
                    DeviceTypeName = table.Column<string>(type: "text", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "numeric", nullable: true),
                    ClientEmail = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Order", x => x.OrderID);
                    table.ForeignKey(
                        name: "FK_Order_Client_ClientEmail",
                        column: x => x.ClientEmail,
                        principalTable: "Client",
                        principalColumn: "Email",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Order_DeviceType_DeviceTypeName",
                        column: x => x.DeviceTypeName,
                        principalTable: "DeviceType",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Order_Device_SerialNumberDevice",
                        column: x => x.SerialNumberDevice,
                        principalTable: "Device",
                        principalColumn: "SerialNumber",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Order_ClientEmail",
                table: "Order",
                column: "ClientEmail");

            migrationBuilder.CreateIndex(
                name: "IX_Order_DeviceTypeName",
                table: "Order",
                column: "DeviceTypeName");

            migrationBuilder.CreateIndex(
                name: "IX_Order_SerialNumberDevice",
                table: "Order",
                column: "SerialNumberDevice");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Order");
        }
    }
}
