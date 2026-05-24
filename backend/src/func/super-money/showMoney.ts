// showMoney.ts
import centsToDisplay from './inputMoney/centsToDisplay';


/**
 * Muestra un valor decimal como cadena de dinero formateada.
 * Acepta tanto enteros (cents) como decimales (valor real).
 *
 * @param value    - El valor a mostrar (decimal real, ej: 1234.56)
 * @param decimals - Número de decimales (por defecto 2)
 * @param symbol   - Símbolo de moneda opcional (ej: '$', '€')
 * @returns        - Cadena formateada, ej: "$ 1,234.56"
 */
export const showMoney = (value: number, decimals: number = 2, symbol?: string): string => {
    const formatted = centsToDisplay(value, decimals);
    return symbol ? `${symbol} ${formatted}` : formatted;
};

