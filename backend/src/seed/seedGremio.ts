import { prisma } from "@fn";
import { NivelAcademico } from "@prisma/client";

const seedGremio = async () => {
    const gremiosToCreate = [];

    // Existing gremios
    gremiosToCreate.push({
        emailUsuario: "ana.perez@optometria.com",
        numeroGremio: 1001,
        nivelAcademico: NivelAcademico.LICENCIADO,
    });
    gremiosToCreate.push({
        emailUsuario: "carlos.lopez@optometria.com",
        numeroGremio: 1002,
        nivelAcademico: NivelAcademico.LICENCIADO,
    });
    gremiosToCreate.push({
        emailUsuario: "genarrogg@gmail.com",
        numeroGremio: 999,
        nivelAcademico: NivelAcademico.LICENCIADO,
    });

    // Fetch all users
    const allUsers = await prisma.usuario.findMany({
        select: { id: true, email: true },
    });

    const existingGremioUsers = await prisma.gremio.findMany({
        select: { usuarioId: true },
    });

    const existingGremioUserIds = new Set(existingGremioUsers.map(g => g.usuarioId));

    const usersWithoutGremio = allUsers.filter(user => !existingGremioUserIds.has(user.id));

    const academicLevels = [NivelAcademico.LICENCIADO, NivelAcademico.LICENCIADO, NivelAcademico.LICENCIADO, NivelAcademico.LICENCIADO];

    // Generate additional gremios for users without one, up to 100 or more
    let gremioCounter = 1003;
    for (let i = 0; i < usersWithoutGremio.length && gremiosToCreate.length < 100; i++) {
        const user = usersWithoutGremio[i];
        gremiosToCreate.push({
            emailUsuario: user.email,
            numeroGremio: gremioCounter++,
            nivelAcademico: academicLevels[i % academicLevels.length],
        });
    }

    for (const gremio of gremiosToCreate) {
        const usuario = allUsers.find(u => u.email === gremio.emailUsuario);

        if (!usuario) {
            console.log(`⚠️ Usuario ${gremio.emailUsuario} no encontrado para crear gremio`);
            continue;
        }

        const existingGremio = await prisma.gremio.findFirst({
            where: { usuarioId: usuario.id },
        });

        if (!existingGremio) {
            await prisma.gremio.create({
                data: {
                    numeroGremio: gremio.numeroGremio,
                    nivelAcademico: gremio.nivelAcademico,
                    usuarioId: usuario.id,
                },
            });
            console.log(`✅ Gremio para ${gremio.emailUsuario} creado (número: ${gremio.numeroGremio})`);
        } else {
            console.log(`ℹ️ Gremio para ${gremio.emailUsuario} ya existe`);
        }
    }
};
// 
export default seedGremio;
