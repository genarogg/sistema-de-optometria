import { prisma } from "@fn";
import { EstatusSuscripcion, Rol } from "@prisma/client";

const seedSuscripcionDetails = async () => {
    const agremiado = await prisma.usuario.findFirst({
        where: { rol: Rol.AGREMIADO },
    });

    if (!agremiado) {
        console.log("⚠️ No se encontró un usuario agremiado para crear detalles de suscripción");
        return;
    }

    const suscripcion = await prisma.suscripcion.findFirst({
        where: { usuarioId: agremiado.id },
    });

    if (!suscripcion) {
        console.log("⚠️ No se encontró una suscripción existente para crear los detalles");
        return;
    }

    const existingDetails = await prisma.suscripcionDetails.findFirst({
        where: { suscripcionId: suscripcion.id },
    });

    if (!existingDetails) {
        await prisma.suscripcionDetails.create({
            data: {
                usuarioId: agremiado.id,
                suscripcionId: suscripcion.id,
                estatus: EstatusSuscripcion.validado,
                comprobante: 12345,
                comprobanteImg: "comprobante_12345.png",
                contodesuscripcion: 2026,
                isActivo: true,
            },
        });
        console.log(`✅ Detalles de suscripción creados para ${agremiado.email}`);
    } else {
        console.log(`ℹ️ Detalles de suscripción ya existen para ${agremiado.email}`);
    }
};

export default seedSuscripcionDetails;
