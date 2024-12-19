namespace BusServiceAPI.Models.DTOs
{
    public class ExpenseDTO
    {
        public int Id { get; set; } // Serial
        public DateTime? Date { get; set; } // Date
        public int? BusId { get; set; } // Serial
        public String? Type { get; set; } // Varchar(32) [bus, general]
        public int? Amount { get; set; } // Int
        public string? Description { get; set; } // varchar(255)
        public int? BusClosingVoucherId { get; set; }
    }

}
