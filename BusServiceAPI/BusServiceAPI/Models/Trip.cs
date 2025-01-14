﻿using System.ComponentModel.DataAnnotations.Schema;

namespace BusServiceAPI.Models
{
    public class Trip
    {
        public int Id { get; set; } // Primary key, auto-incremented
        public int? RouteClosingVoucherId { get; set; } // Foreign key to RouteClosingVoucher (if applicable)
        public int? PassengerCount { get; set; }
        public int? FullTicketCount { get; set; }
        public int? HalfTicketCount { get; set; }
        public int? FreeTicketCount { get; set; }
        public int? RefreshmentExpense {  get; set; }
        public int? RewardCommission { get; set; }
        public int? LoadEarning {  get; set; }
        public string? Reference { get; set; }


        [Column(TypeName = "decimal(18,2)")]
        public decimal? Revenue { get; set; }
        public string? RevenueDiffExplanation { get; set; } // VARCHAR(255)
        public DateTime? Date { get; set; }
        public int? CheckerExpense { get; set; }


        // Navigation properties
        public Route? Route { get; set; }
        public int? RouteId { get; set; } 
      
    }

}
