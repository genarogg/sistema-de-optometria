import { Rol, AccionesBitacora, NivelAcademico, TipoAutoridad } from '@prisma/client';
import {
    encriptarContrasena,
    verificarToken,
    prisma,
    successResponse,
    errorResponse,
    warningResponse,
    crearBitacora,
    log,
    uploadCloudinary
} from '@fn';

interface UpdateUsuarioAdminArgs {
    usuarioId: number;
    primerNombre?: string;
    segundoNombre?: string;
    primerApellido?: string;
    segundoApellido?: string;
    telefono?: string;
    cedula?: string;
    email?: string;
    password?: string;
    rol?: Rol;
    token: string;
    // gremio
    numeroGremio?: number;
    nivelAcademico?: NivelAcademico;
    // autoridad
    firma?: string;
    tipoAutoridad?: TipoAutoridad;
    vigente?: boolean;
}

const updateUsuarioAdmin = async (_: any, {
    usuarioId,
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido,
    telefono,
    cedula,
    email,
    password,
    rol,
    token,
    // gremio
    numeroGremio,
    nivelAcademico,
    // autoridad
    firma,
    tipoAutoridad,
    vigente,
}: UpdateUsuarioAdminArgs) => {
    try {

        log.dev("updateUsuarioAdmin called with args:", {
            usuarioId, primerNombre, segundoNombre, primerApellido, segundoApellido,
            telefono, cedula, email, password, rol,
            numeroGremio, nivelAcademico,
            firma, tipoAutoridad, vigente,
        });

        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: 'Token inválido o expirado' });
        }

        const { rol: rolUsuario, id: userId } = usuario;
        const { SUPER_USUARIO, ADMINISTRADOR } = Rol;

        if (rolUsuario !== ADMINISTRADOR && rolUsuario !== SUPER_USUARIO) {
            return errorResponse({ message: 'Usuario no autorizado' });
        }

        const usuarioExistente = await prisma.usuario.findUnique({
            where: { id: Number(usuarioId) }
        });

        if (!usuarioExistente) {
            return warningResponse({ message: 'Usuario no encontrado' });
        }

        if (rolUsuario === ADMINISTRADOR && usuarioExistente.rol !== SUPER_USUARIO) {
            return errorResponse({ message: 'Usuario no autorizado para actualizar este rol' });
        }

        // Track what was updated
        const cambios: string[] = [];

        // ── Usuario ───────────────────────────────────────────────────────────
        const usuarioActualizado = await prisma.usuario.update({
            where: { id: Number(usuarioId) },
            data: {
                primerNombre,
                segundoNombre,
                primerApellido,
                segundoApellido,
                telefono,
                cedula,
                email,
                password: password ? await encriptarContrasena({ password }) : undefined,
                rol,
            }
        });

        // Check if any usuario fields were updated
        if (primerNombre !== undefined || segundoNombre !== undefined || 
            primerApellido !== undefined || segundoApellido !== undefined ||
            telefono !== undefined || cedula !== undefined || email !== undefined ||
            password !== undefined || rol !== undefined) {
            cambios.push('datos del usuario');
        }

        // ── Gremio (upsert si viene al menos un campo) ────────────────────────
        if (numeroGremio !== undefined || nivelAcademico !== undefined) {
            await prisma.gremio.upsert({
                where: { usuarioId: Number(usuarioId) },
                update: {
                    numeroGremio,
                    nivelAcademico,
                },
                create: {
                    usuarioId: Number(usuarioId),
                    numeroGremio: numeroGremio!,
                    nivelAcademico,
                },
            });
            cambios.push('gremio');
        }

        // ── Autoridad (upsert si viene al menos un campo) ─────────────────────
        if (firma !== undefined || tipoAutoridad !== undefined || vigente !== undefined) {
            const uploadResult = firma ? await uploadCloudinary(firma, "autoridad") : null;

            if (!uploadResult) {
                return errorResponse({ message: "Error al cargar la firma" });
            }
            
            await prisma.autoridad.upsert({
                where: { usuarioId: Number(usuarioId) },
                update: {
                    firma: uploadResult.url,
                    tipoAutoridad,
                    vigente,
                },
                create: {
                    usuarioId: Number(usuarioId),
                    firma: uploadResult.url,
                    tipoAutoridad: tipoAutoridad!,
                    vigente,
                },
            });
            cambios.push('autoridad');
        }

        // Build bitacora message
        let mensajeBitacora = '';
        if (cambios.length === 0) {
            mensajeBitacora = `Se actualizaron los datos del usuario ${usuarioActualizado.email}`;
        } else if (cambios.length === 1) {
            mensajeBitacora = `Se actualizó ${cambios[0]} del usuario ${usuarioActualizado.email}`;
        } else {
            const ultimo = cambios.pop();
            mensajeBitacora = `Se actualizaron ${cambios.join(', ')} y ${ultimo} del usuario ${usuarioActualizado.email}`;
        }

        crearBitacora({
            usuarioId: userId,
            type: AccionesBitacora.UPDATE_USER,
            mensaje: mensajeBitacora
        });

        return successResponse({
            message: 'Usuario actualizado exitosamente',
            data: usuarioActualizado
        });

    } catch (error: any) {
        return errorResponse({ message: error.message });
    }
};

export default updateUsuarioAdmin;