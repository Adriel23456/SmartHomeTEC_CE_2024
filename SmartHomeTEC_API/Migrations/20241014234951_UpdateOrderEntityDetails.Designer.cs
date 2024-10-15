﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using SmartHomeTEC_API.Data;

#nullable disable

namespace SmartHomeTEC_API.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241014234951_UpdateOrderEntityDetails")]
    partial class UpdateOrderEntityDetails
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
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

                    b.HasIndex("SerialNumberDevice");

                    b.ToTable("Order");
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
                        .WithMany("Orders")
                        .HasForeignKey("SerialNumberDevice")
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
                    b.Navigation("Orders");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.DeviceType", b =>
                {
                    b.Navigation("Devices");

                    b.Navigation("Orders");
                });

            modelBuilder.Entity("SmartHomeTEC_API.Models.Distributor", b =>
                {
                    b.Navigation("Devices");
                });
#pragma warning restore 612, 618
        }
    }
}
