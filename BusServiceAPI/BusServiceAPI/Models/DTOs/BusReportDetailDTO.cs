using System.ComponentModel.DataAnnotations.Schema;

namespace BusServiceAPI.Models.DTOs
{
    public class BusReportDetailDTO
    {
        public int BusId { get; set; }
        public string? BusNumber { get; set; }
        public string? BusOwner { get; set; }
        public int TripsCount { get; set; }
        public int Passengers { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Revenue { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalExpenses { get; set; }

        // Voucher expense breakdown (aggregated)
        public decimal Commission { get; set; }
        public decimal Diesel { get; set; }
        public decimal COilTechnician { get; set; }
        public decimal Toll { get; set; }
        public decimal Cleaning { get; set; }
        public decimal Alliedmor { get; set; }
        public decimal CityParchi { get; set; }
        public decimal Refreshment { get; set; }
        public decimal Repair { get; set; }
        public decimal Generator { get; set; }
        public decimal MiscellaneousExpense { get; set; }

        // Additional (non-voucher) expenses
        public decimal AdditionalExpenses { get; set; }

        public List<AdditionalExpenseItemDTO> AdditionalExpenseItems { get; set; } = new();
    }

    public class AdditionalExpenseItemDTO
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string? Description { get; set; }
        public int? Amount { get; set; }
    }
}
