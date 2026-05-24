const normalizeMoney = (value: string): string => {
    const trimmed = value.trim().replace(/\s/g, "");

    // Quitar todos los puntos y comas para quedarnos solo con dígitos
    // Pero primero detectar si hay parte decimal (coma o punto como decimal)
    
    let intPart: string;
    let decPart: string = "00";

    // Tiene coma → la coma es separador decimal
    // "8.800,20" → entero="8800", dec="20"
    // "1.115,00" → entero="1115", dec="00"
    if (trimmed.includes(",")) {
        const [left, right] = trimmed.split(",");
        intPart = left.replace(/\./g, "");
        decPart = right.padEnd(2, "0").slice(0, 2);
    }
    // Tiene un punto con exactamente 2 dígitos al final → es decimal
    // "1115.22" → entero="1115", dec="22"
    else if (/\.\d{2}$/.test(trimmed) && (trimmed.match(/\./g) || []).length === 1) {
        const [left, right] = trimmed.split(".");
        intPart = left;
        decPart = right;
    }
    // Sin decimal → todos los puntos son miles, dec="00"
    // "8.800" → entero="8800", dec="00"
    // "1115"  → entero="1115", dec="00"
    else {
        intPart = trimmed.replace(/\./g, "");
        decPart = "00";
    }

    // Resultado como string decimal estándar
    return `${intPart}.${decPart}`;
};

export default normalizeMoney;