namespace SmartHomeTEC_API.DTOs
{
    public class DeviceDetailDTO
    {
        public required int SerialNumber { get; set; }
        public required decimal Price { get; set; }
        public required string State { get; set; }
        public required string Brand { get; set; }
        public int? AmountAvailable { get; set; }
        public double? ElectricalConsumption { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string DeviceTypeName { get; set; }
        public int? LegalNum { get; set; }
        public required DeviceTypeDTO DeviceType { get; set; }
        public required DistributorDTO Distributor { get; set; }
    }
}