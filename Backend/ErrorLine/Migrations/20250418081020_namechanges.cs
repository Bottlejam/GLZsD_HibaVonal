using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ErrorLine.Migrations
{
    /// <inheritdoc />
    public partial class namechanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "IssueReports",
                newName: "IssueStatus");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IssueStatus",
                table: "IssueReports",
                newName: "Status");
        }
    }
}
