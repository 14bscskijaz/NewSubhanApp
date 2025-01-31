import { format, parseISO } from "date-fns";
import { BusClosingVoucher } from "../slices/bus-closing-voucher";
import { Expense } from "../slices/expenses-slices";

interface Bus {
  id: number;
  busNumber: string;
}

interface GroupedVoucher {
  date: string;
  totalRevenue: number;
  firstVoucherNumber: string | number;
  totalBusExpense: number;
  netBusRevenue: number;
}

export function groupVouchersByDate(
  vouchers: BusClosingVoucher[],
  busId: string | null = "LEK 9556",
  buses: Bus[],
  expensesData: Expense[]
): GroupedVoucher[] {
  if (!busId) return [];

  const bus = buses.find((b) => b.busNumber === busId);
  if (!bus) return []; // Return empty array if bus is not found

  const busID = bus.id;

  // Group vouchers and expenses by date
  const groupedData = new Map<string, GroupedVoucher>();

  vouchers
    .filter((voucher) => voucher.busId === busID)
    .forEach((voucher) => {
      const dateKey = format(parseISO(voucher.date), "yyyy-MM-dd");
      const existingEntry = groupedData.get(dateKey);

      if (existingEntry) {
        existingEntry.totalRevenue += voucher.revenue || 0;
      } else {
        groupedData.set(dateKey, {
          date: dateKey,
          totalRevenue: voucher.revenue || 0,
          firstVoucherNumber: voucher.voucherNumber || "",
          totalBusExpense: 0,
          netBusRevenue: 0,
        });
      }
    });

  expensesData
    .filter((expense) => expense.busId === busID)
    .forEach((expense) => {
      const dateKey = format(parseISO(expense.date), "yyyy-MM-dd");
      const entry = groupedData.get(dateKey);
      if (entry) {
        entry.totalBusExpense += expense.amount || 0;
        entry.netBusRevenue = entry.totalRevenue - entry.totalBusExpense;
      }
    });

  // Convert Map to sorted array
  return Array.from(groupedData.values()).sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
}
