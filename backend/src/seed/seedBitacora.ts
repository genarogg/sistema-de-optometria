import { prisma } from "@fn";
import { AccionesBitacora } from "@prisma/client";

const seedBitacora = async () => {
    const usuarios = await prisma.usuario.findMany();

    if (usuarios.length === 0) {
        console.log("⚠️ No hay usuarios para crear registros de bitácora");
        return;
    }

    const bitacorasData = [
        { type: AccionesBitacora.LOGIN, mensaje: "Inicio de sesión exitoso" },
        { type: AccionesBitacora.VIEW, mensaje: "Visualización de perfil" },
        { type: AccionesBitacora.GET_USUARIOS, mensaje: "Obtención de lista de usuarios" },
        { type: AccionesBitacora.CREATE_ADMIN, mensaje: "Creación de nuevo administrador" },
        { type: AccionesBitacora.UPDATE_USER, mensaje: "Actualización de datos de usuario" },
     
        { type: AccionesBitacora.CREAR_SUSCRIPCION, mensaje: "Creación de suscripción" },
        { type: AccionesBitacora.VALIDAR_SUSCRIPCION, mensaje: "Validación de suscripción" },
        { type: AccionesBitacora.RECHAZAR_SUSCRIPCION, mensaje: "Rechazo de suscripción" },
        { type: AccionesBitacora.GENERACION_CARNET, mensaje: "Generación de carnet" },
    ];

    let totalCreados = 0;

    for (const usuario of usuarios) {
        for (const bitacora of bitacorasData) {
            const existingBitacora = await prisma.bitacora.findFirst({
                where: {
                    usuarioId: usuario.id,
                    type: bitacora.type,
                    mensaje: bitacora.mensaje,
                },
            });

            if (!existingBitacora) {
                await prisma.bitacora.create({
                    data: {
                        ...bitacora,
                        usuarioId: usuario.id,
                    },
                });
                totalCreados++;
            }
        }
        console.log(`✅ Registros de bitácora creados para ${usuario.email}`);
    }

    console.log(`🎉 Total de registros de bitácora creados: ${totalCreados}`);
};

export default seedBitacora;
