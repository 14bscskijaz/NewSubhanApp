using System.ComponentModel.DataAnnotations.Schema;

namespace BusServiceAPI.Models
{
    public class BusClosingVoucher
    {
        public int Id { get; set; } // Primary key, auto-incremented
        public bool IsSubmitted { get; set; } = false;
        public DateTime? Date { get; set; }
        public int? VoucherNumber { get; set; }
        public int? Commission { get; set; }
        public int? Diesel { get; set; }
        public double? DieselLitres { get; set; }
        public int? COilTechnician { get; set; }
        public int? Toll { get; set; }
        public int? Cleaning { get; set; }
        public int? Alliedmor { get; set; }
        public int? CityParchi { get; set; }
        public int? Refreshment { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Revenue { get; set; }
        public int? Repair { get; set; }
        public int? Generator { get; set; }
        public int? MiscellaneousExpense { get; set; }
        public string? Explanation { get; set; }

        // Navigation properties
        public Bus? Bus { get; set; }
        public Employee? Driver { get; set; }
        public Employee? Conductor { get; set; }
        public int? BusId { get; set; }
        public int? DriverId { get; set; }
        public int? ConductorId { get; set; }
        public Route? Route { get; set; }
        public int? RouteId { get; set; }
    }

}
