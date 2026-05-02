import { create } from "zustand"

interface ProfileData {
  cedula: string
  email: string
  avatar: string // base64
  rol: string
  telefono: string
  nombres: string
  apellidos: string
  nombreCompleto: string // generado
}

interface ProfileStore extends ProfileData {
  set: <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => void
  get: <K extends keyof ProfileData>(key: K) => ProfileData[K]
  setAll: (data: Partial<ProfileData>) => void
  getAll: () => ProfileData
  reset: () => void
}

const initialState: ProfileData = {
  cedula: "",
  email: "",
  avatar: "",
  rol: "",
  telefono: "",
  nombres: "",
  apellidos: "",
  nombreCompleto: "",
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  ...initialState,

  set: (key, value) => set({ [key]: value }),

  get: (key) => get()[key],

  setAll: (data) =>
    set((state) => {
      const nextState = { ...state, ...data }

      // Generar nombre completo automáticamente
      nextState.nombreCompleto = `${nextState.nombres || ""} ${nextState.apellidos || ""}`.trim()

      return nextState
    }),

  getAll: () => {
    const state = get()
    return { ...state }
  },

  reset: () => set(initialState),
}))
