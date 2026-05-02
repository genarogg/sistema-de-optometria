interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  idNumber: string;
  email: string;
  password: string;
}

interface ResetPasswordPayload {
  email: string;
}

interface RebootPasswordPayload {
  token: string;
  password: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

const API_BASE_URL = "/api";

async function simulateApiCall<T>(
  data: T,
  delay: number = 1500
): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Operación exitosa",
        data,
      });
    }, delay);
  });
}

export const formService = {
  async login(payload: LoginPayload): Promise<ApiResponse> {
    // En producción, descomentar esto:
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // return response.json();

    console.log("Login request:", payload);
    return simulateApiCall(payload);
  },

  async register(payload: RegisterPayload): Promise<ApiResponse> {
    // En producción, descomentar esto:
    // const response = await fetch(`${API_BASE_URL}/auth/register`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // return response.json();

    console.log("Register request:", payload);
    return simulateApiCall(payload);
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse> {
    // En producción, descomentar esto:
    // const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // return response.json();

    console.log("Reset password request:", payload);
    return simulateApiCall(payload);
  },

  async rebootPassword(payload: RebootPasswordPayload): Promise<ApiResponse> {
    // En producción, descomentar esto:
    // const response = await fetch(`${API_BASE_URL}/auth/reboot-password`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // return response.json();

    console.log("Reboot password request:", payload);
    return simulateApiCall(payload);
  },
};
