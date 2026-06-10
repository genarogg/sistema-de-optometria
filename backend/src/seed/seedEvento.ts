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

    const eventosToCreate = [
        {
            nombre: "Taller de Contactología Avanzada",
            fecha: new Date("2026-06-15"),
            lugar: "Centro de Convenciones, Caracas",
            costo: 5000,
            tipo: TipoEvento.TALLER,
            descuentoEstudiante: 10,
            descuentoProfesor: 10,
        },
        {
            nombre: "Diplomado en Optometría Pediátrica",
            fecha: new Date("2026-07-20"),
            lugar: "Universidad Central de Venezuela",
            costo: 15000,
            tipo: TipoEvento.DIPLOMADO,
            descuentoEstudiante: 0,
            descuentoProfesor: 0,
        },
        {
            nombre: "Congreso Venezolano de Optometría",
            fecha: new Date("2026-09-10"),
            lugar: "Hotel Hilton, Caracas",
            costo: 20000,
            tipo: TipoEvento.CONGRESO,
            descuentoEstudiante: 15,
            descuentoProfesor: 15,
        },
    ];

    const eventTypes = [TipoEvento.TALLER, TipoEvento.DIPLOMADO, TipoEvento.CONGRESO];

    for (let i = 0; i < 97; i++) { // Generate 97 more events to reach 100 total
        const date = new Date(2027, (i % 12), (i % 28) + 1);
        eventosToCreate.push({
            nombre: `Evento Generado ${i + 1}`,
            fecha: date,
            lugar: `Lugar Generado ${i + 1}`,
            costo: 1000 + (i * 100),
            tipo: eventTypes[i % eventTypes.length],
            descuentoEstudiante: (i % 5) * 2,
            descuentoProfesor: (i % 5) * 2,
        });
    }

    for (const evento of eventosToCreate) {
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
