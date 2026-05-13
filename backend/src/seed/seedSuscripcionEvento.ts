import { prisma } from "@fn";
import { Rol } from "@prisma/client";

const seedSuscripcionEvento = async () => {
    const agremiados = await prisma.usuario.findMany({
        where: { rol: Rol.AGREMIADO_SOLVENTE },
    });

    const eventos = await prisma.evento.findMany();

    if (agremiados.length === 0 || eventos.length === 0) {
        console.log("⚠️ No se encontraron agremiados o eventos para crear suscripcion_evento");
        return;
    }

    for (const agremiado of agremiados) {
        for (const evento of eventos) {
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
                console.log(`ℹ️ Suscripcion_Evento ya existe para ${agremiado.email} en "${evento.nombre}"`);
            }
        }
    }
};

export default seedSuscripcionEvento;
