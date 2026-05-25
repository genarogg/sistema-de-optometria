import { prisma, verificarToken, successResponse, errorResponse, log, crearBitacora } from "@fn";
import { Rol, AccionesBitacora, VigenciaEvento } from "@prisma/client";

interface ActualizarEventoArgs {
    token: string;
    eventoId: number;
    nombre?: string;
    fecha?: Date;
    lugar?: string;
    consto?: number;
    descuentoEstudiante?: number;
    descuentoProfesor?: number;
    vigencia?: VigenciaEvento;
    ponentesIds?: number[];
}

const actualizarEvento = async (_: unknown, args: ActualizarEventoArgs) => {
    log.dev("actualizarEvento called with args:", args);

    const { 
        token, 
        eventoId, 
        nombre, 
        fecha, 
        lugar, 
        consto, 
        descuentoEstudiante, 
        descuentoProfesor, 
        vigencia, 
        ponentesIds 
    } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    if (!eventoId) {
        return errorResponse({ message: "ID del evento es obligatorio" });
    }

    try {
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        if (usuario.rol !== Rol.SUPER_USUARIO && usuario.rol !== Rol.ADMINISTRADOR) {
            return errorResponse({ message: "No tiene permisos para actualizar eventos" });
        }

        const eventoExistente = await prisma.evento.findUnique({
            where: { id: eventoId }
        });

        if (!eventoExistente) {
            return errorResponse({ message: "El evento no existe" });
        }

        const data: any = {};
        if (nombre !== undefined) data.nombre = nombre;
        if (fecha !== undefined) data.fecha = fecha;
        if (lugar !== undefined) data.lugar = lugar;
        if (consto !== undefined) data.consto = consto;
        if (descuentoEstudiante !== undefined) data.descuentoEstudiante = descuentoEstudiante;
        if (descuentoProfesor !== undefined) data.descuentoProfesor = descuentoProfesor;
        if (vigencia !== undefined) data.vigencia = vigencia;

        const eventoActualizado = await prisma.evento.update({
            where: { id: eventoId },
            data,
        });

        if (ponentesIds !== undefined) {
            await prisma.ponenteEvento.deleteMany({
                where: { eventoId }
            });

            if (ponentesIds.length > 0) {
                const ponenteEventosData = ponentesIds.map(ponenteId => ({
                    usuarioId: ponenteId,
                    eventoId: eventoId,
                }));

                await prisma.ponenteEvento.createMany({
                    data: ponenteEventosData,
                });
            }
        }

        const eventoConPonentes = await prisma.evento.findUnique({
            where: { id: eventoId },
            include: {
                ponenteEvento: true,
            },
        });

        await crearBitacora({
            type: AccionesBitacora.UPDATE_EVENTO,
            usuarioId: usuario.id,
            mensaje: `Se actualizó el evento "${eventoConPonentes?.nombre}"`,
        });

        return successResponse({
            message: "Evento actualizado exitosamente",
            data: eventoConPonentes,
        });
    } catch (error: any) {
        log.error("Error en actualizarEvento:", error);
        return errorResponse({ message: error.message || "Error al actualizar el evento" });
    }
};

export default actualizarEvento;
