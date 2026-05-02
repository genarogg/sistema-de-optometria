import { encriptarContrasena, prisma } from "@fn";
import { Rol } from "@prisma/client";

const seedUsers = async () => {
    const admins = [
        {
            primerNombre: "Administrador",
            primerApellido: "1",
            email: "admin1@admin.com",
            password: "admin",
            telefono: "0990000001",
            cedula: "1000000001",
            rol: Rol.ADMIN,
        },
        {
            primerNombre: "Administrador",
            primerApellido: "2",
            email: "admin2@admin.com",
            password: "admin",
            telefono: "0990000002",
            cedula: "1000000002",
            rol: Rol.ADMIN,
        },
        {
            primerNombre: "Administrador",
            primerApellido: "3",
            email: "admin3@admin.com",
            password: "admin",
            telefono: "0990000003",
            cedula: "1000000003",
            rol: Rol.ADMIN,
        },
    ];

    const assistants = [
        {
            primerNombre: "Asistente",
            primerApellido: "1",
            email: "asistente1@gmail.com",
            password: "demo",
            telefono: "0990000011",
            cedula: "1000000011",
            rol: Rol.ASISTENTE,
        },
        {
            primerNombre: "Asistente",
            primerApellido: "2",
            email: "asistente2@gmail.com",
            password: "demo",
            telefono: "0990000012",
            cedula: "1000000012",
            rol: Rol.ASISTENTE,
        },
        {
            primerNombre: "Asistente",
            primerApellido: "3",
            email: "asistente3@gmail.com",
            password: "demo",
            telefono: "0990000013",
            cedula: "1000000013",
            rol: Rol.ASISTENTE,
        },
        {
            primerNombre: "Asistente",
            primerApellido: "4",
            email: "asistente4@gmail.com",
            password: "demo",
            telefono: "0990000014",
            cedula: "1000000014",
            rol: Rol.ASISTENTE,
        },
    ];

    const clientes = Array.from({ length: 30 }, (_, index) => ({
        primerNombre: "Cliente",
        primerApellido: `${index + 1}`,
        email: `cliente${index + 1}@gmail.com`,
        password: "demo",
        telefono: `0990000${100 + index}`,
        cedula: `1000000${100 + index}`,
        rol: Rol.CLIENTE,
    }));

    const users = [...admins, ...assistants, ...clientes];

    for (const user of users) {
        const { email, password, rol, primerNombre, primerApellido, telefono, cedula } = user;
        const existingUser = await prisma.usuario.findUnique({
            where: { email },
        });

        if (!existingUser) {
            const hashedPassword = await encriptarContrasena({ password });
            await prisma.usuario.create({
                data: {
                    primerNombre,
                    primerApellido,
                    email,
                    password: hashedPassword,
                    telefono,
                    cedula,
                    rol,
                },
            });
            console.log(`Usuario ${email} creado`);
        } else {
            console.log(`Usuario ${email} ya existe`);
        }
    }
};

export default seedUsers;