import { prisma } from "@fn";
import { TipoAutoridad } from "@prisma/client";

const seedAutoridad = async () => {
    const autoridadesData = [
        {
            emailUsuario: "ana.perez@optometria.com",
            firma: "ana_perez_firma.png",
            tipoAutoridad: TipoAutoridad.presidente,
        },
        {
            emailUsuario: "carlos.lopez@optometria.com",
            firma: "carlos_lopez_firma.png",
            tipoAutoridad: TipoAutoridad.vicepresidente,
        },
    ];

    for (const autoridad of autoridadesData) {
        const usuario = await prisma.usuario.findUnique({
            where: { email: autoridad.emailUsuario },
        });

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
