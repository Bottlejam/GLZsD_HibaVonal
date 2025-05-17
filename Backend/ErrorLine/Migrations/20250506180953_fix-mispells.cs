using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ErrorLine.Migrations
{
    /// <inheritdoc />
    public partial class fixmispells : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                name: "FK_Note_IssueReports_IssueReportId",
                table: "Note");

            migrationBuilder.DropForeignKey(
                name: "FK_Note_Users_CreatedById",
                table: "Note");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Equipment_EquipmentId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Dormitary_DormitaryId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Dormitary_DormitaryId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Dormitary");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Note",
                table: "Note");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Equipment",
                table: "Equipment");

            migrationBuilder.RenameTable(
                name: "Note",
                newName: "Notes");

            migrationBuilder.RenameTable(
                name: "Equipment",
                newName: "Equipments");

            migrationBuilder.RenameColumn(
                name: "DormitaryId",
                table: "Users",
                newName: "DormitoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Users_DormitaryId",
                table: "Users",
                newName: "IX_Users_DormitoryId");

            migrationBuilder.RenameColumn(
                name: "DormitaryId",
                table: "Orders",
                newName: "DormitoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_DormitaryId",
                table: "Orders",
                newName: "IX_Orders_DormitoryId");

            migrationBuilder.RenameColumn(
                name: "DormitaryId",
                table: "Locations",
                newName: "DormitoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Locations_DormitaryId",
                table: "Locations",
                newName: "IX_Locations_DormitoryId");

            migrationBuilder.RenameColumn(
                name: "DormitaryId",
                table: "IssueReports",
                newName: "DormitoryId");

            migrationBuilder.RenameIndex(
                name: "IX_IssueReports_DormitaryId",
                table: "IssueReports",
                newName: "IX_IssueReports_DormitoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Note_IssueReportId",
                table: "Notes",
                newName: "IX_Notes_IssueReportId");

            migrationBuilder.RenameIndex(
                name: "IX_Note_CreatedById",
                table: "Notes",
                newName: "IX_Notes_CreatedById");

            migrationBuilder.RenameColumn(
                name: "DormitaryId",
                table: "Equipments",
                newName: "DormitoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Equipment_LocationId",
                table: "Equipments",
                newName: "IX_Equipments_LocationId");

            migrationBuilder.RenameIndex(
                name: "IX_Equipment_DormitaryId",
                table: "Equipments",
                newName: "IX_Equipments_DormitoryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Notes",
                table: "Notes",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Equipments",
                table: "Equipments",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Dormitories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dormitories", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Equipments_Dormitories_DormitoryId",
                table: "Equipments",
                column: "DormitoryId",
                principalTable: "Dormitories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipments_Locations_LocationId",
                table: "Equipments",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_IssueReports_Dormitories_DormitoryId",
                table: "IssueReports",
                column: "DormitoryId",
                principalTable: "Dormitories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Locations_Dormitories_DormitoryId",
                table: "Locations",
                column: "DormitoryId",
                principalTable: "Dormitories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_IssueReports_IssueReportId",
                table: "Notes",
                column: "IssueReportId",
                principalTable: "IssueReports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_Users_CreatedById",
                table: "Notes",
                column: "CreatedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Equipments_EquipmentId",
                table: "OrderItems",
                column: "EquipmentId",
                principalTable: "Equipments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Dormitories_DormitoryId",
                table: "Orders",
                column: "DormitoryId",
                principalTable: "Dormitories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Dormitories_DormitoryId",
                table: "Users",
                column: "DormitoryId",
                principalTable: "Dormitories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipments_Dormitories_DormitoryId",
                table: "Equipments");

            migrationBuilder.DropForeignKey(
                name: "FK_Equipments_Locations_LocationId",
                table: "Equipments");

            migrationBuilder.DropForeignKey(
                name: "FK_IssueReports_Dormitories_DormitoryId",
                table: "IssueReports");

            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Dormitories_DormitoryId",
                table: "Locations");

            migrationBuilder.DropForeignKey(
                name: "FK_Notes_IssueReports_IssueReportId",
                table: "Notes");

            migrationBuilder.DropForeignKey(
                name: "FK_Notes_Users_CreatedById",
                table: "Notes");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Equipments_EquipmentId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Dormitories_DormitoryId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Dormitories_DormitoryId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Dormitories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Notes",
                table: "Notes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Equipments",
                table: "Equipments");

            migrationBuilder.RenameTable(
                name: "Notes",
                newName: "Note");

            migrationBuilder.RenameTable(
                name: "Equipments",
                newName: "Equipment");

            migrationBuilder.RenameColumn(
                name: "DormitoryId",
                table: "Users",
                newName: "DormitaryId");

            migrationBuilder.RenameIndex(
                name: "IX_Users_DormitoryId",
                table: "Users",
                newName: "IX_Users_DormitaryId");

            migrationBuilder.RenameColumn(
                name: "DormitoryId",
                table: "Orders",
                newName: "DormitaryId");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_DormitoryId",
                table: "Orders",
                newName: "IX_Orders_DormitaryId");

            migrationBuilder.RenameColumn(
                name: "DormitoryId",
                table: "Locations",
                newName: "DormitaryId");

            migrationBuilder.RenameIndex(
                name: "IX_Locations_DormitoryId",
                table: "Locations",
                newName: "IX_Locations_DormitaryId");

            migrationBuilder.RenameColumn(
                name: "DormitoryId",
                table: "IssueReports",
                newName: "DormitaryId");

            migrationBuilder.RenameIndex(
                name: "IX_IssueReports_DormitoryId",
                table: "IssueReports",
                newName: "IX_IssueReports_DormitaryId");

            migrationBuilder.RenameIndex(
                name: "IX_Notes_IssueReportId",
                table: "Note",
                newName: "IX_Note_IssueReportId");

            migrationBuilder.RenameIndex(
                name: "IX_Notes_CreatedById",
                table: "Note",
                newName: "IX_Note_CreatedById");

            migrationBuilder.RenameColumn(
                name: "DormitoryId",
                table: "Equipment",
                newName: "DormitaryId");

            migrationBuilder.RenameIndex(
                name: "IX_Equipments_LocationId",
                table: "Equipment",
                newName: "IX_Equipment_LocationId");

            migrationBuilder.RenameIndex(
                name: "IX_Equipments_DormitoryId",
                table: "Equipment",
                newName: "IX_Equipment_DormitaryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Note",
                table: "Note",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Equipment",
                table: "Equipment",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Dormitary",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dormitary", x => x.Id);
                });

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
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Note_IssueReports_IssueReportId",
                table: "Note",
                column: "IssueReportId",
                principalTable: "IssueReports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Note_Users_CreatedById",
                table: "Note",
                column: "CreatedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Equipment_EquipmentId",
                table: "OrderItems",
                column: "EquipmentId",
                principalTable: "Equipment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Dormitary_DormitaryId",
                table: "Orders",
                column: "DormitaryId",
                principalTable: "Dormitary",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Dormitary_DormitaryId",
                table: "Users",
                column: "DormitaryId",
                principalTable: "Dormitary",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
