using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SmartHomeTEC_API.Migrations
{
    /// <inheritdoc />
    public partial class AddDeliveryAddressEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryAddress_ClientEmail",
                table: "DeliveryAddress",
                column: "ClientEmail");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DeliveryAddress");
        }
    }
}
