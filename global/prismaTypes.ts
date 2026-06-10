import { AccionesBitacora, Rol, TipoAutoridad, TipoEvento, TipoSuscripcion, EstatusSuscripcion, EstatusPagoEvento, NivelAcademico, TipoDeDocumento, VigenciaEvento } from "./enums"

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
  autoridad?: Autoridad
  gremio?: Gremio
  bitacora?: Bitacora[]
  evento?: Evento[]
  ponente_Evento?: PonenteEvento[]
  suscripcionEventos?: SuscripcionEvento[]
  planSuscripcion?: PlanSuscripcion[]
  suscripcion?: Suscripcion[]
  documentoSolicitados?: DocumentoSolicitado[]
  createdAt: Date
  updatedAt: Date
}

export interface Autoridad {
  id: number
  firma: string
  tipoAutoridad: TipoAutoridad
  usuarioId: number
  vigente: boolean
  usuario?: Usuario
  documentosSolicitados?: DocumentoSolicitado[]
  createdAt: Date
  updatedAt: Date
}

export interface Gremio {
  id: number
  numeroGremio?: number
  nivelAcademico: NivelAcademico
  usuarioId: number
  usuario?: Usuario
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
  costo: number
  tipo: TipoEvento
  descuentoEstudiante: number
  descuentoProfesor: number
  vigencia: VigenciaEvento
  usuarioId: number
  Usuario?: Usuario
  aliadoInstitucionImg?: string
  aliadoInstitucionNombre?: string
  aliadoAutorizoFirmaImg?: string
  aliadoAutorizoNombreFirma?: string
  aliadoAutorizoCargo?: string
  ponenteEvento?: PonenteEvento[]
  suscripcionEvento?: SuscripcionEvento[]
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

export interface PonenteEvento {
  id: number
  usuarioId: number
  eventoId: number
  usuario?: Usuario
  evento?: Evento
  isActivo: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SuscripcionEvento {
  id: number
  precioAlSuscripcion: number
  estatus: EstatusPagoEvento
  comprobante: string
  comprobanteImg: string
  eventoId: number
  evento?: Evento
  usuarioId: number
  usuario?: Usuario
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
  usuario?: Usuario
  suscripcionId: number
  planSuscripcion?: PlanSuscripcion
  createdAt: Date
  updatedAt: Date
}

export interface DocumentoSolicitado {
  id: number
  usuarioId: number
  autoridadId: number
  tipo: TipoDeDocumento
  autoridad?: Autoridad
  usuario?: Usuario
  createdAt: Date
  updatedAt: Date
}