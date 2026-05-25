import { create } from "zustand";
import { Rol } from "@/global/enums";

export interface SuscripcionEvento {
  id: number;
  comprobante: string;
  comprobanteImg: string;
  estatus: string;
  precioAlSuscripcion: number;
  createdAt: string | number;
  evento: {
    id: number;
    nombre: string;
    tipo: string;
    fecha: string;
    lugar: string;
  };
  usuario: {
    id: number;
    cedula: string;
    rol: Rol;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    correo: string;
    telefono: string;
  };
}

export interface SuscripcionEventoMeta {
  total: number;
  page: number;
  limit: number;
}

interface SuscripcionEventoState {
  suscripciones: SuscripcionEvento[];
  filtro: string;
  estatusFiltro: string | null;
  eventoIdFiltro: number | null;
  cargando: boolean;
  error: string | null;
  paginaActual: number;
  meta: SuscripcionEventoMeta | null;

  // Setters
  setSuscripciones: (suscripciones: SuscripcionEvento[]) => void;
  setMeta: (meta: SuscripcionEventoMeta) => void;
  setFiltro: (filtro: string) => void;
  setEstatusFiltro: (estatus: string | null) => void;
  setEventoIdFiltro: (eventoId: number | null) => void;
  setCargando: (cargando: boolean) => void;
  setError: (error: string | null) => void;
  setPaginaActual: (pagina: number) => void;

  // Acciones optimistas
  actualizarEstatusSuscripcion: (
    id: number,
    nuevoEstatus: string
  ) => void;

  // Utilidades
  getTotalPaginas: () => number;
}

const useSuscripcionEventoStore = create<SuscripcionEventoState>((set, get) => ({
  suscripciones: [],
  filtro: "",
  estatusFiltro: null,
  eventoIdFiltro: null,
  cargando: false,
  error: null,
  paginaActual: 1,
  meta: null,

  setSuscripciones: (suscripciones) => set({ suscripciones }),
  setMeta: (meta) => set({ meta }),
  setFiltro: (filtro) => set({ filtro }),
  setEstatusFiltro: (estatusFiltro) => set({ estatusFiltro }),
  setEventoIdFiltro: (eventoIdFiltro) => set({ eventoIdFiltro }),
  setCargando: (cargando) => set({ cargando }),
  setError: (error) => set({ error }),
  setPaginaActual: (paginaActual) => set({ paginaActual }),

  actualizarEstatusSuscripcion: (id, nuevoEstatus) =>
    set((state) => ({
      suscripciones: state.suscripciones.map((s) =>
        s.id === id ? { ...s, estatus: nuevoEstatus } : s
      ),
    })),

  getTotalPaginas: () => {
    const state = get();
    if (!state.meta) return 1;
    return Math.ceil(state.meta.total / state.meta.limit);
  },
}));

export default useSuscripcionEventoStore;
