import { create } from "zustand";
import { EstatusSuscripcion, Rol } from "@/global/enums";

export interface Suscripcion {
  id: number;
  comprobante: number;
  comprobanteImg: string;
  contodesuscripcion: number;
  estatus: EstatusSuscripcion;
  createdAt: string | number;
  planSuscripcion: {
    tipo: string;
    costo: number;
  };
  usuario: {
    cedula: string;
    rol: Rol;
    primerNombre: string;
    primerApellido: string;
    segundoApellido?: string;
    segundoNombre?: string;
    correo: string;
    telefono: string;
  };
}

export interface SuscripcionMeta {
  total: number;
  page: number;
  limit: number;
}

interface SuscripcionState {
  suscripciones: Suscripcion[] | undefined; // ✅ undefined = aún no cargado
  filtro: string;
  estatusFiltro: EstatusSuscripcion | null;
  cargando: boolean;
  error: string | null;
  paginaActual: number;
  meta: SuscripcionMeta | null;

  // Setters
  setSuscripciones: (suscripciones: Suscripcion[]) => void;
  setMeta: (meta: SuscripcionMeta) => void;
  setFiltro: (filtro: string) => void;
  setEstatusFiltro: (estatus: EstatusSuscripcion | null) => void;
  setCargando: (cargando: boolean) => void;
  setError: (error: string | null) => void;
  setPaginaActual: (pagina: number) => void;

  // Acciones optimistas
  actualizarEstatusSuscripcion: (
    id: number,
    nuevoEstatus: EstatusSuscripcion
  ) => void;

  // Utilidades
  getTotalPaginas: () => number;
}

const useSuscripcionStore = create<SuscripcionState>((set, get) => ({
  suscripciones: undefined, // ✅ era [] — undefined evita falsos positivos antes de cargar
  filtro: "",
  estatusFiltro: null,
  cargando: false,
  error: null,
  paginaActual: 1,
  meta: null,

  setSuscripciones: (suscripciones) => set({ suscripciones }),
  setMeta: (meta) => set({ meta }),
  setFiltro: (filtro) => set({ filtro }),
  setEstatusFiltro: (estatusFiltro) => set({ estatusFiltro }),
  setCargando: (cargando) => set({ cargando }),
  setError: (error) => set({ error }),
  setPaginaActual: (paginaActual) => set({ paginaActual }),

  actualizarEstatusSuscripcion: (id, nuevoEstatus) =>
    set((state) => ({
      suscripciones: state.suscripciones?.map((s) =>
        s.id === id ? { ...s, estatus: nuevoEstatus } : s
      ),
    })),

  getTotalPaginas: () => {
    const state = get();
    if (!state.meta) return 1;
    return Math.ceil(state.meta.total / state.meta.limit);
  },
}));

export default useSuscripcionStore;