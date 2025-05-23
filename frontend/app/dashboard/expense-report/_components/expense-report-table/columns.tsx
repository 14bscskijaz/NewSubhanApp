"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils/accounting";
import { type ExpenseReport } from "@/app/actions/expenses.action";

export const columns: ColumnDef<Partial<ExpenseReport>>[] = [
	{
		id: "serial_no",
		header: "S.No",
		cell: ({ row }) => <div>{row.index + 1}</div>,
	},
	{
		accessorKey: "date",
		header: "Date",
		cell: ({ row }) => {
			const date = row.original.date;
			return <div>{date ? format(new Date(date), "PP") : "N/A"}</div>;
		},
	},
	{
		accessorKey: "type",
		header: "Type",
		cell: ({ row }) => {
			const type = row.original.type;
			return (
				<Badge variant={type === "bus" ? "default" : "secondary"}>
					{type === "bus" ? "Bus" : "General"}
				</Badge>
			);
		},
	},
	{
		id: "bus",
		header: "Bus #",
		cell: ({ row }) => {
			return row.original.busNumber ? (
				<div>Bus # {row.original.busNumber}</div>
			) : (
				<div className="text-gray-400">N/A</div>
			);
		},
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => (
			<div className="max-w-[200px] truncate">
				{row.original.description}
			</div>
		),
	},
	{
		accessorKey: "amount",
		header: "Amount",
		cell: ({ row }) => {
			// Format as currency
			return (
				<div className="text-right font-medium">
          {row.original.amount !== undefined ? formatNumber(row.original.amount) : "N/A"}
				</div>
			);
		},
	},
	{
		id: "voucherId",
		header: "Voucher ID",
		cell: ({ row }) => {
			return row.original.busClosingVoucherId ? (
				<div>#{row.original.busClosingVoucherId}</div>
			) : (
				<div className="text-gray-400">N/A</div>
			);
		},
	},
	// {
	// 	id: "actions",
	// 	header: "Actions",
	// 	cell: ({ row }) => {
	// 		return (
	// 			<div className="flex items-center gap-2">
	// 				<button
	// 					className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs"
	// 					onClick={() => {
	// 						// View action - can be implemented later
	// 					}}
	// 				>
	// 					View
	// 				</button>
	// 				<button
	// 					className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded text-xs"
	// 					onClick={() => {
	// 						// Edit action - can be implemented later
	// 					}}
	// 				>
	// 					Edit
	// 				</button>
	// 			</div>
	// 		);
	// 	},
	// },
];