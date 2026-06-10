import { prisma, verificarToken, successResponse, errorResponse, log, crearBitacora } from "@fn";
import { TipoDeDocumento, TipoAutoridad, AccionesBitacora, Prisma } from "@prisma/client";
import crearDocumentoSolicitado from "./fn/crearDocumentoSolicitado";
import { generatePDF } from "@react-pdf-levelup/core";
import CarnetEvento from "@/pdf/CarnetEvento";

// Suma 7 días a la fecha del evento y la formatea como DD/MM/AA
const formatFechaVencimiento = (fecha: Date): string => {
    const vencimiento = new Date(fecha);
    vencimiento.setDate(vencimiento.getDate() + 7);
    const dd = String(vencimiento.getDate()).padStart(2, "0");
    const mm = String(vencimiento.getMonth() + 1).padStart(2, "0");
    const aa = String(vencimiento.getFullYear()).slice(-2);
    return `${dd}/${mm}/${aa}`;
};

interface GetCarnetEventoArgs {
    token: string;
    usuarioId?: number;
    eventoId: number;
}

const getCarnetEvento = async (_: unknown, args: GetCarnetEventoArgs) => {
    log.dev("getCarnetEvento called with args:", args);

    const { token, eventoId } = args;

    if (!token) return errorResponse({ message: "Token requerido" });
    if (!eventoId) return errorResponse({ message: "Evento requerido" });

    try {
        const usuarioVerificado = await verificarToken(token);
        if (!usuarioVerificado) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        // Si no viene usuarioId se usa el del token
        const usuarioId = args.usuarioId ?? usuarioVerificado.id;

        // ── 1. Determinar si es ponente o participante ────────────────────────

        const ponenteEvento = await prisma.ponenteEvento.findFirst({
            where: { usuarioId, eventoId, isActivo: true },
            include: {
                usuario: { include: { gremio: true } },
                evento: true,
            },
        });

        const esPonente = ponenteEvento !== null;

        // ── 2. Resolver usuario y evento según el caso ────────────────────────

        type UsuarioConGremio = Prisma.UsuarioGetPayload<{ include: { gremio: true } }>;
        type EventoPayload    = Prisma.EventoGetPayload<Record<string, never>>;

        let usuario: UsuarioConGremio;
        let evento: EventoPayload;

        if (esPonente) {
            usuario = ponenteEvento.usuario;
            evento = ponenteEvento.evento;
        } else {
            // Verificar que el usuario esté inscrito al evento
            const suscripcionEvento = await prisma.suscripcionEvento.findFirst({
                where: { usuarioId, eventoId },
                include: {
                    usuario: { include: { gremio: true } },
                    evento: true,
                },
            });

            if (!suscripcionEvento) {
                return errorResponse({
                    message: "El usuario no está inscrito en este evento",
                });
            }

            usuario = suscripcionEvento.usuario;
            evento = suscripcionEvento.evento;
        }

        if (!usuario) return errorResponse({ message: "Usuario no encontrado" });
        if (!evento) return errorResponse({ message: "Evento no encontrado" });

        // ── 3. Obtener autoridad (presidente vigente más reciente) ─────────────

        const autoridad = await prisma.autoridad.findFirst({
            where: { tipoAutoridad: TipoAutoridad.PRESIDENTE, vigente: true },
            orderBy: { id: "desc" },
            include: { usuario: true },
        });

        if (!autoridad) {
            return errorResponse({ message: "No se encontró la autoridad" });
        }

        // ── 4. Crear documento solicitado ─────────────────────────────────────

        const tipoDocumento = esPonente
            ? TipoDeDocumento.CARNET_PONENTE
            : TipoDeDocumento.CARNET;

        const documentoSolicitado = await crearDocumentoSolicitado({
            usuarioId: usuario.id,
            autoridadId: autoridad.id,
            tipo: tipoDocumento,
        });

        // ── 5. Armar nivelAcademico legible ───────────────────────────────────

        const nivelAcademicoMap: Record<string, string> = {
            LICENCIADO: "Lic. en Optometría",
            TSU: "T.S.U. en Optometría",
            NO_ASIGNADO: "",
        };

        const nivelAcademico =
            nivelAcademicoMap[usuario.gremio?.nivelAcademico ?? "NO_ASIGNADO"] ?? "";

        // ── 6. Construir data del PDF ──────────────────────────────────────────

        const CORS_URL = process.env.CORS_URL || "";

        const data = {
            imgAvatar:
                usuario.avatar ||
                "https://genarogg.github.io/media/genarogg/avatar-placehorder.jpg",
            nombreCompleto: `${usuario.primerNombre} ${usuario.segundoNombre ?? ""}`.trim(),
            nivelAcademico,
            tipoParticipacion: esPonente ? "PONENTE" : "PARTICIPANTE",
            rol: usuario.rol,
            cedula: usuario.cedula,
            fechaVencimiento: formatFechaVencimiento(evento.fecha),
            urlQR: `${CORS_URL}/estatus/${documentoSolicitado.id}`,
            autoridad: {
                nombreCompletos: `${autoridad.usuario.primerNombre} ${autoridad.usuario.segundoNombre ?? ""}`.trim(),
                apellidosCompletos: `${autoridad.usuario.primerApellido} ${autoridad.usuario.segundoApellido ?? ""}`.trim(),
                firma: autoridad.firma,
            },
            nombreDelEvento: evento.nombre,
        };

        // ── 7. Generar PDF ────────────────────────────────────────────────────

        const documento = await generatePDF({ template: CarnetEvento, data });

        // ── 8. Registrar en bitácora ──────────────────────────────────────────

        const accionBitacora = esPonente
            ? AccionesBitacora.GENERACION_CARNET_PONENTE
            : AccionesBitacora.GENERACION_CARNET;

        await crearBitacora({
            usuarioId: usuarioVerificado.id,
            type: accionBitacora,
        });

        return successResponse({
            message: "Carnet de evento generado correctamente",
            data: documento,
        });
    } catch (error) {
        console.error("Error al generar carnet de evento:", error);
        return errorResponse({ message: "Error al generar el carnet de evento" });
    }
};

export default getCarnetEvento;