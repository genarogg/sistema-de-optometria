const formatFechaCorto = (fecha: Date) => {
    const fechaSiguienteAnio = new Date(fecha);
    fechaSiguienteAnio.setFullYear(fechaSiguienteAnio.getFullYear() + 1);
    
    const dia = fechaSiguienteAnio.getDate().toString().padStart(2, "0");
    const mes = (fechaSiguienteAnio.getMonth() + 1).toString().padStart(2, "0");
    const anio = fechaSiguienteAnio.getFullYear().toString().slice(-2);
    return `${dia}/${mes}/${anio}`;
};

export default formatFechaCorto;