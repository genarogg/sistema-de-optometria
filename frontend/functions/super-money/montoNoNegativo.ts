const montoNoNegativo = (valor?: number) => {
    if (valor === undefined) {
        return { isValido: true };
    };
    if (isNaN(valor) || valor < 0) {
        return { isValido: false, message: "El monto no puede ser negativo" };
    }

    if (valor >= 0) {
        return { isValido: true };
    }

    return { isValido: false, message: "Valor inválido" };
};

export default montoNoNegativo;