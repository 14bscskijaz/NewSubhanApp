namespace BusServiceAPI.Models
{
    public class Bus
    {
        public int Id { get; set; } 
        public string BusNumber { get; set; } // VARCHAR(9)
        public BusTypeEnum BusType { get; set; } // VARCHAR(15)
        public string BusOwner { get; set; } // VARCHAR(55)
        public string Description { get; set; } // VARCHAR(255)
        public string BusStatus { get; set; } // VARCHAR(20)
        public string? BusBrand { get; set; }

        // Navigation properties
        public ICollection<Expense> Expenses { get; set; }
        public ICollection<BusClosingVoucher> BusClosingVouchers { get; set; }
    }


    public enum BusTypeEnum
    {
        Standard,
        Business
    }
}
