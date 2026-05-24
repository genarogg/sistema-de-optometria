import Decimal from "decimal.js";

export const intToDecimalNumber = (value: bigint | number | string): number => {
    let raw: Decimal;
    if (typeof value === "bigint") {
        raw = new Decimal(value.toString());
    } else {
        raw = new Decimal(value as number | string);
    }

    // siempre dividir entre 100
    return raw.div(100).toDecimalPlaces(2).toNumber();
};