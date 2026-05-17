import { prisma, verificarToken, successResponse, errorResponse, log } from "@fn";
import { TipoDeDocumento, TipoAutoridad } from "@prisma/client"
import crearDocumentoSolicitado from "./crearDocumentoSolicitado";
import { generatePDF } from "@react-pdf-levelup/core"
import Carnet from "@/pdf/Carnet"


const formatFechaCorto = (fecha: Date) => {
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear().toString().slice(-2);
    return `${dia}/${mes}/${anio}`;
};

interface GetDocumentoArgs {
    token: string;
    tipoDeDocumento: TipoDeDocumento;
    eventoid?: number;
}

const getDocumento = async (_: unknown, args: GetDocumentoArgs) => {
    log.dev("getDocumento called with args:", args);

    const { CORS_URL } = process.env

    const { token, tipoDeDocumento, eventoid } = args;


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

        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioVerificado.id },
            include: {
                gremio: true,
                autoridad: {
                    where: { vigente: true },
                    orderBy: { id: 'desc' },
                    take: 1,
                }
            },
        });

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

        if (tipoDeDocumento === TipoDeDocumento.CARNET) {

            if (usuario.avatar === null) {
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
                cargo: usuario.autoridad.length > 0 ? usuario.autoridad[0].tipoAutoridad : null,
                cedula: usuario.cedula,


                numeroGremio: gremio.numeroGremio || "00000",
                fechaVencimiento: formatFechaCorto(new Date()),
                urlQR: CORS_URL + "/documento/" + documentoSolicitado.id,
                autoridad: {
                    nombreCompletos: autoridad?.usuario.primerNombre + " " + (autoridad?.usuario.segundoNombre),
                    apellidosCompletos: autoridad?.usuario.primerApellido + " " + (autoridad?.usuario.segundoApellido),
                    firma: autoridad?.firma
                }
            }

            console.log(data)

            documento = await generatePDF({ template: Carnet, data })




        }



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
