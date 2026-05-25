import { 
  successResponse, 
  errorResponse, 
  prisma, 
  verificarToken, 
  crearBitacora, 
  log
} from "@fn";
import { Prisma, AccionesBitacora, Rol, EstatusPagoEvento } from "@prisma/client";

interface GetSuscripcionesEventoArgs {
  token: string;
  page?: number;
  pageSize?: number;
  filtro?: string;
  eventoId?: number;
  estatus?: EstatusPagoEvento;
}

const getSuscripcionesEvento = async (_: unknown, args: GetSuscripcionesEventoArgs) => {
  log.dev("getSuscripcionesEvento called with args:", args);
  
  const { token, page = 1, pageSize = 20, filtro, eventoId, estatus } = args;

  if (!token) {
    return errorResponse({ message: "Token requerido" });
  }

  try {
    const usuario = await verificarToken(token);

    if (!usuario) {
      return errorResponse({ message: "Token inválido o expirado" });
    }

    if (usuario.rol !== Rol.SUPER_USUARIO && usuario.rol !== Rol.ADMINISTRADOR) {
      return errorResponse({ message: "No tiene permisos para consultar suscripciones de eventos" });
    }

    const whereClause: Prisma.SuscripcionEventoWhereInput = {};

    if (filtro) {
      const filtroCleaned = filtro.trim();
      whereClause.OR = [
        {
          usuario: {
            OR: [
              { primerNombre: { contains: filtroCleaned } },
              { primerApellido: { contains: filtroCleaned } },
              { cedula: { contains: filtroCleaned } },
            ]
          }
        },
        {
          evento: {
            nombre: { contains: filtroCleaned }
          }
        }
      ];
    }

    if (eventoId) {
      whereClause.eventoId = eventoId;
    }

    if (estatus) {
      whereClause.estatus = estatus;
    }

    const p = Math.max(1, page);
    const ps = Math.max(1, pageSize);
    const skip = (p - 1) * ps;
    const take = ps;

    const suscripciones = await prisma.suscripcionEvento.findMany({
      where: whereClause,
      include: {
        evento: true,
        usuario: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });

    const total = await prisma.suscripcionEvento.count({ where: whereClause });
    const meta = {
      total,
      page: p,
      limit: ps
    };

    await crearBitacora({
      type: AccionesBitacora.VIEW,
      usuarioId: usuario.id,
      mensaje: "Se consultaron las suscripciones de eventos",
    });

    return successResponse({
      message: "Suscripciones de eventos obtenidas correctamente",
      data: suscripciones,
      meta,
    });

  } catch (error) {
    console.error(error);
    return errorResponse({ message: "Error al obtener suscripciones de eventos" });
  }
};

export default getSuscripcionesEvento;
