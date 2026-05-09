import { prisma } from "@fn";
import { TipoEvento } from "@prisma/client";

const seedEvento = async () => {
    const admin = await prisma.usuario.findFirst({
        where: { rol: "ADMINISTRADOR" },
    });

    if (!admin) {
        console.log("⚠️ No se encontró usuario ADMINISTRADOR para crear eventos");
        return;
    }

    const eventosData = [
        {
            nombre: "Taller de Contactología Avanzada",
            fecha: new Date("2026-06-15"),
            lugar: "Centro de Convenciones, Caracas",
            precio: 50,
            descuento: 10,
            tipo: TipoEvento.taller,
        },
        {
            nombre: "Diplomado en Optometría Pediátrica",
            fecha: new Date("2026-07-20"),
            lugar: "Universidad Central de Venezuela",
            precio: 150,
            descuento: 0,
            tipo: TipoEvento.diplomado,
        },
        {
            nombre: "Congreso Venezolano de Optometría",
            fecha: new Date("2026-09-10"),
            lugar: "Hotel Hilton, Caracas",
            precio: 200,
            descuento: 15,
            tipo: TipoEvento.congreso,
        },
    ];

    for (const evento of eventosData) {
        const existingEvento = await prisma.evento.findFirst({
            where: { nombre: evento.nombre },
        });

        if (!existingEvento) {
            await prisma.evento.create({
                data: {
                    ...evento,
                    usuarioId: admin.id,
                },
            });
            console.log(`✅ Evento "${evento.nombre}" creado`);
        } else {
            console.log(`ℹ️ Evento "${evento.nombre}" ya existe`);
        }
    }
};

export default seedEvento;
