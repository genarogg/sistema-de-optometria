/**
 * Normaliza formatos monetarios comunes:
 *  - "18,582.11" → "18582.11"  (US)
 *  - "18.582,11" → "18582.11"  (EU)
 *  - "17.20"     → "17.20"
 */
const normalizeMoney = (input: string): string => {
    if (typeof input !== "string") {
        throw new Error("Input must be a string");
    }

    const trimmed = input.trim();

    const hasCommaDecimal =
        trimmed.includes(",") &&
        trimmed.lastIndexOf(",") > trimmed.lastIndexOf(".");

    if (hasCommaDecimal) {
        // Formato europeo
        return trimmed.replace(/\./g, "").replace(",", ".");
    }

    // Formato US o simple
    return trimmed.replace(/,/g, "");
};

export default normalizeMoney;