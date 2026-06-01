import { create } from "zustand";
import { EstatusPagoEvento } from "@/global/enums";

interface Evento {
  id: number;
  nombre: string;
  fecha: Date;
  lugar: string;
  costo: number;
  descuentoEstudiante: number;
  descuentoProfesor: number;
  tipo: string;
  vigencia: string;
  ponenteEvento: any[];
}

interface SuscripcionEvento {
  id: number;
  eventoId: number;
  estatus: EstatusPagoEvento;
}

interface EventosActivosState {
  eventos: Evento[];
  suscripcionesEventoUsuario: SuscripcionEvento[];
  cargando: boolean;
  error: string | null;
  filtro: string;
  tipoFiltro: string | null;
  
  setEventos: (eventos: Evento[]) => void;
  setSuscripcionesEventoUsuario: (suscripciones: SuscripcionEvento[]) => void;
  setCargando: (cargando: boolean) => void;
  setError: (error: string | null) => void;
  setFiltro: (filtro: string) => void;
  setTipoFiltro: (tipo: string | null) => void;
}

const useEventosActivosStore = create<EventosActivosState>((set) => ({
  eventos: [],
  suscripcionesEventoUsuario: [],
  cargando: false,
  error: null,
  filtro: "",
  tipoFiltro: null,

  setEventos: (eventos) => set({ eventos }),
  setSuscripcionesEventoUsuario: (suscripciones) => set({ suscripcionesEventoUsuario: suscripciones }),
  setCargando: (cargando) => set({ cargando }),
  setError: (error) => set({ error }),
  setFiltro: (filtro) => set({ filtro }),
  setTipoFiltro: (tipo) => set({ tipoFiltro: tipo }),
}));

export default useEventosActivosStore;
