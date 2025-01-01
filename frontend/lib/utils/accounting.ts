import accounting from 'accounting';

interface FormatOptions {
  symbol?: string;
  format?: string;
  thousand?: string;
  precision?: number;
  negative?: string;
}

export const formatNumber = (amount: number): string => {
  const options: FormatOptions = {
    symbol: '', // No currency symbol
    format: '%s%v', // Default format
    thousand: ',', // Thousands separator
    precision: 0, // No decimal places
    negative: '(%v)', // Format for negative numbers
  };

  // Check if the number is negative
  if (amount < 0) {
    return accounting.formatMoney(
      Math.abs(amount), // Format the positive value
      options.symbol, 
      options.precision, 
      options.thousand, 
      options.format, 
      options.negative
    );
  }

  // For positive values, return normally
  return accounting.formatMoney(
    amount, 
    options.symbol, 
    options.precision, 
    options.thousand, 
    options.format
  );
};
