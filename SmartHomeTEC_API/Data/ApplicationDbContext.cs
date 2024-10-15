using Microsoft.EntityFrameworkCore;
using SmartHomeTEC_API.Models;

namespace SmartHomeTEC_API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Definición de DbSet para cada entidad
        public DbSet<Admin> Admin { get; set; }
        public DbSet<DeviceType> DeviceType { get; set; }
        public DbSet<Distributor> Distributor { get; set; }
        public DbSet<Device> Device { get; set; }
        public DbSet<Client> Client { get; set; }
        public DbSet<Order> Order { get; set; }
        public DbSet<Bill> Bill { get; set; }
        public DbSet<Certificate> Certificate { get; set; }
        public DbSet<DeliveryAddress> DeliveryAddress { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar la relación entre DeviceType y Device
            modelBuilder.Entity<Device>()
                .HasOne(d => d.DeviceType)
                .WithMany(dt => dt.Devices)
                .HasForeignKey(d => d.DeviceTypeName)
                .OnDelete(DeleteBehavior.Cascade);

            // Configurar la relación entre Distributor y Device
            modelBuilder.Entity<Device>()
                .HasOne(d => d.Distributor)
                .WithMany(dist => dist.Devices)
                .HasForeignKey(d => d.LegalNum)
                .OnDelete(DeleteBehavior.SetNull);

            // Manejo de enumeración correcta de DeviceState
            modelBuilder.Entity<Device>()
                .Property(d => d.State)
                .HasConversion<string>();
            
            // Configurar la relación uno a uno obligatoria entre Order y Bill
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Bill)
                .WithOne(b => b.Order)
                .HasForeignKey<Bill>(b => b.OrderID)
                .OnDelete(DeleteBehavior.Cascade);
            
            // Configurar la relación uno a uno entre Order y Device
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Device)
                .WithOne(d => d.Order)
                .HasForeignKey<Order>(o => o.SerialNumberDevice)
                .OnDelete(DeleteBehavior.Restrict);

            // Configurar la relación entre Bill y DeviceType
            modelBuilder.Entity<Bill>()
                .HasOne(b => b.DeviceType)
                .WithMany(dt => dt.Bills)
                .HasForeignKey(b => b.DeviceTypeName)
                .OnDelete(DeleteBehavior.Restrict);
            
            // Configurar la relación entre Order y Client
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Client)
                .WithMany(c => c.Orders)
                .HasForeignKey(o => o.ClientEmail)
                .OnDelete(DeleteBehavior.Restrict);
            
            // Manejo de enumeración correcta de OrderState
            modelBuilder.Entity<Order>()
                .Property(o => o.State)
                .HasConversion<string>();
            
            // Configurar la relación entre Order y DeviceType
            modelBuilder.Entity<Order>()
                .HasOne(o => o.DeviceType)
                .WithMany(dt => dt.Orders)
                .HasForeignKey(o => o.DeviceTypeName)
                .OnDelete(DeleteBehavior.Restrict);
            
            // Configurar SerialNumberDevice como único en Order
            modelBuilder.Entity<Order>()
                .HasIndex(o => o.SerialNumberDevice)
                .IsUnique();

            // Configurar la clave primaria como SerialNumberDevice
            modelBuilder.Entity<Certificate>()
                .HasKey(c => c.SerialNumberDevice);
            
            // Configurar la relación uno a uno entre Certificate y Device
            modelBuilder.Entity<Certificate>()
                .HasOne(c => c.Device)
                .WithOne(d => d.Certificate) // Asumiendo que Device tiene SOLO UN Certificate
                .HasForeignKey<Certificate>(o => o.SerialNumberDevice)
                .OnDelete(DeleteBehavior.Cascade);
            
            // Configurar la relación entre Certificate y DeviceType
            modelBuilder.Entity<Certificate>()
                .HasOne(c => c.DeviceType)
                .WithMany(dt => dt.Certificates)
                .HasForeignKey(c => c.DeviceTypeName)
                .OnDelete(DeleteBehavior.Restrict);
            
            // Configurar la relación entre Certificate y Client
            modelBuilder.Entity<Certificate>()
                .HasOne(c => c.Client)
                .WithMany(cl => cl.Certificates)
                .HasForeignKey(c => c.ClientEmail)
                .OnDelete(DeleteBehavior.Restrict);
            
            // Configurar la relación uno a uno entre Certificate y Bill
            modelBuilder.Entity<Certificate>()
                .HasOne(c => c.Bill)
                .WithOne(b => b.Certificate)
                .HasForeignKey<Certificate>(c => c.BillNum)
                .OnDelete(DeleteBehavior.Cascade);
            
            // Configurar la relación entre Client y DeliveryAddress
            modelBuilder.Entity<DeliveryAddress>()
                .HasOne(da => da.Client)
                .WithMany(c => c.DeliveryAddresses)
                .HasForeignKey(da => da.ClientEmail)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}