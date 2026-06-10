import { prisma } from "@fn";
import { TipoAutoridad } from "@prisma/client";

const seedAutoridad = async () => {
    const autoridadesToCreate = [];

    // Existing autoridades
    autoridadesToCreate.push({
        emailUsuario: "ana.perez@optometria.com",
        firma: "ana_perez_firma.png",
        tipoAutoridad: TipoAutoridad.PRESIDENTE,
    });
    autoridadesToCreate.push({
        emailUsuario: "carlos.lopez@optometria.com",
        firma: "carlos_lopez_firma.png",
        tipoAutoridad: TipoAutoridad.VICEPRESIDENTE,
    });

    // Fetch all users
    const allUsers = await prisma.usuario.findMany({
        select: { id: true, email: true },
    });

    const existingAutoridadUsers = await prisma.autoridad.findMany({
        select: { usuarioId: true },
    });

    const existingAutoridadUserIds = new Set(existingAutoridadUsers.map(a => a.usuarioId));

    const usersWithoutAutoridad = allUsers.filter(user => !existingAutoridadUserIds.has(user.id));

    const authorityTypes = [TipoAutoridad.PRESIDENTE, TipoAutoridad.VICEPRESIDENTE, TipoAutoridad.VICEPRESIDENTE, TipoAutoridad.VICEPRESIDENTE];

    // Generate additional autoridades for users without one, up to 100 or more
    for (let i = 0; i < usersWithoutAutoridad.length && autoridadesToCreate.length < 100; i++) {
        const user = usersWithoutAutoridad[i];
        autoridadesToCreate.push({
            emailUsuario: user.email,
            firma: `firma_generada_${i}.png`,
            tipoAutoridad: authorityTypes[i % authorityTypes.length],
        });
    }

    for (const autoridad of autoridadesToCreate) {
        const usuario = allUsers.find(u => u.email === autoridad.emailUsuario);

        if (!usuario) {
            console.log(`⚠️ Usuario ${autoridad.emailUsuario} no encontrado para crear autoridad`);
            continue;
        }

        const existingAutoridad = await prisma.autoridad.findFirst({
            where: { usuarioId: usuario.id },
        });

        if (!existingAutoridad) {
            await prisma.autoridad.create({
                data: {
                    firma: autoridad.firma,
                    tipoAutoridad: autoridad.tipoAutoridad,
                    usuarioId: usuario.id,
                },
            });
            console.log(`✅ Autoridad para ${autoridad.emailUsuario} creado (${autoridad.tipoAutoridad})`);
        } else {
            console.log(`ℹ️ Autoridad para ${autoridad.emailUsuario} ya existe`);
        }
    }
};

export default seedAutoridad;
