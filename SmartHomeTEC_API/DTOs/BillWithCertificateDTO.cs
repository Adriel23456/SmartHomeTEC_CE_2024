namespace SmartHomeTEC_API.DTOs
{
    public class BillWithCertificateDTO
    {
        public required BillDTO Bill { get; set; }
        public required CertificateDTO Certificate { get; set; }
    }
}