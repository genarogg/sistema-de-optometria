import { Rol, AccionesBitacora } from '@prisma/client';
import {
    encriptarContrasena,
    verificarToken,
    prisma,
    successResponse,
    errorResponse,
    warningResponse,
    crearBitacora,
    log
} from '@fn';

interface UpdateUsuarioAdminArgs {
    usuarioId: number;
    primerNombre?: string;
    segundoNombre?: string;
    primerApellido?: string;
    segundoApellido?: string;
    numeroGremino?: number;
    telefono?: string;
    cedula?: string;
    email?: string;
    password?: string;
    rol?: Rol;
    token: string;
}

const updateUsuarioAdmin = async (_: any, {
    usuarioId,
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido,
    numeroGremino,
    telefono,
    cedula,
    email,
    password,
    rol,
    token
}: UpdateUsuarioAdminArgs) => {
    try {

        log.dev("updateUsuarioAdmin called with args:", {
            usuarioId,
            primerNombre,
            segundoNombre,
            primerApellido,
            segundoApellido,
            numeroGremino,
            telefono,
            cedula,
            email,
            password,
            rol
        });

        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: 'Token inválido o expirado' });
        }

        const { rol: rolUsuario, id: userId } = usuario;

        const { SUPER_USUARIO, ADMINISTRADOR, } = Rol;

        if (rolUsuario !== ADMINISTRADOR && rolUsuario !== SUPER_USUARIO) {
            return errorResponse({ message: 'Usuario no autorizado' });
        }

        const usuarioExistente = await prisma.usuario.findUnique({ where: { id: Number(usuarioId) } });

        if (!usuarioExistente) {
            return warningResponse({ message: 'Usuario no encontrado' });
        }

        // ASISTENTE solo puede actualizar usuarios con rol CLIENTE
        if (rolUsuario === ADMINISTRADOR && usuarioExistente.rol !== SUPER_USUARIO) {
            return errorResponse({ message: 'Usuario no autorizado para actualizar este rol' });
        }


        const usuarioActualizado = await prisma.usuario.update({
            where: { id: Number(usuarioId) },
            data: {
                primerNombre,
                segundoNombre,
                primerApellido,
                segundoApellido,
                numeroGremino,
                telefono,
                cedula,
                email,
                password: password ? await encriptarContrasena({ password }) : undefined,
                rol
            }
        });

        crearBitacora({
            usuarioId: userId,
            type: AccionesBitacora.UPDATE_USER,
            mensaje: `Se actualizaron los datos del usuario ${usuarioActualizado.email}`
        });

        return successResponse({ message: 'Usuario actualizado exitosamente', data: usuarioActualizado });

    } catch (error: any) {
        return errorResponse({ message: error.message });
    }
};

export default updateUsuarioAdmin;