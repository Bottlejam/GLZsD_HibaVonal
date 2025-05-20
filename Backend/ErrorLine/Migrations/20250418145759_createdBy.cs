using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ErrorLine.Migrations
{
    /// <inheritdoc />
    public partial class createdBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedById",
                table: "Note",
                type: "int",
                nullable: true
                );

            migrationBuilder.CreateIndex(
                name: "IX_Note_CreatedById",
                table: "Note",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Note_Users_CreatedById",
                table: "Note",
                column: "CreatedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Note_Users_CreatedById",
                table: "Note");

            migrationBuilder.DropIndex(
                name: "IX_Note_CreatedById",
                table: "Note");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "Note");
        }
    }
}
