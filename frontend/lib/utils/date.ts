export const normalizeDate = (date: string | Date): Date => {
    const d = new Date(date);
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0));
  };
  
  export const parseDateRange = (dateRange: string): { start: Date | null; end: Date | null } => {
    if (!dateRange) return { start: null, end: null };
    
    const [startDate, endDate] = dateRange.split('|');
    const parsedStart = startDate ? normalizeDate(startDate) : null;
    const parsedEnd = endDate ? normalizeDate(endDate) : null;
    
    if (parsedEnd) parsedEnd.setDate(parsedEnd.getDate() + 1);
    
    return { start: parsedStart, end: parsedEnd };
  };
  
  