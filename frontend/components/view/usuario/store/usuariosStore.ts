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
  numeroGremino: number | null;
  rol: Rol;
}

interface UsuariosState {
  usuarios: Usuario[];
  rolActual: Rol;
  filtro: string;
  cargando: boolean;
  error: string | null;
  paginaActual: number;
  itemsPorPagina: number;

  // Setters
  setUsuarios: (usuarios: Usuario[]) => void;
  setRolActual: (rol: Rol) => void;
  setFiltro: (filtro: string) => void;
  setCargando: (cargando: boolean) => void;
  setError: (error: string | null) => void;
  setPaginaActual: (pagina: number) => void;

  // Acciones optimistas
  actualizarUsuario: (id: string, cambios: Partial<Omit<Usuario, "id">>) => void;
}

const useUsuariosStore = create<UsuariosState>((set) => ({
  usuarios: [],
  rolActual: Rol.ADMIN,
  filtro: "",
  cargando: false,
  error: null,
  paginaActual: 1,
  itemsPorPagina: 10,

  setUsuarios: (usuarios) => set({ usuarios }),
  setRolActual: (rolActual) => set({ rolActual }),
  setFiltro: (filtro) => set({ filtro }),
  setCargando: (cargando) => set({ cargando }),
  setError: (error) => set({ error }),
  setPaginaActual: (paginaActual) => set({ paginaActual }),

  actualizarUsuario: (id, cambios) =>
    set((state) => ({
      usuarios: state.usuarios.map((u) =>
        u.id === id ? { ...u, ...cambios } : u
      ),
    })),
}));

export default useUsuariosStore;
