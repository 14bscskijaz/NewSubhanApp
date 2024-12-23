import accounting from 'accounting';

const useAccounting = () => {
    const formatCurrency = (amount: number): string => {
        return accounting.formatMoney(amount, {
            symbol: '',
            format: '%s%v',
            thousand: ',',
        });
    };

    return {
        formatCurrency,
    };
};

export default useAccounting;
