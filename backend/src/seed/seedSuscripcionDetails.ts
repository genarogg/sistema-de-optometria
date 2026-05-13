import { prisma } from "@fn";
import { EstatusSuscripcion, Rol, TipoSuscripcion } from "@prisma/client";

const seedSuscripcionDetails = async () => {
    const tiposSuscripcion = [
        { tipo: TipoSuscripcion.AGREMIADO, rol: Rol.AGREMIADO_SOLVENTE },
        { tipo: TipoSuscripcion.AGREMIADO, rol: Rol.AGREMIADO_INSOLVENTE },
        { tipo: TipoSuscripcion.ESTUDIANTE, rol: Rol.ESTUDIANTE },
        { tipo: TipoSuscripcion.PROFESOR, rol: Rol.PROFESOR },
    ];

    for (const { tipo, rol } of tiposSuscripcion) {
        const plan = await prisma.planSuscripcion.findFirst({
            where: { tipo },
        });

        if (!plan) {
            console.log(`⚠️ No se encontró un plan de suscripción para tipo ${tipo}`);
            continue;
        }

        const usuarios = await prisma.usuario.findMany({
            where: { rol },
        });

        for (const usuario of usuarios) {
            const existingSubscription = await prisma.suscripcion.findFirst({
                where: { usuarioId: usuario.id, suscripcionId: plan.id },
            });

            if (!existingSubscription) {
                await prisma.suscripcion.create({
                    data: {
                        usuarioId: usuario.id,
                        suscripcionId: plan.id,
                        estatus: EstatusSuscripcion.VALIDADO,
                        comprobante: Math.floor(Math.random() * 100000),
                        comprobanteImg: `comprobante_${Math.floor(Math.random() * 100000)}.png`,
                        contodesuscripcion: 2026,
                        isActivo: true,
                    },
                });
                console.log(`✅ Suscripción creada para ${usuario.email} (${tipo})`);
            } else {
                console.log(`ℹ️ Suscripción ya existe para ${usuario.email} (${tipo})`);
            }
        }
    }
};

export default seedSuscripcionDetails;
