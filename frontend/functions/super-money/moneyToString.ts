const unidades = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
    'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete',
    'dieciocho', 'diecinueve', 'veinte', 'veintiún', 'veintidós', 'veintitrés',
    'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];

const decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];

const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos',
    'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

const convertirGrupo = (n: number): string => {
    if (n === 0) return '';
    if (n === 100) return 'cien';
    if (n < 30) return unidades[n];

    const c = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const u = n % 10;

    const textoCentena = centenas[c];
    const textoDecena = d >= 3 ? decenas[d] + (u > 0 ? ` y ${unidades[u]}` : '') : '';
    const textoUnidad = d < 3 && n >= 30 ? unidades[n % 100] : '';

    return [textoCentena, textoDecena || textoUnidad].filter(Boolean).join(' ');
};

const numeroATexto = (n: number): string => {
    if (n === 0) return 'cero';
    if (n < 0) return `menos ${numeroATexto(-n)}`;

    const millones = Math.floor(n / 1_000_000);
    const miles = Math.floor((n % 1_000_000) / 1_000);
    const resto = n % 1_000;

    const partes: string[] = [];

    if (millones > 0) {
        partes.push(millones === 1 ? 'un millón' : `${convertirGrupo(millones)} millones`);
    }

    if (miles > 0) {
        partes.push(miles === 1 ? 'mil' : `${convertirGrupo(miles)} mil`);
    }

    if (resto > 0) {
        partes.push(convertirGrupo(resto));
    }

    return partes.join(' ');
};

const moneyToString = (
    monto: number | string,
    moneda?: {
        plural?: string;
        singular?: string;
        centPlural?: string;
        centSingular?: string;
    }
): string => {
    const montoNumerico = typeof monto === 'string' ? parseFloat(monto) : monto;

    const cfg = {
        plural:      moneda?.plural      ?? 'Bolívares',
        singular:    moneda?.singular    ?? 'Bolívar',
        centPlural:  moneda?.centPlural  ?? 'céntimos',
        centSingular: moneda?.centSingular ?? 'céntimo',
    };

    try {
        const entero    = Math.floor(montoNumerico);
        const decimales = Math.round((montoNumerico % 1) * 100);

        const textoEntero    = numeroATexto(entero);
        const textoDecimales = numeroATexto(decimales);

        const textoMoneda   = entero    === 1 ? cfg.singular    : cfg.plural;
        const textoCentimos = decimales === 1 ? cfg.centSingular : cfg.centPlural;

        const resultado = `${textoEntero} ${textoMoneda} con ${textoDecimales} ${textoCentimos}`;

        return resultado.charAt(0).toUpperCase() + resultado.slice(1);
    } catch (error) {
        console.error('Error al convertir monto a texto:', error);
        return `${montoNumerico} ${cfg.plural}`;
    }
};

export default moneyToString;