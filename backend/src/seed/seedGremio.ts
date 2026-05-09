import { prisma } from "@fn";

const seedGremio = async () => {
    const gremiosData = [
        {
            emailUsuario: "ana.perez@optometria.com",
            numeroGremio: 1001,
            nivelAcademico: "Licenciado en Optometría",
        },
        {
            emailUsuario: "carlos.lopez@optometria.com",
            numeroGremio: 1002,
            nivelAcademico: "Maestro en Optometría Clínica",
        },
        {
            emailUsuario: "genarrogg@gmail.com",
            numeroGremio: 999,
            nivelAcademico: "Ingeniero en Sistemas",
        },
    ];

    const usuarios = await prisma.usuario.findMany({
        where: {
            email: { in: gremiosData.map(g => g.emailUsuario) },
        },
        select: { id: true, email: true },
    });

    const usuarioMap = new Map(usuarios.map(u => [u.email, u.id]));

    for (const gremio of gremiosData) {
        const usuarioId = usuarioMap.get(gremio.emailUsuario);
        if (!usuarioId) {
            console.log(`⚠️ Usuario ${gremio.emailUsuario} no encontrado para crear gremio`);
            continue;
        }

        const existingGremio = await prisma.gremio.findFirst({
            where: { usuarioId },
        });

        if (!existingGremio) {
            await prisma.gremio.create({
                data: {
                    numeroGremio: gremio.numeroGremio,
                    nivelAcademico: gremio.nivelAcademico,
                    usuarioId,
                },
            });
            console.log(`✅ Gremio para ${gremio.emailUsuario} creado (número: ${gremio.numeroGremio})`);
        } else {
            console.log(`ℹ️ Gremio para ${gremio.emailUsuario} ya existe`);
        }
    }
};

export default seedGremio;
