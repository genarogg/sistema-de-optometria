import Decimal from "decimal.js";
import normalizeMoney from "./normalizeMoney";

function decimalToInt(input: string | number | Decimal | undefined): number {
    if (input === undefined) {
        return 0;
    }

    // Si ya es number entero nativo, viene en centavos — devolver directo
    if (typeof input === "number" && Number.isInteger(input)) {
        return input;
    }

    const normalized =
        typeof input === "string"
            ? normalizeMoney(input)
            : input;

    const decimal = new Decimal(normalized);

    if (!decimal.isFinite()) {
        throw new Error("Invalid monetary value");
    }

    const result = decimal
        .mul(100)
        .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
        .toNumber();

    if (result > Number.MAX_SAFE_INTEGER) {
        throw new Error("Value exceeds safe integer range, use toBigInt instead");
    }

    return result;
}

export default decimalToInt;