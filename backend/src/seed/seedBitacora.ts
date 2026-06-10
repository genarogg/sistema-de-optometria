import { prisma } from "@fn";
import { AccionesBitacora } from "@prisma/client";

const seedBitacora = async () => {
    const usuarios = await prisma.usuario.findMany({ select: { id: true } });

    if (usuarios.length === 0) {
        console.log("⚠️ No hay usuarios para crear registros de bitácora");
        return;
    }

    const bitacoraActions = Object.values(AccionesBitacora);

    const numRecordsToCreate = 100; // Ensure at least 100 records
    let createdCount = 0;

    for (let i = 0; i < numRecordsToCreate; i++) {
        const randomUser = usuarios[Math.floor(Math.random() * usuarios.length)];
        const randomAction = bitacoraActions[Math.floor(Math.random() * bitacoraActions.length)];
        const message = `${randomAction} ejecutado por el usuario ${randomUser.id}`;

        await prisma.bitacora.create({
            data: {
                type: randomAction,
                mensaje: message,
                usuarioId: randomUser.id,
            },
        });
        createdCount++;
    }

    console.log(`🎉 Total de registros de bitácora creados: ${createdCount}`);
};

export default seedBitacora;
