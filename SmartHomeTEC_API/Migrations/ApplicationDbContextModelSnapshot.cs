﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using SmartHomeTEC_API.Data;

#nullable disable

namespace SmartHomeTEC_API.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("SmartHomeTEC_API.Models.Admin", b =>
                {
                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Email");

                    b.ToTable("Admin");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.Bill", b =>
                {
                    b.Property<int>("BillNum")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("BillNum"));

                    b.Property<string>("BillDate")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("BillTime")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("DeviceTypeName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("OrderID")
                        .HasColumnType("integer");

                    b.Property<decimal>("Price")
                        .HasColumnType("numeric");

                    b.HasKey("BillNum");

                    b.HasIndex("DeviceTypeName");

                    b.HasIndex("OrderID")
                        .IsUnique();

                    b.ToTable("Bill");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.Client", b =>
                {
                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<string>("Continent")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("MiddleName")
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Region")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Email");

                    b.ToTable("Client");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.Device", b =>
                {
                    b.Property<string>("SerialNumber")
                        .HasColumnType("text");

                    b.Property<int?>("AmountAvailable")
                        .HasColumnType("integer");

                    b.Property<string>("Brand")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("DeviceTypeName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<double?>("ElectricalConsumption")
                        .HasColumnType("double precision");

                    b.Property<string>("LegalNum")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal>("Price")
                        .HasColumnType("numeric");

                    b.Property<string>("State")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("SerialNumber");

                    b.HasIndex("DeviceTypeName");

                    b.HasIndex("LegalNum");

                    b.ToTable("Device");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.DeviceType", b =>
                {
                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("WarrantyDays")
                        .HasColumnType("integer");

                    b.HasKey("Name");

                    b.ToTable("DeviceType");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.Distributor", b =>
                {
                    b.Property<string>("LegalNum")
                        .HasColumnType("text");

                    b.Property<string>("Continent")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Region")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("LegalNum");

                    b.ToTable("Distributor");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.Order", b =>
                {
                    b.Property<int>("OrderID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("OrderID"));

                    b.Property<string>("Brand")
                        .HasColumnType("text");

                    b.Property<string>("ClientEmail")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("DeviceTypeName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int?>("OrderClientNum")
                        .HasColumnType("integer");

                    b.Property<string>("OrderDate")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("OrderTime")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SerialNumberDevice")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("State")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal?>("TotalPrice")
                        .HasColumnType("numeric");

                    b.HasKey("OrderID");

                    b.HasIndex("ClientEmail");

                    b.HasIndex("DeviceTypeName");

                    b.HasIndex("SerialNumberDevice")
                        .IsUnique();

                    b.ToTable("Order");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.Bill", b =>
                {
                    b.HasOne("SmartHomeTEC_API.Models.DeviceType", "DeviceType")
                        .WithMany("Bills")
                        .HasForeignKey("DeviceTypeName")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SmartHomeTEC_API.Models.Order", "Order")
                        .WithOne("Bill")
                        .HasForeignKey("SmartHomeTEC_API.Models.Bill", "OrderID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("DeviceType");

                    b.Navigation("Order");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.Device", b =>
                {
                    b.HasOne("SmartHomeTEC_API.Models.DeviceType", "DeviceType")
                        .WithMany("Devices")
                        .HasForeignKey("DeviceTypeName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SmartHomeTEC_API.Models.Distributor", "Distributor")
                        .WithMany("Devices")
                        .HasForeignKey("LegalNum")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("DeviceType");

                    b.Navigation("Distributor");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.Order", b =>
                {
                    b.HasOne("SmartHomeTEC_API.Models.Client", "Client")
                        .WithMany("Orders")
                        .HasForeignKey("ClientEmail")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SmartHomeTEC_API.Models.DeviceType", "DeviceType")
                        .WithMany("Orders")
                        .HasForeignKey("DeviceTypeName")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("SmartHomeTEC_API.Models.Device", "Device")
                        .WithOne("Order")
                        .HasForeignKey("SmartHomeTEC_API.Models.Order", "SerialNumberDevice")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Client");

                    b.Navigation("Device");

                    b.Navigation("DeviceType");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.Client", b =>
                {
                    b.Navigation("Orders");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.Device", b =>
                {
                    b.Navigation("Order");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.DeviceType", b =>
                {
                    b.Navigation("Bills");

                    b.Navigation("Devices");

                    b.Navigation("Orders");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.Distributor", b =>
                {
                    b.Navigation("Devices");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.Order", b =>
                {
                    b.Navigation("Bill")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
