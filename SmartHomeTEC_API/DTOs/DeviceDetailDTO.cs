namespace SmartHomeTEC_API.DTOs
{
    public class DeviceDetailDTO
    {
        public required string SerialNumber { get; set; }
        public required decimal Price { get; set; }
        public required string State { get; set; } // Representado como cadena
        public required string Brand { get; set; }
        public int? AmountAvailable { get; set; }
        public double? ElectricalConsumption { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string DeviceTypeName { get; set; }
        public required string LegalNum { get; set; }

        // Información de DeviceType
        public required DeviceTypeDTO DeviceType { get; set; }

        // Información de Distributor
        public required DistributorDTO Distributor { get; set; }
    }
}