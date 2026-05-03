"use client";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuthStore } from "../store/useAuthStore";
import AuthSubmitButton from "./AuthSubmitButton";
import { Input } from "@/components/ux";
import { BsFillEnvelopeHeartFill, BsPersonFill } from 'react-icons/bs';
import { MdLock } from 'react-icons/md';
import { IoMdUnlock } from "react-icons/io";

export function RegisterForm() {
  const {
    registerData,
    updateRegisterData,
    isLoading,
    setCurrentView,
    resetRegisterData,
  } = useAuthStore();

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-primary">Crear cuenta</CardTitle>
        <CardDescription>Completa el formulario para registrarte</CardDescription>
      </CardHeader>
      <CardContent>
        <form 
          onSubmit={(e) => e.preventDefault()}
          className="space-y-4 pt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="firstName"
              type="text"
              placeholder="Nombre"
              icon={<BsPersonFill />}
              value={registerData.firstName}
              onChange={(e) => updateRegisterData({ firstName: e.target.value })}
              required
              disabled={isLoading}
            />

            <Input
              name="lastName"
              type="text"
              placeholder="Apellido"
              icon={<BsPersonFill />}
              value={registerData.lastName}
              onChange={(e) => updateRegisterData({ lastName: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              name="idNumber"
              type="text"
              placeholder="Cédula"
              icon={<BsPersonFill />}
              value={registerData.idNumber}
              onChange={(e) => updateRegisterData({ idNumber: e.target.value })}
              required
              disabled={isLoading}
            />

            <Input
              name="phone"
              type="tel"
              placeholder="Teléfono"
              icon={<BsPersonFill />}
              value={registerData.phone}
              onChange={(e) => updateRegisterData({ phone: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <Input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            icon={<BsFillEnvelopeHeartFill />}
            value={registerData.email}
            onChange={(e) => updateRegisterData({ email: e.target.value })}
            required
            disabled={isLoading}
          />

          <Input
            name="password"
            type="password"
            placeholder="Contraseña"
            icon={<IoMdUnlock />}
            value={registerData.password}
            onChange={(e) => updateRegisterData({ password: e.target.value })}
            required
            disabled={isLoading}
          />

          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirmar contraseña"
            icon={<MdLock />}
            value={registerData.confirmPassword}
            onChange={(e) => updateRegisterData({ confirmPassword: e.target.value })}
            required
            disabled={isLoading}
          />

          <AuthSubmitButton
            context="register"
            formData={registerData}
            onSuccess={resetRegisterData}
          >
            Registrarse
          </AuthSubmitButton>

          <div className="pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setCurrentView("login")}
              className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
              disabled={isLoading}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </form>
      </CardContent>
    </>
  );
}
