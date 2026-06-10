import { prisma } from "@fn";
import { Rol, EstatusPagoEvento } from "@prisma/client";

const seedSuscripcionEvento = async () => {
    const usuariosElegibles = await prisma.usuario.findMany({
        where: {
            rol: {
                in: [Rol.AGREMIADO_SOLVENTE, Rol.ESTUDIANTE, Rol.PROFESOR]
            }
        },
    });

    const eventos = await prisma.evento.findMany();

    if (usuariosElegibles.length === 0 || eventos.length === 0) {
        console.log("⚠️ No se encontraron usuarios o eventos para crear suscripcion_evento");
        return;
    }

    const numRecordsToCreate = 100; // Ensure at least 100 records
    let createdCount = 0;

    for (let i = 0; i < numRecordsToCreate; i++) {
        const randomUser = usuariosElegibles[Math.floor(Math.random() * usuariosElegibles.length)];
        const randomEvento = eventos[Math.floor(Math.random() * eventos.length)];

        // Check if a similar subscription already exists to avoid duplicates
        const existing = await prisma.suscripcionEvento.findFirst({
            where: {
                usuarioId: randomUser.id,
                eventoId: randomEvento.id,
            },
        });

        if (!existing) {
            let descuentoPorcentual = 0;
            if (randomUser.rol === Rol.ESTUDIANTE) {
                descuentoPorcentual = randomEvento.descuentoEstudiante;
            } else if (randomUser.rol === Rol.PROFESOR) {
                descuentoPorcentual = randomEvento.descuentoProfesor;
            }

            const precioFinal = randomEvento.costo * (1 - descuentoPorcentual / 100);

            await prisma.suscripcionEvento.create({
                data: {
                    usuarioId: randomUser.id,
                    eventoId: randomEvento.id,
                    precioAlSuscripcion: Math.round(precioFinal),
                    estatus: EstatusPagoEvento.PENDIENTE, // or a random status
                    comprobante: `COMPROBANTE-${randomUser.id}-${randomEvento.id}-${i}`,
                    comprobanteImg: `https://picsum.photos/800/600?random=${i}`,
                },
            });
            createdCount++;
            // console.log(`✅ Suscripcion_Evento creada: ${randomUser.email} en "${randomEvento.nombre}"`);
        }
    }
    console.log(`🎉 Total de suscripciones a eventos creadas: ${createdCount}`);
};

export default seedSuscripcionEvento;
