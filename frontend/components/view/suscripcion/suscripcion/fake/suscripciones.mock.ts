import { EstatusSuscripcion, Rol } from "@/global/enums";
import type { Suscripcion } from "../store/suscripcionStore";

const SUSCRIPCIONES_MOCK: Suscripcion[] = [
  {
    id: 1,
    comprobante: 12345,
    comprobanteImg: "https://via.placeholder.com/200",
    contodesuscripcion: 100,
    estatus: EstatusSuscripcion.PENDIENTE,
    createdAt: 1778709739786,
    planSuscripcion: {
      tipo: "AGREMIADO",
      costo: 100,
    },
    usuario: {
      cedula: "12345678",
      rol: Rol.AGREMIADO_INSOLVENTE,
      primerNombre: "Juan",
      primerApellido: "García",
      segundoNombre: "Carlos",
      segundoApellido: "López",
      correo: "juan.garcia@example.com",
      telefono: "04121234567",
    },
  },
  {
    id: 2,
    comprobante: 12346,
    comprobanteImg: "https://via.placeholder.com/200",
    contodesuscripcion: 50,
    estatus: EstatusSuscripcion.VALIDADO,
    createdAt: 1778623339786,
    planSuscripcion: {
      tipo: "ESTUDIANTE",
      costo: 50,
    },
    usuario: {
      cedula: "23456789",
      rol: Rol.ESTUDIANTE,
      primerNombre: "María",
      primerApellido: "Rodríguez",
      segundoNombre: "Elena",
      segundoApellido: "Martínez",
      correo: "maria.rodriguez@example.com",
      telefono: "04122345678",
    },
  },
  {
    id: 3,
    comprobante: 12347,
    comprobanteImg: "https://via.placeholder.com/200",
    contodesuscripcion: 80,
    estatus: EstatusSuscripcion.RECHAZADA,
    createdAt: 1778536939786,
    planSuscripcion: {
      tipo: "PROFESOR",
      costo: 80,
    },
    usuario: {
      cedula: "34567890",
      rol: Rol.PROFESOR,
      primerNombre: "Pedro",
      primerApellido: "Gómez",
      segundoNombre: "Antonio",
      segundoApellido: "Fernández",
      correo: "pedro.gomez@example.com",
      telefono: "04123456789",
    },
  },
  {
    id: 4,
    comprobante: 12348,
    comprobanteImg: "https://via.placeholder.com/200",
    contodesuscripcion: 100,
    estatus: EstatusSuscripcion.VENCIDO,
    createdAt: 1773748539786,
    planSuscripcion: {
      tipo: "AGREMIADO",
      costo: 100,
    },
    usuario: {
      cedula: "45678901",
      rol: Rol.AGREMIADO_SOLVENTE,
      primerNombre: "Ana",
      primerApellido: "Hernández",
      segundoNombre: "Isabel",
      segundoApellido: "Sánchez",
      correo: "ana.hernandez@example.com",
      telefono: "04124567890",
    },
  },
];

export default SUSCRIPCIONES_MOCK;
