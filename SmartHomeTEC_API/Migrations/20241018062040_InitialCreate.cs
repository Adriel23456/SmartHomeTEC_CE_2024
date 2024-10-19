using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SmartHomeTEC_API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Admin",
                columns: table => new
                {
                    Email = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admin", x => x.Email);
                });

            migrationBuilder.CreateTable(
                name: "Client",
                columns: table => new
                {
                    Email = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false),
                    Region = table.Column<string>(type: "text", nullable: false),
                    Continent = table.Column<string>(type: "text", nullable: false),
                    Country = table.Column<string>(type: "text", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    MiddleName = table.Column<string>(type: "text", nullable: true),
                    LastName = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Client", x => x.Email);
                });

            migrationBuilder.CreateTable(
                name: "DeviceType",
                columns: table => new
                {
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    WarrantyDays = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceType", x => x.Name);
                });

            migrationBuilder.CreateTable(
                name: "Distributor",
                columns: table => new
                {
                    LegalNum = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Region = table.Column<string>(type: "text", nullable: false),
                    Continent = table.Column<string>(type: "text", nullable: false),
                    Country = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Distributor", x => x.LegalNum);
                });

            migrationBuilder.CreateTable(
                name: "Chamber",
                columns: table => new
                {
                    ChamberID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ClientEmail = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chamber", x => x.ChamberID);
                    table.ForeignKey(
                        name: "FK_Chamber_Client_ClientEmail",
                        column: x => x.ClientEmail,
                        principalTable: "Client",
                        principalColumn: "Email",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DeliveryAddress",
                columns: table => new
                {
                    AddressID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Province = table.Column<string>(type: "text", nullable: false),
                    District = table.Column<string>(type: "text", nullable: false),
                    Canton = table.Column<string>(type: "text", nullable: false),
                    ApartmentOrHouse = table.Column<string>(type: "text", nullable: false),
                    ClientEmail = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeliveryAddress", x => x.AddressID);
                    table.ForeignKey(
                        name: "FK_DeliveryAddress_Client_ClientEmail",
                        column: x => x.ClientEmail,
                        principalTable: "Client",
                        principalColumn: "Email",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Device",
                columns: table => new
                {
                    SerialNumber = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Price = table.Column<decimal>(type: "numeric", nullable: false),
                    State = table.Column<string>(type: "text", nullable: false),
                    Brand = table.Column<string>(type: "text", nullable: false),
                    AmountAvailable = table.Column<int>(type: "integer", nullable: true),
                    ElectricalConsumption = table.Column<double>(type: "double precision", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    DeviceTypeName = table.Column<string>(type: "text", nullable: false),
                    LegalNum = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Device", x => x.SerialNumber);
                    table.ForeignKey(
                        name: "FK_Device_DeviceType_DeviceTypeName",
                        column: x => x.DeviceTypeName,
                        principalTable: "DeviceType",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Device_Distributor_LegalNum",
                        column: x => x.LegalNum,
                        principalTable: "Distributor",
                        principalColumn: "LegalNum",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "AssignedDevice",
                columns: table => new
                {
                    AssignedID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SerialNumberDevice = table.Column<int>(type: "integer", nullable: false),
                    ClientEmail = table.Column<string>(type: "text", nullable: false),
                    State = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AssignedDevice", x => x.AssignedID);
                    table.ForeignKey(
                        name: "FK_AssignedDevice_Client_ClientEmail",
                        column: x => x.ClientEmail,
                        principalTable: "Client",
                        principalColumn: "Email",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AssignedDevice_Device_SerialNumberDevice",
                        column: x => x.SerialNumberDevice,
                        principalTable: "Device",
                        principalColumn: "SerialNumber",
                        onDelete: ReferentialAction.Restrict);
                });

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
                    SerialNumberDevice = table.Column<int>(type: "integer", nullable: false),
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

            migrationBuilder.CreateTable(
                name: "ChamberAssociation",
                columns: table => new
                {
                    AssociationID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AssociationStartDate = table.Column<string>(type: "text", nullable: false),
                    WarrantyEndDate = table.Column<string>(type: "text", nullable: true),
                    ChamberID = table.Column<int>(type: "integer", nullable: false),
                    AssignedID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChamberAssociation", x => x.AssociationID);
                    table.ForeignKey(
                        name: "FK_ChamberAssociation_AssignedDevice_AssignedID",
                        column: x => x.AssignedID,
                        principalTable: "AssignedDevice",
                        principalColumn: "AssignedID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChamberAssociation_Chamber_ChamberID",
                        column: x => x.ChamberID,
                        principalTable: "Chamber",
                        principalColumn: "ChamberID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UsageLog",
                columns: table => new
                {
                    LogID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StartDate = table.Column<string>(type: "text", nullable: false),
                    StartTime = table.Column<string>(type: "text", nullable: false),
                    EndDate = table.Column<string>(type: "text", nullable: true),
                    EndTime = table.Column<string>(type: "text", nullable: true),
                    TotalHours = table.Column<string>(type: "text", nullable: true),
                    ClientEmail = table.Column<string>(type: "text", nullable: false),
                    AssignedID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsageLog", x => x.LogID);
                    table.ForeignKey(
                        name: "FK_UsageLog_AssignedDevice_AssignedID",
                        column: x => x.AssignedID,
                        principalTable: "AssignedDevice",
                        principalColumn: "AssignedID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UsageLog_Client_ClientEmail",
                        column: x => x.ClientEmail,
                        principalTable: "Client",
                        principalColumn: "Email",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bill",
                columns: table => new
                {
                    BillNum = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BillDate = table.Column<string>(type: "text", nullable: false),
                    BillTime = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false),
                    DeviceTypeName = table.Column<string>(type: "text", nullable: false),
                    OrderID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bill", x => x.BillNum);
                    table.ForeignKey(
                        name: "FK_Bill_DeviceType_DeviceTypeName",
                        column: x => x.DeviceTypeName,
                        principalTable: "DeviceType",
                        principalColumn: "Name",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Bill_Order_OrderID",
                        column: x => x.OrderID,
                        principalTable: "Order",
                        principalColumn: "OrderID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Certificate",
                columns: table => new
                {
                    SerialNumberDevice = table.Column<int>(type: "integer", nullable: false),
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
                name: "IX_AssignedDevice_ClientEmail",
                table: "AssignedDevice",
                column: "ClientEmail");

            migrationBuilder.CreateIndex(
                name: "IX_AssignedDevice_SerialNumberDevice",
                table: "AssignedDevice",
                column: "SerialNumberDevice");

            migrationBuilder.CreateIndex(
                name: "IX_Bill_DeviceTypeName",
                table: "Bill",
                column: "DeviceTypeName");

            migrationBuilder.CreateIndex(
                name: "IX_Bill_OrderID",
                table: "Bill",
                column: "OrderID",
                unique: true);

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

            migrationBuilder.CreateIndex(
                name: "IX_Chamber_ClientEmail_Name",
                table: "Chamber",
                columns: new[] { "ClientEmail", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChamberAssociation_AssignedID",
                table: "ChamberAssociation",
                column: "AssignedID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChamberAssociation_ChamberID",
                table: "ChamberAssociation",
                column: "ChamberID");

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryAddress_ClientEmail",
                table: "DeliveryAddress",
                column: "ClientEmail");

            migrationBuilder.CreateIndex(
                name: "IX_Device_DeviceTypeName",
                table: "Device",
                column: "DeviceTypeName");

            migrationBuilder.CreateIndex(
                name: "IX_Device_LegalNum",
                table: "Device",
                column: "LegalNum");

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
                column: "SerialNumberDevice",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UsageLog_AssignedID",
                table: "UsageLog",
                column: "AssignedID");

            migrationBuilder.CreateIndex(
                name: "IX_UsageLog_ClientEmail",
                table: "UsageLog",
                column: "ClientEmail");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Admin");

            migrationBuilder.DropTable(
                name: "Certificate");

            migrationBuilder.DropTable(
                name: "ChamberAssociation");

            migrationBuilder.DropTable(
                name: "DeliveryAddress");

            migrationBuilder.DropTable(
                name: "UsageLog");

            migrationBuilder.DropTable(
                name: "Bill");

            migrationBuilder.DropTable(
                name: "Chamber");

            migrationBuilder.DropTable(
                name: "AssignedDevice");

            migrationBuilder.DropTable(
                name: "Order");

            migrationBuilder.DropTable(
                name: "Client");

            migrationBuilder.DropTable(
                name: "Device");

            migrationBuilder.DropTable(
                name: "DeviceType");

            migrationBuilder.DropTable(
                name: "Distributor");
        }
    }
}
