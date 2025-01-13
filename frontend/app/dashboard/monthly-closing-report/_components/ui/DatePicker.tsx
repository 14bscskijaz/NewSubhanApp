import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	add,
	eachMonthOfInterval,
	endOfYear,
	format,
	isEqual,
	isFuture,
	parse,
	startOfMonth,
	startOfToday,
} from 'date-fns';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

function getStartOfCurrentMonth() {
	return startOfMonth(startOfToday());
}

interface MonthPickerProps {
	currentMonth: Date | null;
	onMonthChange: (newMonth: Date) => void;
}

export function MonthPicker({ currentMonth, onMonthChange }: MonthPickerProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const popupRef = React.useRef<HTMLDivElement>(null); // Reference for popup container
	const [currentYear, setCurrentYear] = React.useState(
		currentMonth ? format(currentMonth, 'yyyy') : format(new Date(), 'yyyy'),
	);
	const firstDayCurrentYear = parse(currentYear, 'yyyy', new Date());

	const months = eachMonthOfInterval({
		start: firstDayCurrentYear,
		end: endOfYear(firstDayCurrentYear),
	});

	function previousYear() {
		let firstDayNextYear = add(firstDayCurrentYear, { years: -1 });
		setCurrentYear(format(firstDayNextYear, 'yyyy'));
	}

	function nextYear() {
		let firstDayNextYear = add(firstDayCurrentYear, { years: 1 });
		setCurrentYear(format(firstDayNextYear, 'yyyy'));
	}

	const togglePopup = () => setIsOpen((prev) => !prev);

	// Close the popup when clicking outside of it
	React.useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div className="relative">
			{/* Display selected month and year */}
			<button
				className={cn(
					buttonVariants({ variant: 'outline' }),
					'flex items-center space-x-2 px-4 py-2 text-sm bg-gradient-border ',
				)}
				onClick={togglePopup}
			>
				<Calendar className="h-4 w-4" />
				<span>
					{currentMonth
						? `${format(currentMonth, 'MMM yyyy')}`
						: format(new Date(), 'MMM yyyy')}
				</span>
				<ChevronDown className="h-4 w-4" />
			</button>

			{/* Popup for Month/Year Selection */}
			{isOpen && (
				<div
					ref={popupRef} // Attach the reference to the popup container
					className="absolute z-10 mt-2 w-64 rounded-md border bg-white p-4 shadow-lg dark:bg-slate-800"
				>
					<div className="flex items-center justify-between mb-4">
						<button
							aria-label="Go to previous year"
							className={cn(
								buttonVariants({ variant: 'outline' }),
								'h-7 w-7 p-0',
							)}
							onClick={previousYear}
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<span className="text-sm font-medium">{currentYear}</span>
						<button
							aria-label="Go to next year"
							className={cn(
								buttonVariants({ variant: 'outline' }),
								'h-7 w-7 p-0',
							)}
							disabled={isFuture(add(firstDayCurrentYear, { years: 1 }))}
							onClick={nextYear}
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>

					<div
						className="grid w-full grid-cols-3 gap-2"
						role="grid"
						aria-labelledby="month-picker"
					>
						{months.map((month) => (
							<div key={month.toString()} className="text-center">
								<button
									name="day"
									className={cn(
										'inline-flex h-9 w-16 items-center justify-center rounded-md text-sm font-normal transition-colors hover:bg-slate-100 dark:hover:bg-slate-700',
										isEqual(month, currentMonth ?? new Date()) &&
											'bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900',
									)}
									disabled={isFuture(month)}
									type="button"
									onClick={() => {
										onMonthChange(month);
										setIsOpen(false);
									}}
								>
									<time dateTime={format(month, 'yyyy-MM-dd')}>
										{format(month, 'MMM')}
									</time>
								</button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
