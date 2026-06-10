import { prisma } from "@fn";
import { TipoSuscripcion, Rol } from "@prisma/client";

const seedSuscripcion = async () => {
    const administradores = await prisma.usuario.findMany({
        where: { rol: Rol.ADMINISTRADOR },
        select: { id: true, email: true },
    });

    if (administradores.length === 0) {
        console.log("⚠️ No se encontraron administradores para crear planes de suscripción");
        return;
    }

    const tiposSuscripcionEnum = Object.values(TipoSuscripcion);
    const numPlansToCreate = 100;
    let createdCount = 0;

    for (let i = 0; i < numPlansToCreate; i++) {
        const randomTipo = tiposSuscripcionEnum[Math.floor(Math.random() * tiposSuscripcionEnum.length)];
        const randomAdmin = administradores[Math.floor(Math.random() * administradores.length)];
        const randomCosto = Math.floor(Math.random() * 500) * 10; // Multiples of 10

        // Check if a similar plan already exists (same type and adminId)
        // This check might prevent reaching 100 unique plans if combinations are exhausted quickly
        const existingPlan = await prisma.planSuscripcion.findFirst({
            where: { tipo: randomTipo, usuarioId: randomAdmin.id, costo: randomCosto },
        });

        if (!existingPlan) {
            await prisma.planSuscripcion.create({
                data: {
                    usuarioId: randomAdmin.id,
                    tipo: randomTipo,
                    costo: randomCosto,
                    isActivo: true, // Default to active
                },
            });
            createdCount++;
            // console.log(`✅ Plan de suscripción ${randomTipo} creado con costo ${randomCosto} para ${randomAdmin.email}`);
        }
    }
    console.log(`🎉 Total de planes de suscripción creados: ${createdCount}`);
};

export default seedSuscripcion;
