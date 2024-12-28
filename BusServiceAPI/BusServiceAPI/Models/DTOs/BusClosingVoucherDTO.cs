using System.ComponentModel.DataAnnotations.Schema;

namespace BusServiceAPI.Models.DTOs
{
    public class BusClosingVoucherDTO
    {
        public int Id { get; set; } // Serial
        public DateTime? Date { get; set; } // Date
        public int? DriverId { get; set; } // FK to Employee
        public int? ConductorId { get; set; } // FK to Employee
        public int? BusId { get; set; } // FK to Bus
        public int? RouteId { get; set; } //
        public int? VoucherNumber { get; set; } // Int
        public int? Commission { get; set; } // Int
        public int? Diesel { get; set; } // Int
        public double? DieselLitres { get; set; } // Double
        public int? COilTechnician { get; set; } // Int
        public int? Toll { get; set; } // Int
        public int? Cleaning { get; set; } // Int
        public int? Alliedmor { get; set; } // Int
        public int? CityParchi { get; set; } // Int
        public int? Refreshment { get; set; } // Int

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Revenue { get; set; }
        public int? Repair { get; set; }
        public int? Generator { get; set; }
        public int? MiscellaneousExpense { get; set; }
        public string? Explanation { get; set; }
    }

}
