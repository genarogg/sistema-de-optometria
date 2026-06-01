import { create } from "zustand";

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
  estatus: string;
}

interface EventosUsuario {
  id: number;
  suscripcionEventos: SuscripcionEvento[];
}

interface EventosActivosState {
  eventos: Evento[];
  eventosUsuario: EventosUsuario | null;
  cargando: boolean;
  error: string | null;
  filtro: string;
  tipoFiltro: string | null;
  
  setEventos: (eventos: Evento[]) => void;
  setEventosUsuario: (eventosUsuario: EventosUsuario | null) => void;
  setCargando: (cargando: boolean) => void;
  setError: (error: string | null) => void;
  setFiltro: (filtro: string) => void;
  setTipoFiltro: (tipo: string | null) => void;
}

const useEventosActivosStore = create<EventosActivosState>((set) => ({
  eventos: [],
  eventosUsuario: null,
  cargando: false,
  error: null,
  filtro: "",
  tipoFiltro: null,

  setEventos: (eventos) => set({ eventos }),
  setEventosUsuario: (eventosUsuario) => set({ eventosUsuario }),
  setCargando: (cargando) => set({ cargando }),
  setError: (error) => set({ error }),
  setFiltro: (filtro) => set({ filtro }),
  setTipoFiltro: (tipo) => set({ tipoFiltro: tipo }),
}));

export default useEventosActivosStore;
