import { AccionesBitacora } from "./enums";
import type { BitacoraEntry } from "../store/bitacoraStore";

export const MOCK_BITACORA: BitacoraEntry[] = [
  {
    id: 1,
    fecha: "2024-03-01T08:00:00Z",
    mensaje: "Usuario inició sesión correctamente",
    type: AccionesBitacora.LOGIN,
    usuario: { email: "admin@empresa.com" },
  },
  {
    id: 2,
    fecha: "2024-03-01T09:15:00Z",
    mensaje: "Se creó un nuevo usuario estándar",
    type: AccionesBitacora.CREATE_USER,
    usuario: { email: "admin@empresa.com" },
  },
  {
    id: 3,
    fecha: "2024-03-01T10:30:00Z",
    mensaje: "Se actualizó el perfil del usuario cliente@empresa.com",
    type: AccionesBitacora.UPDATE_USER,
    usuario: { email: "super@empresa.com" },
  },
  {
    id: 4,
    fecha: "2024-03-02T11:00:00Z",
    mensaje: "Error al intentar eliminar un usuario",
    type: AccionesBitacora.ERROR,
    usuario: { email: "admin@empresa.com" },
  },
  {
    id: 5,
    fecha: "2024-03-02T13:45:00Z",
    mensaje: "Se listaron los usuarios del sistema",
    type: AccionesBitacora.GET_USUARIOS,
    usuario: { email: "super@empresa.com" },
  },
  {
    id: 6,
    fecha: "2024-03-03T08:20:00Z",
    mensaje: "Se creó un nuevo administrador",
    type: AccionesBitacora.CREATE_ADMIN,
    usuario: { email: "admin@empresa.com" },
  },
  {
    id: 7,
    fecha: "2024-03-03T09:00:00Z",
    mensaje: "Visita al panel de control",
    type: AccionesBitacora.VIEW,
    usuario: { email: "estandar@empresa.com" },
  },
  {
    id: 8,
    fecha: "2024-03-03T14:10:00Z",
    mensaje: "Se eliminó el usuario inactivo@empresa.com",
    type: AccionesBitacora.DELETE_USER,
    usuario: { email: "admin@empresa.com" },
  },
  {
    id: 9,
    fecha: "2024-03-04T10:05:00Z",
    mensaje: "Se actualizó el rol de administrador",
    type: AccionesBitacora.UPDATE_ADMIN,
    usuario: { email: "super@empresa.com" },
  },
  {
    id: 10,
    fecha: "2024-03-04T16:30:00Z",
    mensaje: "Se eliminó un administrador del sistema",
    type: AccionesBitacora.DELETE_ADMIN,
    usuario: { email: "admin@empresa.com" },
  },
];
