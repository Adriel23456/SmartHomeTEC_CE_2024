namespace SmartHomeTEC_API.DTOs
{
    public class DistributorDTO
    {
        public required int LegalNum { get; set; }
        public required string Name { get; set; }
        public required string Region { get; set; }
        public required string Continent { get; set; }
        public required string Country { get; set; }
    }
}
