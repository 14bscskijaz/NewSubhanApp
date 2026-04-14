'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Printer, Loader2 } from 'lucide-react';
import { getBusReportDetail, type BusReportDetail } from '@/app/actions/bus.action';
import { formatNumber } from 'accounting';
import { format } from 'date-fns';

interface BusReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  busId: number | null;
  busNumber?: string;
  startDate?: string;
  endDate?: string;
}

const expenseRows: { key: keyof BusReportDetail; label: string }[] = [
  { key: 'commission', label: 'Commission' },
  { key: 'diesel', label: 'Diesel' },
  { key: 'cOilTechnician', label: 'C. Oil / Technician' },
  { key: 'toll', label: 'Toll' },
  { key: 'cleaning', label: 'Cleaning' },
  { key: 'alliedmor', label: 'Allied Mor' },
  { key: 'cityParchi', label: 'City Parchi' },
  { key: 'refreshment', label: 'Refreshment' },
  { key: 'repair', label: 'Repair' },
  { key: 'generator', label: 'Generator' },
  { key: 'miscellaneousExpense', label: 'Miscellaneous' },
  { key: 'additionalExpenses', label: 'Additional Expenses' },
];

export default function BusReportDetailModal({
  isOpen,
  onClose,
  busId,
  busNumber,
  startDate,
  endDate,
}: BusReportDetailModalProps) {
  const [detail, setDetail] = useState<BusReportDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !busId) return;
    setDetail(null);
    setLoading(true);
    getBusReportDetail(busId, startDate, endDate)
      .then(setDetail)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen, busId, startDate, endDate]);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Bus Report - ${detail?.busNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
            h1 { font-size: 20px; margin-bottom: 4px; color: #189176; }
            h2 { font-size: 14px; margin-bottom: 4px; color: #444; }
            .meta { font-size: 12px; color: #666; margin-bottom: 16px; }
            .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
            .stat { border: 1px solid #ddd; padding: 10px 16px; border-radius: 4px; }
            .stat-label { font-size: 11px; color: #666; }
            .stat-value { font-size: 16px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th { background: #f2f2f2; text-align: left; padding: 8px; font-size: 12px; border: 1px solid #bfbfbf; }
            td { padding: 8px; font-size: 12px; border: 1px solid #bfbfbf; }
            .total-row { background: #eaeaea; font-weight: bold; }
            .right { text-align: right; }
            .section-title { font-size: 13px; font-weight: bold; margin: 16px 0 6px; }
            .footer { margin-top: 24px; font-size: 11px; color: #888; text-align: center; }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  const dateLabel = startDate && endDate
    ? `${format(new Date(startDate), 'dd MMM yyyy')} – ${format(new Date(endDate), 'dd MMM yyyy')}`
    : startDate
      ? `From ${format(new Date(startDate), 'dd MMM yyyy')}`
      : endDate
        ? `To ${format(new Date(endDate), 'dd MMM yyyy')}`
        : 'All Time';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle>Bus Report — {busNumber ?? `Bus #${busId}`}</DialogTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              disabled={loading || !detail}
              className="gap-1.5"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : detail ? (
          <div ref={printRef}>
            {/* Header for print */}
            <div className="hidden print:block mb-4">
              <h1>New Subhan Accounts</h1>
              <h2>Bus Report — {detail.busNumber}</h2>
              <p className="meta">{dateLabel}</p>
            </div>

            {/* Date range */}
            <p className="text-sm text-muted-foreground mb-4">{dateLabel}</p>

            {/* Summary stats */}
            <div className="summary grid grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Trips', value: detail.tripsCount },
                { label: 'Passengers', value: formatNumber(detail.passengers) },
                { label: 'Revenue', value: `PKR ${formatNumber(detail.revenue)}` },
                { label: 'Total Expenses', value: `PKR ${formatNumber(detail.totalExpenses)}` },
              ].map((s) => (
                <div key={s.label} className="stat border rounded-md p-3">
                  <p className="stat-label text-xs text-muted-foreground">{s.label}</p>
                  <p className="stat-value text-base font-semibold">{s.value}</p>
                </div>
              ))}
            </div>

            <Separator className="mb-4" />

            {/* Expense Breakdown */}
            <p className="section-title text-sm font-semibold mb-2">Expense Breakdown (From Vouchers)</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-3 py-2 border font-medium">Category</th>
                  <th className="text-right px-3 py-2 border font-medium">Amount (PKR)</th>
                </tr>
              </thead>
              <tbody>
                {expenseRows.map(({ key, label }) => {
                  const val = detail[key] as number;
                  if (!val) return null;
                  return (
                    <tr key={key} className="border-b hover:bg-muted/20">
                      <td className="px-3 py-2 border">{label}</td>
                      <td className="px-3 py-2 border text-right">{formatNumber(val)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="total-row bg-muted/50 font-semibold">
                  <td className="px-3 py-2 border">Total</td>
                  <td className="px-3 py-2 border text-right">{formatNumber(detail.totalExpenses)}</td>
                </tr>
              </tfoot>
            </table>

            {/* Additional Expenses */}
            {detail.additionalExpenseItems.length > 0 && (
              <>
                <Separator className="my-4" />
                <p className="section-title text-sm font-semibold mb-2">Additional Expenses</p>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-3 py-2 border font-medium">Date</th>
                      <th className="text-left px-3 py-2 border font-medium">Description</th>
                      <th className="text-right px-3 py-2 border font-medium">Amount (PKR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.additionalExpenseItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/20">
                        <td className="px-3 py-2 border">
                          {item.date ? format(new Date(item.date), 'dd MMM yyyy') : '—'}
                        </td>
                        <td className="px-3 py-2 border">{item.description || '—'}</td>
                        <td className="px-3 py-2 border text-right">
                          {item.amount != null ? formatNumber(item.amount) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="total-row bg-muted/50 font-semibold">
                      <td className="px-3 py-2 border" colSpan={2}>Total Additional</td>
                      <td className="px-3 py-2 border text-right">
                        {formatNumber(detail.additionalExpenses)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </>
            )}

            <div className="footer hidden print:block mt-6 text-center text-xs text-muted-foreground">
              Generated on {format(new Date(), 'dd MMM yyyy, HH:mm')} | New Subhan Accounts ERP System
            </div>
          </div>
        ) : (
          <p className="text-center py-10 text-muted-foreground">No data available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
