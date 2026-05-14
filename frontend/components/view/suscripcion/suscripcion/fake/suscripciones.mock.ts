import { EstatusSuscripcion, Rol } from "@/global/enums";
import type { Suscripcion } from "../store/suscripcionStore";

const SUSCRIPCIONES_MOCK: Suscripcion[] = [
  {
    id: 1,
    comprobante: 12345,
    comprobanteImg: "https://via.placeholder.com/200",
    contodesuscripcion: 100,
    estatus: EstatusSuscripcion.PENDIENTE,
    createdAt: "2024-05-10T10:30:00Z",
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
      telefono: "04121234567",
    },
  },
  {
    id: 2,
    comprobante: 12346,
    comprobanteImg: "https://via.placeholder.com/200",
    contodesuscripcion: 50,
    estatus: EstatusSuscripcion.VALIDADO,
    createdAt: "2024-05-09T14:20:00Z",
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
      telefono: "04122345678",
    },
  },
  {
    id: 3,
    comprobante: 12347,
    comprobanteImg: "https://via.placeholder.com/200",
    contodesuscripcion: 80,
    estatus: EstatusSuscripcion.RECHAZADA,
    createdAt: "2024-05-08T09:15:00Z",
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
      telefono: "04123456789",
    },
  },
  {
    id: 4,
    comprobante: 12348,
    comprobanteImg: "https://via.placeholder.com/200",
    contodesuscripcion: 100,
    estatus: EstatusSuscripcion.VENCIDO,
    createdAt: "2024-04-15T11:45:00Z",
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
      telefono: "04124567890",
    },
  },
];

export default SUSCRIPCIONES_MOCK;
