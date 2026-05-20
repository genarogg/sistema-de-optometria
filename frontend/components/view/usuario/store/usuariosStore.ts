import { create } from "zustand";
import { Rol } from "@/global/enums";


export interface Usuario {
  id: string;
  primerNombre: string;
  segundoNombre: string | null;
  primerApellido: string;
  segundoApellido: string | null;
  email: string;
  cedula: string;
  telefono: string | null;
  rol: Rol;
  gremio?: {
    id: string;
    nivelAcademico: string;
    numeroGremio: string;
  } | null;
  autoridad?: {
    id: string;
    tipoAutoridad: string;
    vigente: boolean;
    firma?: string;
  } | null;
}

interface UsuariosState {
  usuarios: Usuario[];
  rolActual: Rol;
  filtro: string;
  cargando: boolean;
  error: string | null;

  // Setters
  setUsuarios: (usuarios: Usuario[]) => void;
  setRolActual: (rol: Rol) => void;
  setFiltro: (filtro: string) => void;
  setCargando: (cargando: boolean) => void;
  setError: (error: string | null) => void;

  // Acciones optimistas
  actualizarUsuario: (id: string, cambios: Partial<Omit<Usuario, "id">>) => void;
}

const useUsuariosStore = create<UsuariosState>((set) => ({
  usuarios: [],
  rolActual: Rol.ADMINISTRADOR,
  filtro: "",
  cargando: false,
  error: null,

  setUsuarios: (usuarios) => set({ usuarios }),
  setRolActual: (rolActual) => set({ rolActual }),
  setFiltro: (filtro) => set({ filtro }),
  setCargando: (cargando) => set({ cargando }),
  setError: (error) => set({ error }),

  actualizarUsuario: (id, cambios) =>
    set((state) => ({
      usuarios: state.usuarios.map((u) =>
        u.id === id ? { ...u, ...cambios } : u
      ),
    })),
}));

export default useUsuariosStore;
