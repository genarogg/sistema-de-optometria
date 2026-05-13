import { prisma } from "@fn";
import { EstatusSuscripcion, Rol } from "@prisma/client";

const seedSuscripcionDetails = async () => {
    const agremiado = await prisma.usuario.findFirst({
        where: { rol: Rol.AGREMIADO },
    });

    if (!agremiado) {
        console.log("⚠️ No se encontró un usuario agremiado para crear suscripción");
        return;
    }

    const plan = await prisma.planSuscripcion.findFirst({
        where: { usuarioId: agremiado.id },
    });

    if (!plan) {
        console.log("⚠️ No se encontró un plan de suscripción existente para crear la suscripción");
        return;
    }

    const existingSubscription = await prisma.suscripcion.findFirst({
        where: { suscripcionId: plan.id },
    });

    if (!existingSubscription) {
        await prisma.suscripcion.create({
            data: {
                usuarioId: agremiado.id,
                suscripcionId: plan.id,
                estatus: EstatusSuscripcion.validado,
                comprobante: 12345,
                comprobanteImg: "comprobante_12345.png",
                contodesuscripcion: 2026,
                isActivo: true,
            },
        });
        console.log(`✅ Suscripción creada para ${agremiado.email}`);
    } else {
        console.log(`ℹ️ Suscripción ya existe para ${agremiado.email}`);
    }
};

export default seedSuscripcionDetails;
