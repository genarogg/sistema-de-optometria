import { encriptarContrasena, prisma } from "@fn";
import { Rol } from "@prisma/client";

const seedAdmin = async () => {
    const superUsuario = {
        primerNombre: "Genaro",
        segundoNombre: "Octavio",
        primerApellido: "González",
        segundoApellido: "González",
        email: "genarrogg@gmail.com",
        password: "xx",
        telefono: "04127554970",
        cedula: "25074591",
        rol: Rol.SUPER_USUARIO,
    };

    const existe = await prisma.usuario.findUnique({
        where: { email: superUsuario.email },
    });

    if (existe) {
        console.log("ℹ️ El super usuario ya existe");
        return;
    }

    const hashedPassword = await encriptarContrasena({ password: superUsuario.password });

    await prisma.usuario.create({
        data: {
            primerNombre: superUsuario.primerNombre,
            segundoNombre: superUsuario.segundoNombre || null,
            primerApellido: superUsuario.primerApellido,
            segundoApellido: superUsuario.segundoApellido || null,
            email: superUsuario.email,
            password: hashedPassword,
            telefono: superUsuario.telefono,
            cedula: superUsuario.cedula,
            rol: superUsuario.rol,
        },
    });

    console.log(`✅ Super usuario ${superUsuario.email} creado`);
};

export default seedAdmin;