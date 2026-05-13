import { AccionesBitacora, Rol, TipoAutoridad, TipoEvento, TipoSuscripcion, EstatusSuscripcion, NivelAcademico } from "./enums"

export interface Usuario {
  id: number
  primerNombre: string
  segundoNombre?: string
  primerApellido: string
  segundoApellido?: string
  avatar?: string
  telefono: string
  cedula: string
  email: string
  password: string
  rol: Rol
  Autoridad?: Autoridad[]
  Gremio?: Gremio[]
  Bitacora?: Bitacora[]
  Evento?: Evento[]
  Ponente_Evento?: Ponente_Evento[]
  suscripcionEventos?: Suscripcion_Evento[]
  PlanSuscripcion?: PlanSuscripcion[]
  Suscripcion?: Suscripcion[]
  createdAt: Date
  updatedAt: Date
}

export interface Autoridad {
  id: number
  firma: string
  tipoAutoridad: TipoAutoridad
  usuarioId: number
  Usuario?: Usuario
  createdAt: Date
  updatedAt: Date
}

export interface Gremio {
  id: number
  numeroGremio: number
  nivelAcademico: NivelAcademico
  usuarioId: number
  Usuario?: Usuario
  createdAt: Date
  updatedAt: Date
}

export interface Bitacora {
  id: number
  type: AccionesBitacora
  fecha: Date
  mensaje?: string
  usuarioId: number
  usuario?: Usuario
}

export interface Evento {
  id: number
  nombre: string
  fecha: Date
  lugar: string
  precio: number
  descuento: number
  tipo: TipoEvento
  usuarioId: number
  Usuario?: Usuario
  Ponente_Evento?: Ponente_Evento[]
  Suscripcion_Evento?: Suscripcion_Evento[]
  createdAt: Date
  updatedAt: Date
}

export interface Ponente_Evento {
  id: number
  usuarioId: number
  eventoId: number
  Usuario?: Usuario
  Evento?: Evento
  createdAt: Date
  updatedAt: Date
}

export interface Suscripcion_Evento {
  id: number
  precioAlSuscripcion: number
  eventoId: number
  Evento?: Evento
  usuarioId: number
  Usuario?: Usuario
  createdAt: Date
  updatedAt: Date
}

export interface PlanSuscripcion {
  id: number
  costo: number
  tipo: TipoSuscripcion
  isActivo: boolean
  usuarioId: number
  Usuario?: Usuario
  suscripciones?: Suscripcion[]
  createdAt: Date
  updatedAt: Date
}

export interface Suscripcion {
  id: number
  estatus: EstatusSuscripcion
  comprobante: number
  comprobanteImg: string
  contodesuscripcion: number
  usuarioId: number
  Usuario?: Usuario
  suscripcionId: number
  planSuscripcion?: PlanSuscripcion
  isActivo: boolean
  createdAt: Date
  updatedAt: Date
}