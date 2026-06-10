import { prisma } from "@fn";
import { EstatusSuscripcion, Rol, TipoSuscripcion } from "@prisma/client";

const seedSuscripcionDetails = async () => {
    const usuarios = await prisma.usuario.findMany({ select: { id: true, email: true } });
    const planes = await prisma.planSuscripcion.findMany({ select: { id: true, tipo: true } });

    if (usuarios.length === 0 || planes.length === 0) {
        console.log("⚠️ No hay usuarios o planes de suscripción para crear suscripciones");
        return;
    }

    const estatusSuscripcion = Object.values(EstatusSuscripcion);
    const numRecordsToCreate = 100; // Ensure at least 100 records
    let createdCount = 0;

    for (let i = 0; i < numRecordsToCreate; i++) {
        const randomUser = usuarios[Math.floor(Math.random() * usuarios.length)];
        const randomPlan = planes[Math.floor(Math.random() * planes.length)];
        const randomEstatus = estatusSuscripcion[Math.floor(Math.random() * estatusSuscripcion.length)];

        // Check if a subscription for this user and plan already exists
        const existingSubscription = await prisma.suscripcion.findFirst({
            where: { usuarioId: randomUser.id, suscripcionId: randomPlan.id },
        });

        if (!existingSubscription) {
            await prisma.suscripcion.create({
                data: {
                    usuarioId: randomUser.id,
                    suscripcionId: randomPlan.id,
                    estatus: randomEstatus,
                    comprobante: Math.floor(Math.random() * 1000000000), // Random 9-digit number
                    comprobanteImg: `https://picsum.photos/800/600?random=${i}`,
                    contodesuscripcion: new Date().getFullYear(), // Current year
                },
            });
            createdCount++;
            // console.log(`✅ Suscripción creada para ${randomUser.email} al plan ${randomPlan.tipo}`);
        }
    }
    console.log(`🎉 Total de suscripciones creadas: ${createdCount}`);
};

export default seedSuscripcionDetails;
