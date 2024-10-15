using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartHomeTEC_API.Migrations
{
    /// <inheritdoc />
    public partial class AddCertificateEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Certificate",
                columns: table => new
                {
                    SerialNumberDevice = table.Column<string>(type: "text", nullable: false),
                    Brand = table.Column<string>(type: "text", nullable: true),
                    DeviceTypeName = table.Column<string>(type: "text", nullable: false),
                    ClientFullName = table.Column<string>(type: "text", nullable: true),
                    WarrantyStartDate = table.Column<string>(type: "text", nullable: false),
                    WarrantyEndDate = table.Column<string>(type: "text", nullable: true),
                    BillNum = table.Column<int>(type: "integer", nullable: false),
                    ClientEmail = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Certificate", x => x.SerialNumberDevice);
                    table.ForeignKey(
                        name: "FK_Certificate_Bill_BillNum",
                        column: x => x.BillNum,
                        principalTable: "Bill",
                        principalColumn: "BillNum",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Certificate_Client_ClientEmail",
                        column: x => x.ClientEmail,
                        principalTable: "Client",
                        principalColumn: "Email",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Certificate_DeviceType_DeviceTypeName",
                        column: x => x.DeviceTypeName,
                        principalTable: "DeviceType",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Certificate_Device_SerialNumberDevice",
                        column: x => x.SerialNumberDevice,
                        principalTable: "Device",
                        principalColumn: "SerialNumber",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Certificate_BillNum",
                table: "Certificate",
                column: "BillNum",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Certificate_ClientEmail",
                table: "Certificate",
                column: "ClientEmail");

            migrationBuilder.CreateIndex(
                name: "IX_Certificate_DeviceTypeName",
                table: "Certificate",
                column: "DeviceTypeName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Certificate");
        }
    }
}
