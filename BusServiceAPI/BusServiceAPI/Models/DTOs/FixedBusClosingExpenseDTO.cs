namespace BusServiceAPI.Models.DTOs
{
    public class FixedBusClosingExpenseDTO
    {
        public int Id { get; set; } // Serial
        public int RouteId { get; set; } // int
        public int DriverCommission { get; set; } // Int
        public int COilExpense { get; set; } // Int
        public int TollTax { get; set; } // Int
        public int HalfSafai { get; set; } // Int
        public int FullSafai { get; set; } // Int
        public int DcPerchi { get; set; } // Int
        public int RefreshmentRate { get; set; } // Int
        public int AlliedMorde { get; set; } // Int
    }

}
