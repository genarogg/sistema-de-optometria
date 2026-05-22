import Decimal from "decimal.js";
import formatNumber from "./formatNumber";

const intToDecimal = (value: bigint | number | string): string => {
    let raw: Decimal;

    if (typeof value === "bigint") {
        raw = new Decimal(value.toString());
    } else if (typeof value === "number") {
        if (!Number.isFinite(value)) {
            throw new Error("Number must be a finite value");
        }
        raw = new Decimal(value);
    } else if (typeof value === "string") {
        raw = new Decimal(value);
    } else {
        throw new Error("Value must be bigint, number, or string");
    }

    const decimalValue = raw.isInt()
        ? raw.div(100)
        : raw;

    return formatNumber(decimalValue.toDecimalPlaces(2).toNumber());
};

export default intToDecimal;