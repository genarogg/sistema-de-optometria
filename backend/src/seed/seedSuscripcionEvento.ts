import { prisma } from "@fn";

const seedSuscripcionEvento = async () => {
    const agremiado = await prisma.usuario.findFirst({
        where: { rol: "AGREMIADO" },
    });

    const evento = await prisma.evento.findFirst();

    if (!agremiado || !evento) {
        console.log("⚠️ No se encontró agremiado o evento para crear suscripcion_evento");
        return;
    }

    const existing = await prisma.suscripcion_Evento.findFirst({
        where: {
            usuarioId: agremiado.id,
            eventoId: evento.id,
        },
    });

    if (!existing) {
        const precioFinal = evento.precio - (evento.precio * evento.descuento / 100);
        await prisma.suscripcion_Evento.create({
            data: {
                usuarioId: agremiado.id,
                eventoId: evento.id,
                precioAlSuscripcion: Math.round(precioFinal),
            },
        });
        console.log(`✅ Suscripcion_Evento creada: ${agremiado.email} en "${evento.nombre}"`);
    } else {
        console.log(`ℹ️ Suscripcion_Evento ya existe`);
    }
};

export default seedSuscripcionEvento;
