import { create } from "zustand";
import { PlanSuscripcion } from "@/global/prismaTypes";


interface PlanesState {
  planes: PlanSuscripcion[];
  filtro: string;
  cargando: boolean;
  error: string | null;
  paginaActual: number;
  itemsPorPagina: number;

  // Setters
  setPlanes: (planes: PlanSuscripcion[]) => void;
  setFiltro: (filtro: string) => void;
  setCargando: (cargando: boolean) => void;
  setError: (error: string | null) => void;
  setPaginaActual: (pagina: number) => void;

  // Acciones optimistas
  actualizarPlan: (id: number, cambios: Partial<Omit<PlanSuscripcion, "id">>) => void;
  agregarPlan: (plan: any) => void;
}

const usePlanesStore = create<PlanesState>((set) => ({
  planes: [],
  filtro: "",
  cargando: false,
  error: null,
  paginaActual: 1,
  itemsPorPagina: 10,

  setPlanes: (planes) => set({ planes }),
  setFiltro: (filtro) => set({ filtro }),
  setCargando: (cargando) => set({ cargando }),
  setError: (error) => set({ error }),
  setPaginaActual: (paginaActual) => set({ paginaActual }),

  actualizarPlan: (id, cambios) =>
    set((state) => ({
      planes: state.planes.map((p) =>
        p.id === id ? { ...p, ...cambios } : p
      ),
    })),

  agregarPlan: (plan) =>
    set((state) => ({
      planes: [...state.planes, plan],
    })),
}));

export default usePlanesStore;
