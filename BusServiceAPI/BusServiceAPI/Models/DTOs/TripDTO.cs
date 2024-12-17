namespace BusServiceAPI.Models.DTOs
{
    public class TripDTO
    {
        public int Id { get; set; } // Serial
        public int RouteClosingVoucherId { get; set; } // FK
        public int RouteId { get; set; } // FK
        public int PassengerCount { get; set; } // Int
        public int FullTicketCount { get; set; } // Int
        public int HalfTicketCount { get; set; } // Int
        public int FreeTicketCount { get; set; } // Int
        public int? RefreshmentExpense { get; set; }
        public int? RewardCommission { get; set; }
        public int? LoadEarning { get; set; }
        public int Revenue { get; set; } // Int
        public string RevenueDiffExplanation { get; set; } // varchar(255)
        public DateTime Date { get; set; } // DateTime
    }

}
