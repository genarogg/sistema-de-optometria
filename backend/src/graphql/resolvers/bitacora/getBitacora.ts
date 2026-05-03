import { Rol, AccionesBitacora } from "@prisma/client";
import { verificarToken, prisma, successResponse, errorResponse, log } from "@fn";

interface GetBitacoraArgs {
    token: string;
    page?: number;
    searchTerm?: string;
    rol?: Rol | "ALL_ADMIN";
    accion?: AccionesBitacora | "ALL_ACCIONES";
}

const getBitacora = async (
    _: any,
    {
        token,
        page = 1,
        rol = "ALL_ADMIN",
        searchTerm,
        accion: accion = "ALL_ACCIONES",
    }: GetBitacoraArgs
) => {
    try {
        log.dev("Iniciando getBitacora con args:", {
            page,
            rol,
            searchTerm,
            accion,
        });
        
        const usuario = await verificarToken(token);

        if (!usuario) {
            return errorResponse({ message: "Token inválido o expirado" });
        }

        if (usuario.rol !== Rol.ADMIN) {
            return errorResponse({ message: "Usuario no autorizado" });
        }

        const limit = 50;
        const offset = (page - 1) * limit;

        let whereClause: any = {};

        /* =========================
           🔹 FILTRO POR ROL
        ========================== */

        const rolesAdmin = [
            Rol.ADMIN,
            Rol.ASISTENTE,
            Rol.CLIENTE,
        ];

        let usuarioFilter: any = {};

        if (rol === "ALL_ADMIN") {
            usuarioFilter.rol = { in: rolesAdmin };
        } else {
            usuarioFilter.rol = rol;
        }

        /* =========================
           🔹 FILTRO POR SEARCH
        ========================== */

        if (searchTerm) {
            usuarioFilter.OR = [
                {
                    cedula: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ];
        }

        whereClause.usuario = usuarioFilter;

        /* =========================
           🔹 FILTRO POR ACCIÓN
        ========================== */

        if (accion !== "ALL_ACCIONES") {
            whereClause.type = accion;
        }

        /* =========================
           🔹 QUERY
        ========================== */

        const bitacoras = await prisma.bitacora.findMany({
            where: whereClause,
            include: { usuario: true },
            skip: offset,
            take: limit,
            orderBy: { fecha: "desc" },
        });

        const totalBitacoras = await prisma.bitacora.count({
            where: whereClause,
        });
    
        const totalPages = Math.ceil(totalBitacoras / limit);

        console.log(totalPages)

        return successResponse({
            message: "Bitácora obtenida exitosamente",
            data: bitacoras,
            meta: {
                total: totalPages,
                page,
                limit,
            },
        });
    } catch (error) {
        console.error("Error al obtener la bitácora:", error);
        return errorResponse({ message: "No se pudo obtener la bitácora" });
    }
};

export default getBitacora;