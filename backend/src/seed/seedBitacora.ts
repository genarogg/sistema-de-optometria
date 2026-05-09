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
    ];

    for (const usuario of usuarios.slice(0, 3)) {
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
            }
        }
        console.log(`✅ Registros de bitácora creados para ${usuario.email}`);
    }
};

export default seedBitacora;
