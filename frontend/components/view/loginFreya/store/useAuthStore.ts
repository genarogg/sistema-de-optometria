import { create } from "zustand";

export type AuthView = "login" | "register" | "reset" | "reboot";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  secondName: string;
  lastName: string;
  secondLastName: string;
  idNumber: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface ResetData {
  email: string;
}

interface RebootData {
  password: string;
  confirmPassword: string;
}

interface AuthState {
  currentView: AuthView;
  isLoading: boolean;
  error: string | null;

  loginData: LoginData;
  registerData: RegisterData;
  resetData: ResetData;
  rebootData: RebootData;

  setCurrentView: (view: AuthView) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  updateLoginData: (data: Partial<LoginData>) => void;
  updateRegisterData: (data: Partial<RegisterData>) => void;
  updateResetData: (data: Partial<ResetData>) => void;
  updateRebootData: (data: Partial<RebootData>) => void;

  resetLoginData: () => void;
  resetRegisterData: () => void;
  resetResetData: () => void;
  resetRebootData: () => void;
}

const initialLoginData: LoginData = {
  email: "",
  password: "",
};

const initialRegisterData: RegisterData = {
  firstName: "",
  secondName: "",
  lastName: "",
  secondLastName: "",
  idNumber: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const initialResetData: ResetData = {
  email: "",
};

const initialRebootData: RebootData = {
  password: "",
  confirmPassword: "",
};

export const useAuthStore = create<AuthState>((set) => ({
  currentView: "login",
  isLoading: false,
  error: null,

  loginData: initialLoginData,
  registerData: initialRegisterData,
  resetData: initialResetData,
  rebootData: initialRebootData,

  setCurrentView: (view) => set({ currentView: view, error: null }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  updateLoginData: (data) =>
    set((state) => ({
      loginData: { ...state.loginData, ...data },
    })),

  updateRegisterData: (data) =>
    set((state) => ({
      registerData: { ...state.registerData, ...data },
    })),

  updateResetData: (data) =>
    set((state) => ({
      resetData: { ...state.resetData, ...data },
    })),

  updateRebootData: (data) =>
    set((state) => ({
      rebootData: { ...state.rebootData, ...data },
    })),

  resetLoginData: () => set({ loginData: initialLoginData }),
  resetRegisterData: () => set({ registerData: initialRegisterData }),
  resetResetData: () => set({ resetData: initialResetData }),
  resetRebootData: () => set({ rebootData: initialRebootData }),
}));
