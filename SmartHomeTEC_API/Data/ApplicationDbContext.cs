using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Map the Admin entity to the "Admin" table
            modelBuilder.HasDefaultSchema("public");
            modelBuilder.Entity<Admin>().ToTable("Admin");
        }
    }
}