import { create } from "zustand";
import { AccionesBitacora, FakeRol, Rol } from "../fake/enums";

export interface BitacoraEntry {
  id: number;
  fecha: string;
  mensaje: string;
  type: AccionesBitacora;
  usuario: { 
    email: string;
    cedula?: string;
    rol?: string;
  };
}

export interface BitacoraFilters {
  searchTerm: string;
  rol: Rol | "";
  acciones: AccionesBitacora | "";
  page: number;
}

export interface BitacoraMeta {
  page: number;
  total: number;
}

interface BitacoraState {
  // Data
  entries: BitacoraEntry[];
  meta: BitacoraMeta;
  loading: boolean;
  error: string | null;

  // Filters
  filters: BitacoraFilters;

  // UI – role selector for development/preview
  fakeRol: FakeRol;

  // Actions
  setEntries: (entries: BitacoraEntry[], meta: BitacoraMeta) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<BitacoraFilters>) => void;
  setFakeRol: (rol: FakeRol) => void;

  /** Optimistic add */
  addEntry: (entry: Omit<BitacoraEntry, "id">) => void;

  /** Optimistic update */
  updateEntry: (id: number, changes: Partial<BitacoraEntry>) => void;

  /** Optimistic delete */
  deleteEntry: (id: number) => void;
}

export const useBitacoraStore = create<BitacoraState>((set, get) => ({
  entries: [],
  meta: { page: 1, total: 0 },
  loading: false,
  error: null,

  filters: {
    searchTerm: "",
    rol: "",
    acciones: "",
    page: 1,
  },

  fakeRol: FakeRol.ADMIN,

  setEntries: (entries, meta) => set({ entries, meta }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
    })),

  setFakeRol: (rol) => set({ fakeRol: rol }),

  addEntry: (entry) =>
    set((state) => {
      const maxId = state.entries.reduce((max, e) => Math.max(max, e.id), 0);
      const newEntry: BitacoraEntry = { ...entry, id: maxId + 1 };
      return { entries: [newEntry, ...state.entries] };
    }),

  updateEntry: (id, changes) =>
    set((state) => ({
      entries: state.entries.map((e) =>
        e.id === id ? { ...e, ...changes } : e
      ),
    })),

  deleteEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    })),
}));
