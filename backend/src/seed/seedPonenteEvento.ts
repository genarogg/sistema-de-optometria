import { prisma } from "@fn";

const seedPonenteEvento = async () => {
    const profesores = await prisma.usuario.findMany({
        where: { rol: "PROFESOR" },
    });
    const eventos = await prisma.evento.findMany();

    if (profesores.length === 0 || eventos.length === 0) {
        console.log("⚠️ No hay profesores o eventos para crear ponente_evento");
        return;
    }

    const numRecordsToCreate = 100; // Ensure at least 100 records
    let createdCount = 0;

    for (let i = 0; i < numRecordsToCreate; i++) {
        const randomProfesor = profesores[Math.floor(Math.random() * profesores.length)];
        const randomEvento = eventos[Math.floor(Math.random() * eventos.length)];

        const existing = await prisma.ponenteEvento.findFirst({
            where: {
                usuarioId: randomProfesor.id,
                eventoId: randomEvento.id,
            },
        });

        if (!existing) {
            await prisma.ponenteEvento.create({
                data: {
                    usuarioId: randomProfesor.id,
                    eventoId: randomEvento.id,
                },
            });
            createdCount++;
            // console.log(`✅ Ponente_Evento creado: ${randomProfesor.email} en "${randomEvento.nombre}"`);
        }
    }
    console.log(`🎉 Total de ponente_evento creados: ${createdCount}`);
};

export default seedPonenteEvento;
