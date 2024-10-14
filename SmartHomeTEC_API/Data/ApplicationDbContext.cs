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
        public DbSet<Admin> Admin { get; set; }
        public DbSet<DeviceType> DeviceType { get; set; }
        public DbSet<Distributor> Distributor { get; set; }
        public DbSet<Device> Device { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar la relación entre DeviceType y Device
            modelBuilder.Entity<Device>()
                .HasOne(d => d.DeviceType)
                .WithMany(dt => dt.Devices)
                .HasForeignKey(d => d.DeviceTypeName)
                .OnDelete(DeleteBehavior.Cascade); // Cuando se elimina un DeviceType, se eliminan los Devices relacionados

            // Configurar la relación entre Distributor y Device
            modelBuilder.Entity<Device>()
                .HasOne(d => d.Distributor)
                .WithMany(dist => dist.Devices)
                .HasForeignKey(d => d.LegalNum)
                .OnDelete(DeleteBehavior.SetNull); // Cuando se elimina un Distributor, se establece LegalNum en null en Devices relacionados
            
            //Manejo de enumeración correcta de DeviceState
            modelBuilder.Entity<Device>()
                .Property(d => d.State)
                .HasConversion<string>();
        }
    }
}