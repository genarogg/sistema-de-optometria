"use client";

import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuthStore } from "../store/useAuthStore";
import AuthSubmitButton from "./AuthSubmitButton";
import { Input } from "@/components/ux";
import { MdLock } from "react-icons/md";
import { IoMdUnlock } from "react-icons/io";

export function RebootPasswordForm() {
  const {
    rebootData,
    updateRebootData,
    isLoading,
    setCurrentView,
    resetRebootData,
  } = useAuthStore();

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Nueva contraseña</CardTitle>
        <CardDescription>Ingresa tu nueva contraseña para acceder a tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <form 
          onSubmit={(e) => e.preventDefault()}
          className="space-y-4 pt-4"
        >
          <Input
            name="password"
            type="password"
            placeholder="Nueva contraseña"
            icon={<IoMdUnlock />}
            value={rebootData.password}
            onChange={(e) => updateRebootData({ password: e.target.value })}
            required
            disabled={isLoading}
          />

          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirmar contraseña"
            icon={<MdLock />}
            value={rebootData.confirmPassword}
            onChange={(e) => updateRebootData({ confirmPassword: e.target.value })}
            required
            disabled={isLoading}
          />

          <AuthSubmitButton
            context="reboot"
            formData={rebootData}
            onSuccess={() => {
              resetRebootData();
              setCurrentView("login");
            }}
          >
            Restablecer contraseña
          </AuthSubmitButton>

          <div className="pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setCurrentView("login")}
              className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </CardContent>
    </>
  );
}
