import { prisma } from "@fn";
import { TipoSuscripcion, EstatusSuscripcion, Rol } from "@prisma/client";

const seedSuscripcion = async () => {
    const agremiado = await prisma.usuario.findFirst({
        where: { rol: Rol.AGREMIADO },
    });

    if (!agremiado) {
        console.log("⚠️ No se encontró un usuario agremiado para crear suscripción");
        return;
    }

    const existingSuscripcion = await prisma.suscripcion.findFirst({
        where: { usuarioId: agremiado.id },
    });

    if (!existingSuscripcion) {
        await prisma.suscripcion.create({
            data: {
                usuarioId: agremiado.id,
                tipo: TipoSuscripcion.agremiado_solvente,
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

export default seedSuscripcion;
