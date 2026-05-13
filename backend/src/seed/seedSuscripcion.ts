import { prisma } from "@fn";
import { TipoSuscripcion, Rol } from "@prisma/client";

const seedSuscripcion = async () => {
    const tiposSuscripcion = [
        { tipo: TipoSuscripcion.AGREMIADO, rol: Rol.AGREMIADO_SOLVENTE, costo: 0 },
        { tipo: TipoSuscripcion.ESTUDIANTE, rol: Rol.ESTUDIANTE, costo: 50 },
        { tipo: TipoSuscripcion.PROFESOR, rol: Rol.PROFESOR, costo: 100 },
    ];

    for (const { tipo, rol, costo } of tiposSuscripcion) {
        const usuario = await prisma.usuario.findFirst({
            where: { rol },
        });

        if (!usuario) {
            console.log(`⚠️ No se encontró un usuario con rol ${rol} para crear plan de suscripción ${tipo}`);
            continue;
        }

        const existingPlan = await prisma.planSuscripcion.findFirst({
            where: { tipo, usuarioId: usuario.id },
        });

        if (!existingPlan) {
            await prisma.planSuscripcion.create({
                data: {
                    usuarioId: usuario.id,
                    tipo,
                    costo,
                },
            });
            console.log(`✅ Plan de suscripción ${tipo} creado para ${usuario.email}`);
        } else {
            console.log(`ℹ️ Plan de suscripción ${tipo} ya existe para ${usuario.email}`);
        }
    }
};

export default seedSuscripcion;
