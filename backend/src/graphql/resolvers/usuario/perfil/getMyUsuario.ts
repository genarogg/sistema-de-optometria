import {
    successResponse,
    errorResponse,
    verificarToken,
    log,
    prisma
} from "@fn";


interface ArgsObtenerUsuarioToken {
    token: string;
}

const getMyUsuario = async (_: unknown, args: ArgsObtenerUsuarioToken) => {
    log.dev("getMyUsuario called with args:", args);

    const { token } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        // Verificar y decodificar token
        const usuarioAuth = await verificarToken(token);

        if (!usuarioAuth) {
            return errorResponse({ message: "Usuario no encontrado" });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioAuth.id },
            include: {
               gremio: true,
               autoridad: true
            }
        });

        return successResponse({
            message: "Usuario obtenido correctamente",
            data: usuario
        });

    } catch (error) {
        console.error("Error al obtener usuario desde token:", error);
        return errorResponse({ message: "Error al obtener usuario" });
    }
};

export default getMyUsuario;
