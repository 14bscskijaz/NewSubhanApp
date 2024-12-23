import accounting from 'accounting';

interface FormatOptions {
  symbol?: string;
  format?: string;
  thousand?: string;
  precision?: number;
  negative?: string;
}

const useAccounting = () => {
  const formatNumber = (amount: number): string => {
    const options: FormatOptions = {
      symbol: '', 
      format: '%s%v', 
      thousand: ',',
      precision: 0, 
      negative: '(%v)' 
    };

    return accounting.formatMoney(amount, options);
  };



  return {
    formatNumber,
  };
};

export default useAccounting;