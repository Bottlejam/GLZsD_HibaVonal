using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ErrorLine.Migrations
{
    /// <inheritdoc />
    public partial class dorm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "IssueId",
                table: "IssueReports",
                newName: "DormitaryId");

            migrationBuilder.AddColumn<int>(
                name: "DormitaryId",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DormitaryId",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DormitaryId",
                table: "Locations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Equipment",
                type: "decimal(10,2)",
                precision: 10,
                scale: 2,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "DormitaryId",
                table: "Equipment",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LocationId",
                table: "Equipment",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Dormitary",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dormitary", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_DormitaryId",
                table: "Users",
                column: "DormitaryId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_DormitaryId",
                table: "Orders",
                column: "DormitaryId");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_DormitaryId",
                table: "Locations",
                column: "DormitaryId");

            migrationBuilder.CreateIndex(
                name: "IX_IssueReports_DormitaryId",
                table: "IssueReports",
                column: "DormitaryId");

            migrationBuilder.CreateIndex(
                name: "IX_Equipment_DormitaryId",
                table: "Equipment",
                column: "DormitaryId");

            migrationBuilder.CreateIndex(
                name: "IX_Equipment_LocationId",
                table: "Equipment",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Dormitary_DormitaryId",
                table: "Equipment",
                column: "DormitaryId",
                principalTable: "Dormitary",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipment_Locations_LocationId",
                table: "Equipment",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_IssueReports_Dormitary_DormitaryId",
                table: "IssueReports",
                column: "DormitaryId",
                principalTable: "Dormitary",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Locations_Dormitary_DormitaryId",
                table: "Locations",
                column: "DormitaryId",
                principalTable: "Dormitary",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Dormitary_DormitaryId",
                table: "Orders",
                column: "DormitaryId",
                principalTable: "Dormitary",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Dormitary_DormitaryId",
                table: "Users",
                column: "DormitaryId",
                principalTable: "Dormitary",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Dormitary_DormitaryId",
                table: "Equipment");

            migrationBuilder.DropForeignKey(
                name: "FK_Equipment_Locations_LocationId",
                table: "Equipment");

            migrationBuilder.DropForeignKey(
                name: "FK_IssueReports_Dormitary_DormitaryId",
                table: "IssueReports");

            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Dormitary_DormitaryId",
                table: "Locations");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Dormitary_DormitaryId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Dormitary_DormitaryId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Dormitary");

            migrationBuilder.DropIndex(
                name: "IX_Users_DormitaryId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Orders_DormitaryId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Locations_DormitaryId",
                table: "Locations");

            migrationBuilder.DropIndex(
                name: "IX_IssueReports_DormitaryId",
                table: "IssueReports");

            migrationBuilder.DropIndex(
                name: "IX_Equipment_DormitaryId",
                table: "Equipment");

            migrationBuilder.DropIndex(
                name: "IX_Equipment_LocationId",
                table: "Equipment");

            migrationBuilder.DropColumn(
                name: "DormitaryId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DormitaryId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "DormitaryId",
                table: "Locations");

            migrationBuilder.DropColumn(
                name: "DormitaryId",
                table: "Equipment");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "Equipment");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Users",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "DormitaryId",
                table: "IssueReports",
                newName: "IssueId");

            migrationBuilder.AlterColumn<int>(
                name: "Price",
                table: "Equipment",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(10,2)",
                oldPrecision: 10,
                oldScale: 2);
        }
    }
}
