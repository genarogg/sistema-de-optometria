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
  aliadoImg?: string;
  aliadoNombre?: string;
  ponenteEvento: any[];
}

interface EventosState {
  eventos: Evento[];
  filtro: string;
  vigenciaFiltro: string | null;
  tipoFiltro: string | null;
  cargando: boolean;
  error: string | null;
  paginaActual: number;
  itemsPorPagina: number;
  totalPaginas: number;

  setEventos: (eventos: Evento[]) => void;
  setFiltro: (filtro: string) => void;
  setVigenciaFiltro: (vigencia: string | null) => void;
  setTipoFiltro: (tipo: string | null) => void;
  setCargando: (cargando: boolean) => void;
  setError: (error: string | null) => void;
  setPaginaActual: (pagina: number | ((prevState: number) => number)) => void;
  setTotalPaginas: (totalPaginas: number) => void;

  actualizarEvento: (id: number, cambios: Partial<Omit<Evento, "id">>) => void;
  agregarEvento: (evento: any) => void;
}

const useEventosStore = create<EventosState>((set) => ({
  eventos: [],
  filtro: "",
  vigenciaFiltro: null,
  tipoFiltro: null,
  cargando: false,
  error: null,
  paginaActual: 1,
  itemsPorPagina: 20,
  totalPaginas: 1,

  setEventos: (eventos) => set({ eventos }),
  setFiltro: (filtro) => set({ filtro }),
  setVigenciaFiltro: (vigencia) => set({ vigenciaFiltro: vigencia }),
  setTipoFiltro: (tipo) => set({ tipoFiltro: tipo }),
  setCargando: (cargando) => set({ cargando }),
  setError: (error) => set({ error }),
  setPaginaActual: (paginaActual) => set((state) => ({
    paginaActual: typeof paginaActual === 'function' ? paginaActual(state.paginaActual) : paginaActual,
  })),
  setTotalPaginas: (totalPaginas) => set({ totalPaginas }),

  actualizarEvento: (id, cambios) =>
    set((state) => ({
      eventos: state.eventos.map((e) =>
        e.id === id ? { ...e, ...cambios } : e
      ),
    })),

  agregarEvento: (evento) =>
    set((state) => ({
      eventos: [evento, ...state.eventos],
    })),
}));

export default useEventosStore;
