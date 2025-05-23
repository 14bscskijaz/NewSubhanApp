using System;

namespace BusServiceAPI.Models.DTOs
{
    public class ExpenseReportDTO : ExpenseDTO
    {
        public string? BusNumber { get; set; }
    }
}
