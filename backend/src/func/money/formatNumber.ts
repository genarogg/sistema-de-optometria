const formatNumber = (value: number): string => {
    const formatted = new Intl.NumberFormat('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);

    // es-VE produce "8.857,12"
    // intercambiamos separadores → "8.857.12"
    return formatted.replace(',', '.');
};

export default formatNumber;