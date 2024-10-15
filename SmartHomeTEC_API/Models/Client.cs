using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartHomeTEC_API.Models
{
    [Table("Client")]
    public class Client
    {
        [Key]
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }

        [Required]
        public required string Region { get; set; }

        [Required]
        public required string Continent { get; set; }

        [Required]
        public required string Country { get; set; }

        [Required]
        public required string FullName { get; set; }

        [Required]
        public required string FirstName { get; set; }

        public string? MiddleName { get; set; }

        [Required]
        public required string LastName { get; set; }

        // Propiedades de Navegación:
        [JsonIgnore]
        public ICollection<Order> Orders { get; set; } = new List<Order>();

        [JsonIgnore]
        public ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();
        [JsonIgnore]
        public ICollection<DeliveryAddress> DeliveryAddresses { get; set; } = new List<DeliveryAddress>();
    }
}