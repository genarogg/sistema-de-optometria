const formatNumber = (value: number): string =>
    new Intl.NumberFormat('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);

export default formatNumber;