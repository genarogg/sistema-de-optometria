import { prisma } from "@fn";
import { Rol } from "@prisma/client";

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
            const existing = await prisma.suscripcion_Evento.findFirst({
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
                
                const precioFinal = evento.consto - (evento.consto * descuento / 100);
                await prisma.suscripcion_Evento.create({
                    data: {
                        usuarioId: usuario.id,
                        eventoId: evento.id,
                        precioAlSuscripcion: Math.round(precioFinal),
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
