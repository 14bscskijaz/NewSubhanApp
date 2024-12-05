namespace BusServiceAPI.Models
{
    public class Expense
    {
        public int Id { get; set; } // Primary key, auto-incremented
        public DateTime Date { get; set; }
        public ExpenseType Type { get; set; } // ENUM for ['bus', 'general'] or VARCHAR(32)
        public int Amount { get; set; }
        public string Description { get; set; } // VARCHAR(255)

        // Navigation properties
        public Bus? Bus { get; set; }
        public int? BusId { get; set; }
        public int? BusClosingVoucherId { get; set; }
        public BusClosingVoucher? BusClosingVoucher { get; set; }


    }

    public enum ExpenseType
    {
        bus,
        general
    }
}
