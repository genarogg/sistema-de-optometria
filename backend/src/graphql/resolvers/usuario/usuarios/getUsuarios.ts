import {
    successResponse,
    errorResponse,
    prisma,
    verificarToken,
    crearBitacora,
    log
} from "@fn";

import { Prisma, Rol, AccionesBitacora } from "@prisma/client";

interface GetUsuariosArgs {
    token: string;
    filtro?: string;
}

const getUsuarios = async (_: unknown, args: GetUsuariosArgs) => {
    log.dev("getUsuarios called with args:", args);
    
    const { token, filtro } = args;

    if (!token) {
        return errorResponse({ message: "Token requerido" });
    }

    try {
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        let whereClause: Prisma.UsuarioWhereInput = {};
        const filtroCleaned = filtro?.trim();

        switch (usuario.rol) {
            case Rol.SUPER_USUARIO:
                if (filtroCleaned) {
                    whereClause.AND = [
                        {
                            OR: [
                                { rol: { in: [Rol.SUPER_USUARIO, Rol.ADMINISTRADOR] } },
                                { 
                                    rol: Rol.AGREMIADO_SOLVENTE, 
                                    gremio: { 
                                        is: null 
                                    } 
                                }
                            ]
                        },
                        {
                            OR: [
                                { email: { contains: filtroCleaned } },
                                { cedula: { contains: filtroCleaned } },
                            ]
                        }
                    ];
                } else {
                    whereClause.OR = [
                        { rol: { in: [Rol.SUPER_USUARIO, Rol.ADMINISTRADOR] } },
                        { 
                            rol: Rol.AGREMIADO_SOLVENTE, 
                            gremio: { 
                                is: null 
                            } 
                        }
                    ];
                }
                break;
            case Rol.ADMINISTRADOR:
                if (filtroCleaned) {
                    whereClause.AND = [
                        {
                            OR: [
                                { rol: Rol.ADMINISTRADOR },
                                { 
                                    rol: Rol.AGREMIADO_SOLVENTE, 
                                    gremio: { 
                                        is: null 
                                    } 
                                }
                            ]
                        },
                        {
                            OR: [
                                { email: { contains: filtroCleaned } },
                                { cedula: { contains: filtroCleaned } },
                            ]
                        }
                    ];
                } else {
                    whereClause.OR = [
                        { rol: Rol.ADMINISTRADOR },
                        { 
                            rol: Rol.AGREMIADO_SOLVENTE, 
                            gremio: { 
                                is: null 
                            } 
                        }
                    ];
                }
                break;
            default:
                return errorResponse({ message: "Rol no válido" });
        }

        const usuarios = await prisma.usuario.findMany({
            where: whereClause,
            include: {
                gremio: true,
                autoridad: true
            },
            orderBy: { createdAt: "desc" },
            omit: { password: true }
        });

        // console.log(usuarios);

        const total = await prisma.usuario.count({ where: whereClause });

        await crearBitacora({
            type: AccionesBitacora.GET_USUARIOS,
            usuarioId: usuario.id,
        });

        return successResponse({
            message: "Usuarios obtenidos correctamente",
            data: usuarios,
            meta: { total },
        });

    } catch (error) {
        console.error(error);
        return errorResponse({ message: "Error al obtener usuarios" });
    }
};

export default getUsuarios;