import { prisma } from "@fn";
import { Rol, EstatusPagoEvento } from "@prisma/client";

const seedSuscripcionEvento = async () => {
    const usuarios = await prisma.usuario.findMany({
        where: { 
            rol: { 
                in: [Rol.AGREMIADO_SOLVENTE, Rol.ESTUDIANTE, Rol.PROFESOR] 
            } 
        },
    });

    const eventos = await prisma.evento.findMany();

    if (usuarios.length === 0 || eventos.length === 0) {
        console.log("⚠️ No se encontraron usuarios o eventos para crear suscripcion_evento");
        return;
    }

    for (const usuario of usuarios) {
        for (const evento of eventos) {
            const existing = await prisma.suscripcionEvento.findFirst({
                where: {
                    usuarioId: usuario.id,
                    eventoId: evento.id,
                },
            });

            if (!existing) {
                let descuento = 0;
                
                if (usuario.rol === Rol.ESTUDIANTE) {
                    descuento = evento.descuentoEstudiante;
                } else if (usuario.rol === Rol.PROFESOR) {
                    descuento = evento.descuentoProfesor;
                }
                
                const precioFinal = evento.costo;
                await prisma.suscripcionEvento.create({
                    data: {
                        usuarioId: usuario.id,
                        eventoId: evento.id,
                        precioAlSuscripcion: Math.round(precioFinal),
                        estatus: EstatusPagoEvento.PENDIENTE,
                        comprobante: `COM-${usuario.id}-${evento.id}`,
                        comprobanteImg: "https://picsum.photos/800/600",
                    },
                });
                console.log(`✅ Suscripcion_Evento creada: ${usuario.email} (${usuario.rol}) en "${evento.nombre}"`);
            } else {
                console.log(`ℹ️ Suscripcion_Evento ya existe para ${usuario.email} en "${evento.nombre}"`);
            }
        }
    }
};

export default seedSuscripcionEvento;
