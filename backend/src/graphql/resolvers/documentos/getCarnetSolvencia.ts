import { prisma, verificarToken, successResponse, errorResponse, log, crearBitacora } from "@fn";
import { TipoDeDocumento, TipoAutoridad, EstatusSuscripcion, AccionesBitacora, TipoSuscripcion } from "@prisma/client"
import crearDocumentoSolicitado from "./fn/crearDocumentoSolicitado";
import { generatePDF } from "@react-pdf-levelup/core"
import Carnet from "@/pdf/Carnet"
import SolvenciaPago from "@/pdf/SolvenciaPago"




import formatFechaCorto from "./fn/formatFechaCorto";
interface GetDocumentoArgs {
    token: string;
    tipoDeDocumento: TipoDeDocumento;
    suscripcionId: number;
}

const getDocumento = async (_: unknown, args: GetDocumentoArgs) => {
    log.dev("getDocumento called with args:", args);

    const { CORS_URL } = process.env

    const { token, tipoDeDocumento, suscripcionId } = args;


    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    if (!tipoDeDocumento) {
        return errorResponse({ message: "Tipo de documento requerido" });
    }

    try {
        const usuarioVerificado = await verificarToken(token);

        if (!usuarioVerificado) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        const suscripcion = await prisma.suscripcion.findUnique({
            where: {
                id: suscripcionId,
                estatus: EstatusSuscripcion.VALIDADO,
                planSuscripcion: {
                    tipo: TipoSuscripcion.AGREMIADO,
                },
            },
            include: {
                usuario: {
                    include: {
                        gremio: true,
                        autoridad: {
                            where: { vigente: true },
                        }
                    }
                }
            }
        });

        if (!suscripcion) {
            return errorResponse({ message: "Suscripción no encontrada" });
        }

        const usuario = suscripcion.usuario;

        if (!usuario) {
            return errorResponse({ message: "Usuario no encontrado" });
        }

        let documento = ""

        // busca la autoridad de tipo presidente mas reciente
        const autoridad = await prisma.autoridad.findFirst({
            where: { tipoAutoridad: TipoAutoridad.PRESIDENTE },
            orderBy: { id: 'desc' },
            include: { usuario: true }
        })

        if (!autoridad) {
            return errorResponse({ message: "No se encontró la autoridad" });
        }

        if (tipoDeDocumento === TipoDeDocumento.CARNET ||
            tipoDeDocumento === TipoDeDocumento.SOLVENCIA_PAGO) {

            if (usuario.avatar === null && tipoDeDocumento === TipoDeDocumento.CARNET) {
                return errorResponse({ message: "No tiene foto de perfil, cargue una primero" });
            }

            const gremio = usuario.gremio;

            if (!gremio) {
                return errorResponse({ message: "No pertenece a ningún gremio, no se puede generar el carnet" });
            }

            if (gremio.numeroGremio === null) {
                return errorResponse({ message: "No tiene asignado el nuemro de gremio, no se puede generar el carnet" });
            }

            const documentoSolicitado = await crearDocumentoSolicitado({
                usuarioId: usuario.id,
                autoridadId: autoridad ? autoridad.id : 0,
                tipo: tipoDeDocumento,
            });

            const data = {
                imgAvatar: usuario.avatar,
                nombreCompleto: usuario.primerNombre + " " + (usuario.segundoNombre || ""),
                apellidosCompletos: usuario.primerApellido + " " + (usuario.segundoApellido || ""),
                nivelAcademico: gremio.nivelAcademico,
                cargo: usuario.autoridad ? usuario.autoridad.tipoAutoridad : null,
                cedula: usuario.cedula,


                numeroGremio: gremio.numeroGremio || "00000",
                fechaVencimiento: formatFechaCorto(new Date()),
                urlQR: CORS_URL + "/estatus/" + documentoSolicitado.id,
                autoridad: {
                    nombreCompletos: autoridad?.usuario.primerNombre + " " + (autoridad?.usuario.segundoNombre),
                    apellidosCompletos: autoridad?.usuario.primerApellido + " " + (autoridad?.usuario.segundoApellido),
                    firma: autoridad?.firma
                }
            }

            if (tipoDeDocumento === TipoDeDocumento.SOLVENCIA_PAGO) {
                documento = await generatePDF({ template: SolvenciaPago, data })
            }

            if (tipoDeDocumento === TipoDeDocumento.CARNET) {
                documento = await generatePDF({ template: Carnet, data })
            }
        }

        crearBitacora({
            usuarioId: usuario.id,
            type: tipoDeDocumento === TipoDeDocumento.CARNET ?
                AccionesBitacora.GENERACION_CARNET : AccionesBitacora.GENERACION_SOLVENCIA_PAGO

        })

        console.log("Documento generado:", documento);

        return successResponse({
            message: `Documento ${tipoDeDocumento} obtenido correctamente`,
            data: documento
        });
    } catch (error) {
        console.error("Error al obtener el documento:", error);
        return errorResponse({ message: "Error al obtener el documento" });
    }
};

export default getDocumento;
