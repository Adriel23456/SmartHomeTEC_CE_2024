using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SmartHomeTEC_API.Migrations
{
    /// <inheritdoc />
    public partial class AddEntityChamberAssociation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateIndex(
                name: "IX_ChamberAssociation_AssignedID",
                table: "ChamberAssociation",
                column: "AssignedID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChamberAssociation_ChamberID",
                table: "ChamberAssociation",
                column: "ChamberID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChamberAssociation");
        }
    }
}
