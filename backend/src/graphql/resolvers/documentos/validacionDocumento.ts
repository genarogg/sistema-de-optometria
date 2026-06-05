import { prisma, successResponse, errorResponse, log } from "@fn";

interface ValidacionDocumentoArgs {
    id: number;
}

const validacionDocumento = async (_: unknown, args: ValidacionDocumentoArgs) => {
    log.dev("validacionDocumento called with args:", args);

    const { id } = args;

    if (!id) {
        return errorResponse({ message: "ID de documento requerido" });
    }

    try {
        const documento = await prisma.documentoSolicitado.findUnique({
            where: { id },
            include: {
                usuario: true,
            },
        });

        if (!documento) {
            return errorResponse({ message: "Documento no encontrado" });
        }

        const responseData = {
            tipo: documento.tipo,
            usuario: documento.usuario,
            id: documento.id,
            createdAt: documento.createdAt,
        };

        return successResponse({
            message: "Documento encontrado exitosamente",
            data: JSON.stringify(responseData),
        });
    } catch (error) {
        console.error("Error al validar documento:", error);
        return errorResponse({ message: "Error al validar el documento" });
    }
};

export default validacionDocumento;