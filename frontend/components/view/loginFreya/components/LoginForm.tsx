"use client";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuthStore } from "../store/useAuthStore";
import AuthSubmitButton from "./AuthSubmitButton";
import { Input } from "@/components/ux";
import { MdLock } from "react-icons/md";
import { BsFillEnvelopeHeartFill } from "react-icons/bs";

export function LoginForm() {
  const {
    loginData,
    updateLoginData,
    isLoading,
    setCurrentView,
    resetLoginData,
  } = useAuthStore();

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <form 
          onSubmit={(e) => e.preventDefault()}
          className="space-y-4 pt-4"
        >
          <Input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            icon={<BsFillEnvelopeHeartFill />}
            value={loginData.email}
            onChange={(e) => updateLoginData({ email: e.target.value })}
            required
            disabled={isLoading}
          />

          <Input
            name="password"
            type="password"
            placeholder="Contraseña"
            icon={<MdLock />}
            value={loginData.password}
            onChange={(e) => updateLoginData({ password: e.target.value })}
            required
            disabled={isLoading}
          />

          <AuthSubmitButton
            context="login"
            formData={loginData}
            onSuccess={resetLoginData}
          >
            Iniciar sesión
          </AuthSubmitButton>

          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setCurrentView("register")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              disabled={isLoading}
            >
              ¿No tienes cuenta? Regístrate
            </button>
            <button
              type="button"
              onClick={() => setCurrentView("reset")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              disabled={isLoading}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>
      </CardContent>
    </>
  );
}
