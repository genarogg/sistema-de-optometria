import { prisma, verificarToken, successResponse, errorResponse, log, crearBitacora } from "@fn";
import { Rol, AccionesBitacora, VigenciaEvento, TipoEvento } from "@prisma/client";

interface ActualizarEventoArgs {
    token: string;
    eventoId: number;
    nombre?: string;
    fecha?: Date;
    lugar?: string;
    costo?: number;
    tipo?: TipoEvento;
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
        costo, 
        tipo,
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
        if (costo !== undefined) data.costo = costo;
        if (tipo !== undefined) data.tipo = tipo;
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
                ponenteEvento: {
                    include: {
                        usuario: true
                    }
                },
            },
        });

        await crearBitacora({
            type: AccionesBitacora.UPDATE_USER,
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
