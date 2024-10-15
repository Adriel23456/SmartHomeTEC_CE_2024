using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartHomeTEC_API.Migrations
{
    /// <inheritdoc />
    public partial class AddChamberUniqueConstraintAndClientChambers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Chamber_ClientEmail",
                table: "Chamber");

            migrationBuilder.CreateIndex(
                name: "IX_Chamber_ClientEmail_Name",
                table: "Chamber",
                columns: new[] { "ClientEmail", "Name" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Chamber_ClientEmail_Name",
                table: "Chamber");

            migrationBuilder.CreateIndex(
                name: "IX_Chamber_ClientEmail",
                table: "Chamber",
                column: "ClientEmail");
        }
    }
}
