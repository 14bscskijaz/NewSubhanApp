using System.ComponentModel.DataAnnotations.Schema;

namespace BusServiceAPI.Models.DTOs
{
    public class BusReportDTO
    {
        // public int? BusId { get; set; } // Serial
        public string? BusNumber { get; set; }
        public string? BusOwner { get; set; }
        public int TripsCount { get; set; }
        public int Passengers { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Expenses { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Revenue { get; set; }
    }
}
