import { encriptarContrasena, prisma } from "@fn";
import { Rol } from "@prisma/client";

const seedUsers = async () => {
    const admins = [
        {
            primerNombre: "genaro",
            segundoNombre: "octavio",
            primerApellido: "gonzalez",
            segundoApellido: "gonzalez",
            email: "genarrogg@gmail.com",
            password: "#2Programadores",
            telefono: "04127554970",
            cedula: "25074591",
            numeroGremino: 153,
            rol: Rol.ADMIN,
        },
        {
            primerNombre: "Administrador",
            segundoNombre: "",
            primerApellido: "1",
            segundoApellido: "",
            email: "admin1@admin.com",
            password: "admin",
            telefono: "0990000001",
            cedula: "1000000001",
            numeroGremino: 154,
            rol: Rol.ADMIN,
        },
        {
            primerNombre: "Administrador",
            segundoNombre: "",
            primerApellido: "2",
            segundoApellido: "",
            email: "admin2@admin.com",
            password: "admin",
            telefono: "0990000002",
            cedula: "1000000002",
            numeroGremino: 155,
            rol: Rol.ADMIN,
        },
        {
            primerNombre: "Administrador",
            segundoNombre: "",
            primerApellido: "3",
            segundoApellido: "",
            email: "admin3@admin.com",
            password: "admin",
            telefono: "0990000003",
            cedula: "1000000003",
            numeroGremino: 156,
            rol: Rol.ADMIN,
        },
    ];

    const assistants = [
        {
            primerNombre: "Asistente",
            segundoNombre: "",
            primerApellido: "1",
            segundoApellido: "",
            email: "asistente1@gmail.com",
            password: "demo",
            telefono: "0990000011",
            cedula: "1000000011",
            numeroGremino: 201,
            rol: Rol.ASISTENTE,
        },
        {
            primerNombre: "Asistente",
            segundoNombre: "",
            primerApellido: "2",
            segundoApellido: "",
            email: "asistente2@gmail.com",
            password: "demo",
            telefono: "0990000012",
            cedula: "1000000012",
            numeroGremino: 202,
            rol: Rol.ASISTENTE,
        },
        {
            primerNombre: "Asistente",
            segundoNombre: "",
            primerApellido: "3",
            segundoApellido: "",
            email: "asistente3@gmail.com",
            password: "demo",
            telefono: "0990000013",
            cedula: "1000000013",
            numeroGremino: 203,
            rol: Rol.ASISTENTE,
        },
        {
            primerNombre: "Asistente",
            segundoNombre: "",
            primerApellido: "4",
            segundoApellido: "",
            email: "asistente4@gmail.com",
            password: "demo",
            telefono: "0990000014",
            cedula: "1000000014",
            numeroGremino: 204,
            rol: Rol.ASISTENTE,
        },
    ];

    const clientes = Array.from({ length: 30 }, (_, index) => ({
        primerNombre: "Cliente",
        segundoNombre: "",
        primerApellido: `${index + 1}`,
        segundoApellido: "",
        email: `cliente${index + 1}@gmail.com`,
        password: "demo",
        telefono: `0990000${100 + index}`,
        cedula: `1000000${100 + index}`,
        numeroGremino: 301 + index,
        rol: Rol.CLIENTE,
    }));

    const users = [...admins, ...assistants, ...clientes];

    for (const user of users) {
        const { email, password, ...userData } = user;
        const existingUser = await prisma.usuario.findUnique({
            where: { email },
        });

        if (!existingUser) {
            const hashedPassword = await encriptarContrasena({ password });
            await prisma.usuario.create({
                data: {
                    ...userData,
                    email,
                    password: hashedPassword,
                },
            });
            console.log(`Usuario ${email} creado`);
        } else {
            console.log(`Usuario ${email} ya existe`);
        }
    }
};

export default seedUsers;