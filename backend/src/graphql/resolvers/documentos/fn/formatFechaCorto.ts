const formatFechaCorto = (fecha: Date) => {
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear().toString().slice(-2);
    return `${dia}/${mes}/${anio}`;
};

export default formatFechaCorto;