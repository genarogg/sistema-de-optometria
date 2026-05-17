import { prisma } from "@fn";
import { TipoDeDocumento } from "@prisma/client";

interface CrearDocumentoSolicitadoArgs {
    usuarioId: number;
    autoridadId: number;
    tipo: TipoDeDocumento;
}

const crearDocumentoSolicitado = async ({
    usuarioId,
    autoridadId,
    tipo,
}: CrearDocumentoSolicitadoArgs) => {
    try {
        const documento = await prisma.documentoSolicitado.create({
            data: {
                usuarioId,
                autoridadId,
                tipo,
            },
        });

        return documento;
    } catch (error) {
        console.error("Error al crear DocumentoSolicitado:", error);
        throw new Error("No se pudo crear el documento solicitado");
    }
};

export default crearDocumentoSolicitado;