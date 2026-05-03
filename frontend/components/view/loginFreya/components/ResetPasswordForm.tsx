"use client";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuthStore } from "../store/useAuthStore";
import AuthSubmitButton from "./AuthSubmitButton";
import { Input } from "@/components/ux";
import { BsFillEnvelopeHeartFill } from "react-icons/bs";

export function ResetPasswordForm() {
  const {
    resetData,
    updateResetData,
    isLoading,
    setCurrentView,
    resetResetData,
  } = useAuthStore();

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-primary">Restablecer contraseña</CardTitle>
        <CardDescription>Ingresa tu correo y te enviaremos un enlace de recuperación</CardDescription>
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
            value={resetData.email}
            onChange={(e) => updateResetData({ email: e.target.value })}
            required
            disabled={isLoading}
          />

          <AuthSubmitButton
            context="reset"
            formData={resetData}
            onSuccess={() => {
              resetResetData();
              setCurrentView("login");
            }}
          >
            Enviar instrucciones
          </AuthSubmitButton>

          <div className="pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setCurrentView("login")}
              className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
              disabled={isLoading}
            >
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      </CardContent>
    </>
  );
}
