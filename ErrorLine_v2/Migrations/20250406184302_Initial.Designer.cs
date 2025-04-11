﻿// <auto-generated />
using System;
using ErrorLine_v2;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace ErrorLine_v2.Migrations
{
    [DbContext(typeof(ErrorLineDbContext))]
    [Migration("20250406184302_Initial")]
    partial class Initial
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("ErrorLine_v2.Models.Equipment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Stock")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Equipment");
                });

            modelBuilder.Entity("ErrorLine_v2.Models.IssueReport", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateOnly>("Date")
                        .HasColumnType("date");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("IssueId")
                        .HasColumnType("int");

                    b.Property<int>("LocationId")
                        .HasColumnType("int");

                    b.Property<int>("ReporterId")
                        .HasColumnType("int");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<int>("WorkerId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("IssueId");

                    b.HasIndex("LocationId");

                    b.HasIndex("ReporterId");

                    b.HasIndex("WorkerId");

                    b.ToTable("IssueReports");
                });

            modelBuilder.Entity("ErrorLine_v2.Models.IssueType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("IssueTypes");
                });

            modelBuilder.Entity("ErrorLine_v2.Models.Location", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Locations");
                });

            modelBuilder.Entity("ErrorLine_v2.Models.Order", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateOnly>("ArrivalDate")
                        .HasColumnType("date");

                    b.Property<int>("ManagerId")
                        .HasColumnType("int");

                    b.Property<DateOnly>("OrderDate")
                        .HasColumnType("date");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ManagerId");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("ErrorLine_v2.Models.OrderEquipmentItem", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("EquipmentId")
                        .HasColumnType("int");

                    b.Property<int>("OrderId")
                        .HasColumnType("int");

                    b.Property<int>("Quantity")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("EquipmentId");

                    b.HasIndex("OrderId");

                    b.ToTable("OrderEquipmentItems");
                });

            modelBuilder.Entity("ErrorLine_v2.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Role")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Users");

                    b.UseTptMappingStrategy();
                });

            modelBuilder.Entity("ErrorLine_v2.Models.Admin", b =>
                {
                    b.HasBaseType("ErrorLine_v2.Models.User");

                    b.ToTable("Admins", (string)null);
                });

            modelBuilder.Entity("ErrorLine_v2.Models.MaintananceManager", b =>
                {
                    b.HasBaseType("ErrorLine_v2.Models.User");

                    b.ToTable("MaintananceManagers", (string)null);
                });

            modelBuilder.Entity("ErrorLine_v2.Models.MaintananceWorker", b =>
                {
                    b.HasBaseType("ErrorLine_v2.Models.User");

                    b.ToTable("MaintananceWorkers", (string)null);
                });

            modelBuilder.Entity("ErrorLine_v2.Models.Student", b =>
                {
                    b.HasBaseType("ErrorLine_v2.Models.User");

                    b.Property<int>("RoomId")
                        .HasColumnType("int");

                    b.HasIndex("RoomId");

                    b.ToTable("Students", (string)null);
                });

            modelBuilder.Entity("ErrorLine_v2.Models.IssueReport", b =>
                {
                    b.HasOne("ErrorLine_v2.Models.IssueType", "IssueType")
                        .WithMany("Reports")
                        .HasForeignKey("IssueId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ErrorLine_v2.Models.Location", "Location")
                        .WithMany("Reports")
                        .HasForeignKey("LocationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ErrorLine_v2.Models.Student", "Reporter")
                        .WithMany("Reports")
                        .HasForeignKey("ReporterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ErrorLine_v2.Models.MaintananceWorker", "MaintananceWorker")
                        .WithMany("AssignedReports")
                        .HasForeignKey("WorkerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("IssueType");

                    b.Navigation("Location");

                    b.Navigation("MaintananceWorker");

                    b.Navigation("Reporter");
                });

            modelBuilder.Entity("ErrorLine_v2.Models.Order", b =>
                {
                    b.HasOne("ErrorLine_v2.Models.MaintananceManager", "Manager")
                        .WithMany("Orders")
                        .HasForeignKey("ManagerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Manager");
                });

            modelBuilder.Entity("ErrorLine_v2.Models.OrderEquipmentItem", b =>
                {
                    b.HasOne("ErrorLine_v2.Models.Equipment", "Equipment")
                        .WithMany()
                        .HasForeignKey("EquipmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ErrorLine_v2.Models.Order", "Order")
                        .WithMany("OrderItems")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Equipment");

                    b.Navigation("Order");
                });

            modelBuilder.Entity("ErrorLine_v2.Models.Admin", b =>
                {
                    b.HasOne("ErrorLine_v2.Models.User", null)
                        .WithOne()
                        .HasForeignKey("ErrorLine_v2.Models.Admin", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ErrorLine_v2.Models.MaintananceManager", b =>
                {
                    b.HasOne("ErrorLine_v2.Models.User", null)
                        .WithOne()
                        .HasForeignKey("ErrorLine_v2.Models.MaintananceManager", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ErrorLine_v2.Models.MaintananceWorker", b =>
                {
                    b.HasOne("ErrorLine_v2.Models.User", null)
                        .WithOne()
                        .HasForeignKey("ErrorLine_v2.Models.MaintananceWorker", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ErrorLine_v2.Models.Student", b =>
                {
                    b.HasOne("ErrorLine_v2.Models.User", null)
                        .WithOne()
                        .HasForeignKey("ErrorLine_v2.Models.Student", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ErrorLine_v2.Models.Location", "Room")
                        .WithMany()
                        .HasForeignKey("RoomId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Room");
                });

            modelBuilder.Entity("ErrorLine_v2.Models.IssueType", b =>
                {
                    b.Navigation("Reports");
                });

            modelBuilder.Entity("ErrorLine_v2.Models.Location", b =>
                {
                    b.Navigation("Reports");
                });

            modelBuilder.Entity("ErrorLine_v2.Models.Order", b =>
                {
                    b.Navigation("OrderItems");
                });

            modelBuilder.Entity("ErrorLine_v2.Models.MaintananceManager", b =>
                {
                    b.Navigation("Orders");
                });

            modelBuilder.Entity("ErrorLine_v2.Models.MaintananceWorker", b =>
                {
                    b.Navigation("AssignedReports");
                });

            modelBuilder.Entity("ErrorLine_v2.Models.Student", b =>
                {
                    b.Navigation("Reports");
                });
#pragma warning restore 612, 618
        }
    }
}
