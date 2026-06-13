import { prisma, verificarToken, successResponse, errorResponse, log, crearBitacora } from "@fn";
import { Rol, AccionesBitacora, VigenciaEvento, TipoEvento } from "@prisma/client";

interface PonenteInput {
    id: number;
    isActivo: boolean;
}

interface CrearEventoArgs {
    token: string;
    nombre: string;
    fecha: Date;
    lugar: string;
    costo: number;
    tipo: TipoEvento;
    descuentoEstudiante?: number;
    descuentoProfesor?: number;
    descuentoAgremiado?: number;
    vigencia?: VigenciaEvento;
    ponentes?: PonenteInput[];
    aliadoInstitucionImg?: string;
    aliadoInstitucionNombre?: string;
    aliadoAutorizoFirmaImg?: string;
    aliadoAutorizoNombreFirma?: string;
    aliadoAutorizoCargo?: string;
}

const crearEvento = async (_: unknown, args: CrearEventoArgs) => {
    log.dev("crearEvento called with args:", args);

    const { 
        token, 
        nombre, 
        fecha, 
        lugar, 
        costo, 
        tipo,
        descuentoEstudiante = 0, 
        descuentoProfesor = 0, 
        descuentoAgremiado = 0,
        vigencia = VigenciaEvento.VIGENTE, 
        ponentes = [],
        aliadoInstitucionImg,
        aliadoInstitucionNombre,
        aliadoAutorizoFirmaImg,
        aliadoAutorizoNombreFirma,
        aliadoAutorizoCargo
    } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    if (!nombre || !fecha || !lugar || !costo || !tipo) {
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
                tipo,
                descuentoEstudiante,
                descuentoProfesor,
                descuentoAgremiado,
                vigencia,
                usuarioId: usuario.id,
                aliadoInstitucionImg,
                aliadoInstitucionNombre,
                aliadoAutorizoFirmaImg,
                aliadoAutorizoNombreFirma,
                aliadoAutorizoCargo,
            },
        });

        if (ponentes.length > 0) {
            const ponenteEventosData = ponentes.map(ponente => ({
                usuarioId: ponente.id,
                eventoId: nuevoEvento.id,
                isActivo: ponente.isActivo,
            }));

            await prisma.ponenteEvento.createMany({
                data: ponenteEventosData,
            });
        }

        const eventoConPonentes = await prisma.evento.findUnique({
            where: { id: nuevoEvento.id },
            include: {
                ponenteEvento: {
                    include: {
                        usuario: true
                    }
                },
            },
        });

        await crearBitacora({
            type: AccionesBitacora.CREATE_USER,
            usuarioId: usuario.id,
            mensaje: `Se creó el evento "${nombre}"`,
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
