import { Rol } from "@/global/enums";
import type { Usuario } from "../store/usuariosStore";

const USUARIOS_MOCK: Usuario[] = [
  {
    id: "1",
    primerNombre: "Carlos",
    primerApellido: "Ramirez",
    email: "carlos.ramirez@mail.com",
    cedula: "V-12345678",
    telefono: "4121234567",
    rol: Rol.ADMIN,
  },
  {
    id: "2",
    primerNombre: "Maria",
    primerApellido: "Gonzalez",
    email: "maria.gonzalez@mail.com",
    cedula: "V-23456789",
    telefono: "4149876543",
    rol: Rol.CLIENTE,
  },
  {
    id: "3",
    primerNombre: "Luis",
    primerApellido: "Perez",
    email: "luis.perez@mail.com",
    cedula: "V-34567890",
    telefono: "4261112233",
    rol: Rol.ASISTENTE,
  },
  {
    id: "4",
    primerNombre: "Ana",
    primerApellido: "Torres",
    email: "ana.torres@mail.com",
    cedula: "V-45678901",
    telefono: "4162223344",
    rol: Rol.ASISTENTE,
  },
  {
    id: "5",
    primerNombre: "Pedro",
    primerApellido: "Martinez",
    email: "pedro.martinez@mail.com",
    cedula: "V-56789012",
    telefono: "4123334455",
    rol: Rol.CLIENTE,
  },
  {
    id: "6",
    primerNombre: "Sofia",
    primerApellido: "Lopez",
    email: "sofia.lopez@mail.com",
    cedula: "V-67890123",
    telefono: "4144445566",
    rol: Rol.CLIENTE,
  },
];

export default USUARIOS_MOCK;
