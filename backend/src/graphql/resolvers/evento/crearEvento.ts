import { prisma, verificarToken, successResponse, errorResponse, log, crearBitacora } from "@fn";
import { Rol, AccionesBitacora, VigenciaEvento } from "@prisma/client";

interface CrearEventoArgs {
    token: string;
    nombre: string;
    fecha: Date;
    lugar: string;
    costo: number;
    descuentoEstudiante?: number;
    descuentoProfesor?: number;
    vigencia?: VigenciaEvento;
    ponentesIds?: number[];
}

const crearEvento = async (_: unknown, args: CrearEventoArgs) => {
    log.dev("crearEvento called with args:", args);

    const {
        token,
        nombre,
        fecha,
        lugar,
        costo,
        descuentoEstudiante = 0,
        descuentoProfesor = 0,
        vigencia = VigenciaEvento.VIGENTE,
        ponentesIds = []
    } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    if (!nombre || !fecha || !lugar || !costo) {
        return errorResponse({ message: "Todos los campos obligatorios deben ser proporcionados" });
    }

    try {
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        if (usuario.rol !== Rol.SUPER_USUARIO && usuario.rol !== Rol.ADMINISTRADOR) {
            return errorResponse({ message: "No tiene permisos para crear eventos" });
        }

        const nuevoEvento = await prisma.evento.create({
            data: {
                nombre,
                fecha,
                lugar,
                costo,
                descuentoEstudiante,
                descuentoProfesor,
                vigencia,
                usuarioId: usuario.id,
            },
        });

        if (ponentesIds.length > 0) {
            const ponenteEventosData = ponentesIds.map(ponenteId => ({
                usuarioId: ponenteId,
                eventoId: nuevoEvento.id,
            }));

            await prisma.ponenteEvento.createMany({
                data: ponenteEventosData,
            });
        }

        const eventoConPonentes = await prisma.evento.findUnique({
            where: { id: nuevoEvento.id },
            include: {
                ponenteEvento: true,
            },
        });

        await crearBitacora({
            type: AccionesBitacora.CREAR_EVENTO,
            usuarioId: usuario.id,
            mensaje: `Se creó el evento "${nombre}", con el ID ${nuevoEvento.id}`,
        });

        return successResponse({
            message: "Evento creado exitosamente",
            data: eventoConPonentes,
        });
    } catch (error: any) {
        log.error("Error en crearEvento:", error);
        return errorResponse({ message: error.message || "Error al crear el evento" });
    }
};

export default crearEvento;
