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
    }
}