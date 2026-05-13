import { prisma } from "@fn";
import { TipoSuscripcion, Rol } from "@prisma/client";

const seedSuscripcion = async () => {
    const agremiado = await prisma.usuario.findFirst({
        where: { rol: Rol.AGREMIADO },
    });

    if (!agremiado) {
        console.log("⚠️ No se encontró un usuario agremiado para crear plan de suscripción");
        return;
    }

    const existingPlan = await prisma.planSuscripcion.findFirst({
        where: { usuarioId: agremiado.id },
    });

    if (!existingPlan) {
        await prisma.planSuscripcion.create({
            data: {
                usuarioId: agremiado.id,
                tipo: TipoSuscripcion.agremiado_solvente,
                costo: 0,
            },
        });
        console.log(`✅ Plan de suscripción creado para ${agremiado.email}`);
    } else {
        console.log(`ℹ️ Plan de suscripción ya existe para ${agremiado.email}`);
    }
};

export default seedSuscripcion;
