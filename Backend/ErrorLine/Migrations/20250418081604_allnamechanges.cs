using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ErrorLine.Migrations
{
    /// <inheritdoc />
    public partial class allnamechanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Orders",
                newName: "OrderStatus");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Locations",
                newName: "LocationType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OrderStatus",
                table: "Orders",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "LocationType",
                table: "Locations",
                newName: "Type");
        }
    }
}
