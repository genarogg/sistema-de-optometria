import { prisma } from "@fn";

const seedPonenteEvento = async () => {
    const profesor = await prisma.usuario.findFirst({
        where: { rol: "PROFESOR" },
    });

    const evento = await prisma.evento.findFirst();

    if (!profesor || !evento) {
        console.log("⚠️ No se encontró profesor o evento para crear ponente_evento");
        return;
    }

    const existing = await prisma.ponente_Evento.findFirst({
        where: {
            usuarioId: profesor.id,
            eventoId: evento.id,
        },
    });

    if (!existing) {
        await prisma.ponente_Evento.create({
            data: {
                usuarioId: profesor.id,
                eventoId: evento.id,
            },
        });
        console.log(`✅ Ponente_Evento creado: ${profesor.email} en "${evento.nombre}"`);
    } else {
        console.log(`ℹ️ Ponente_Evento ya existe`);
    }
};

export default seedPonenteEvento;
