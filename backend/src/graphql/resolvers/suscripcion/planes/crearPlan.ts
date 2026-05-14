import { prisma, verificarToken, successResponse, errorResponse, log, crearBitacora } from "@fn";
import { decimalToInt, montoNoNegativo } from "@fn/money";
import { Rol, AccionesBitacora, TipoSuscripcion } from "@prisma/client";

interface CrearPlanArgs {
    token: string;
    costo: number;
    tipo: TipoSuscripcion;
}

const crearPlan = async (_: unknown, args: CrearPlanArgs) => {
    log.dev("crearPlan called with args:", args);

    const { token, costo, tipo } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        if (usuario.rol !== Rol.SUPER_USUARIO) {
            return errorResponse({ message: "No tiene permisos para crear planes de suscripción" });
        }

        const montoValidation = montoNoNegativo(costo);
        if (!montoValidation.isValido) {
            return errorResponse({ message: montoValidation.message });
        }

        const nuevoPlan = await prisma.planSuscripcion.create({
            data: {
                usuarioId: usuario.id,
                costo: decimalToInt(costo),
                tipo: tipo,
            },
        });

        // Registrar en bitácora
        await crearBitacora({
            type: AccionesBitacora.CREAR_PLAN_SUSCRIPCION,
            usuarioId: usuario.id,
            mensaje: `Se creó un plan de suscripción para el usuario ${usuario.email}`,
        });

        console.log("Plan de suscripción creado:", nuevoPlan);

        return successResponse({
            message: "Plan de suscripción creado exitosamente",
            data: nuevoPlan,
        });
    } catch (error: any) {
        log.error("Error en crearPlan:", error);
        return errorResponse({ message: error.message || "Error al crear el plan de suscripción" });
    }
};

export default crearPlan;