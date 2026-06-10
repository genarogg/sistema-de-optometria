import { encriptarContrasena, prisma } from "@fn";
import { Rol } from "@prisma/client";

const seedUsers = async () => {
    const usersData = [
        {
            primerNombre: "Genaro",
            segundoNombre: "Octavio",
            primerApellido: "González",
            segundoApellido: "González",
            email: "genarrogg@gmail.com",
            password: "xx",
            telefono: "04127554970",
            cedula: "25074591",
            rol: Rol.SUPER_USUARIO,
        },
        {
            primerNombre: "Administrador",
            segundoNombre: "",
            primerApellido: "Uno",
            segundoApellido: "",
            email: "admin1@svo.com",
            password: "admin123",
            telefono: "04120000001",
            cedula: "10000001",
            rol: Rol.ADMINISTRADOR,
        },
        {
            primerNombre: "Administrador",
            segundoNombre: "",
            primerApellido: "Dos",
            segundoApellido: "",
            email: "admin2@svo.com",
            password: "admin123",
            telefono: "04120000002",
            cedula: "10000002",
            rol: Rol.ADMINISTRADOR,
        },
        {
            primerNombre: "Ana",
            segundoNombre: "María",
            primerApellido: "Pérez",
            segundoApellido: "Rodríguez",
            email: "ana.perez@optometria.com",
            password: "agremiado123",
            telefono: "04141111111",
            cedula: "20000001",
            rol: Rol.AGREMIADO_INSOLVENTE,
        },
        {
            primerNombre: "Carlos",
            segundoNombre: "José",
            primerApellido: "López",
            segundoApellido: "García",
            email: "carlos.lopez@optometria.com",
            password: "agremiado123",
            telefono: "04141111112",
            cedula: "20000002",
            rol: Rol.AGREMIADO_SOLVENTE,
        },
        {
            primerNombre: "Dra. Laura",
            segundoNombre: "Fernanda",
            primerApellido: "Martínez",
            segundoApellido: "Silva",
            email: "laura.martinez@universidad.com",
            password: "profesor123",
            telefono: "04242222221",
            cedula: "30000001",
            rol: Rol.PROFESOR,
        },
        {
            primerNombre: "Estudiante",
            segundoNombre: "Uno",
            primerApellido: "Rondón",
            segundoApellido: "",
            email: "estudiante1@universidad.com",
            password: "estudiante123",
            telefono: "04243333331",
            cedula: "40000001",
            rol: Rol.ESTUDIANTE,
        },
        {
            primerNombre: "Visitante",
            segundoNombre: "Demo",
            primerApellido: "Test",
            segundoApellido: "",
            email: "visitante@test.com",
            password: "visitante123",
            telefono: "04149999999",
            cedula: "90000001",
            rol: Rol.VISITANTE,
        },
        // Más estudiantes
        {
            primerNombre: "Estudiante",
            segundoNombre: "Dos",
            primerApellido: "Pérez",
            segundoApellido: "",
            email: "estudiante2@universidad.com",
            password: "estudiante123",
            telefono: "04243333332",
            cedula: "40000002",
            rol: Rol.ESTUDIANTE,
        },
        {
            primerNombre: "Estudiante",
            segundoNombre: "Tres",
            primerApellido: "Gómez",
            segundoApellido: "",
            email: "estudiante3@universidad.com",
            password: "estudiante123",
            telefono: "04243333333",
            cedula: "40000003",
            rol: Rol.ESTUDIANTE,
        },
        {
            primerNombre: "Estudiante",
            segundoNombre: "Cuatro",
            primerApellido: "López",
            segundoApellido: "",
            email: "estudiante4@universidad.com",
            password: "estudiante123",
            telefono: "04243333334",
            cedula: "40000004",
            rol: Rol.ESTUDIANTE,
        },
        {
            primerNombre: "Estudiante",
            segundoNombre: "Cinco",
            primerApellido: "Martínez",
            segundoApellido: "",
            email: "estudiante5@universidad.com",
            password: "estudiante123",
            telefono: "04243333335",
            cedula: "40000005",
            rol: Rol.ESTUDIANTE,
        },
        // Más profesores
        {
            primerNombre: "Profesor",
            segundoNombre: "Dos",
            primerApellido: "Rodríguez",
            segundoApellido: "",
            email: "profesor2@universidad.com",
            password: "profesor123",
            telefono: "04242222222",
            cedula: "30000002",
            rol: Rol.PROFESOR,
        },
        {
            primerNombre: "Profesor",
            segundoNombre: "Tres",
            primerApellido: "Silva",
            segundoApellido: "",
            email: "profesor3@universidad.com",
            password: "profesor123",
            telefono: "04242222223",
            cedula: "30000003",
            rol: Rol.PROFESOR,
        },
        // Más agremiados solventes
        {
            primerNombre: "Agremiado",
            segundoNombre: "Solvente",
            primerApellido: "Dos",
            segundoApellido: "",
            email: "agremiado2@optometria.com",
            password: "agremiado123",
            telefono: "04141111113",
            cedula: "20000003",
            rol: Rol.AGREMIADO_SOLVENTE,
        },
        {
            primerNombre: "Agremiado",
            segundoNombre: "Solvente",
            primerApellido: "Tres",
            segundoApellido: "",
            email: "agremiado3@optometria.com",
            password: "agremiado123",
            telefono: "04141111114",
            cedula: "20000004",
            rol: Rol.AGREMIADO_SOLVENTE,
        },
        {
            primerNombre: "Agremiado",
            segundoNombre: "Solvente",
            primerApellido: "Cuatro",
            segundoApellido: "",
            email: "agremiado4@optometria.com",
            password: "agremiado123",
            telefono: "04141111115",
            cedula: "20000005",
            rol: Rol.AGREMIADO_SOLVENTE,
        },
        {
            primerNombre: "Agremiado",
            segundoNombre: "Solvente",
            primerApellido: "Cinco",
            segundoApellido: "",
            email: "agremiado5@optometria.com",
            password: "agremiado123",
            telefono: "04141111116",
            cedula: "20000006",
            rol: Rol.AGREMIADO_SOLVENTE,
        },
        // Más agremiados insolventes
        {
            primerNombre: "Agremiado",
            segundoNombre: "Insolvente",
            primerApellido: "Dos",
            segundoApellido: "",
            email: "agremiado_ins2@optometria.com",
            password: "agremiado123",
            telefono: "04141111117",
            cedula: "20000007",
            rol: Rol.AGREMIADO_INSOLVENTE,
        },
    ];

    // Generar 80 usuarios adicionales para asegurar al menos 100 registros
    const roles = [Rol.AGREMIADO_INSOLVENTE, Rol.AGREMIADO_SOLVENTE, Rol.ESTUDIANTE, Rol.PROFESOR, Rol.VISITANTE];
    for (let i = 0; i < 80; i++) {
        const index = i + 8; // Offset para cédulas y teléfonos
        const rol = roles[i % roles.length];
        usersData.push({
            primerNombre: `UsuarioGenerado${i}`,
            segundoNombre: "",
            primerApellido: `Apellido${i}`,
            segundoApellido: "",
            email: `generado${i}@example.com`,
            password: "password123",
            telefono: `0412555${String(1000 + i).padStart(4, '0')}`,
            cedula: `5000000${String(i).padStart(2, '0')}`,
            rol: rol,
        });
    }

    const existingEmails = await prisma.usuario.findMany({
        where: {
            email: { in: usersData.map(u => u.email) }
        },
        select: { email: true }
    });

    const existingEmailsSet = new Set(existingEmails.map(u => u.email));
    const usersToCreate = usersData.filter(u => !existingEmailsSet.has(u.email));

    for (const user of usersToCreate) {
        const hashedPassword = await encriptarContrasena({ password: user.password });
        await prisma.usuario.create({
            data: {
                primerNombre: user.primerNombre,
                segundoNombre: user.segundoNombre || null,
                primerApellido: user.primerApellido,
                segundoApellido: user.segundoApellido || null,
                email: user.email,
                password: hashedPassword,
                telefono: user.telefono,
                cedula: user.cedula,
                rol: user.rol,
            },
        });
        console.log(`✅ Usuario ${user.email} creado`);
    }

    if (usersToCreate.length === 0) {
        console.log("ℹ️ Todos los usuarios ya existen");
    }
};

export default seedUsers;
