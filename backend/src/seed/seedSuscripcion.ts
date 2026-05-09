import { prisma } from "@fn";
import { TipoSuscripcion, EstatusSuscripcion } from "@prisma/client";

const seedSuscripcion = async () => {
    const gremio = await prisma.gremio.findFirst({
        include: { Usuario: true },
    });

    if (!gremio) {
        console.log("⚠️ No se encontró gremio para crear suscripción");
        return;
    }

    const existingSuscripcion = await prisma.suscripcion.findFirst({
        where: { gremioId: gremio.id },
    });

    if (!existingSuscripcion) {
        await prisma.suscripcion.create({
            data: {
                gremioId: gremio.id,
                tipo: TipoSuscripcion.agremiado_solvente,
                estatus: EstatusSuscripcion.validado,
                comprobante: 12345,
                comprobanteImg: "comprobante_12345.png",
                contodesuscripcion: 2026,
            },
        });
        console.log(`✅ Suscripción creada para ${gremio.Usuario.email}`);
    } else {
        console.log(`ℹ️ Suscripción ya existe para ${gremio.Usuario.email}`);
    }
};

export default seedSuscripcion;
