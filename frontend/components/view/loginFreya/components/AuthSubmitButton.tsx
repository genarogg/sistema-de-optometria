'use client'
import React, { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v4'
import { isStrongPassword, isValidEmail } from "@/functions"
import { RECAPTCHA_KEY } from "@/env"
import { notify } from "@/components/nano"
import { useMutation } from '@apollo/client/react'
import { useRouter } from 'next/navigation';
import { useAuthStore } from "@/context/auth/AuthContext"
import { Button } from "@/components/ui/button";

import {
  REGISTER_USUARIO,
  LOGIN_USUARIO,
  SEND_RESET_PASSWORD,
  RESET_PASS_WITH_TOKEN,
} from "@/query"

interface AuthSubmitButtonProps {
  children: React.ReactNode
  className?: string
  id?: string
  disabled?: boolean
  formData: any
  context: 'login' | 'register' | 'reset' | 'reboot'
  onSuccess?: () => void
}

const AuthSubmitButton = ({
  children,
  className = "",
  id = "",
  disabled = false,
  formData,
  context,
  onSuccess
}: AuthSubmitButtonProps) => {

  const { setLogin } = useAuthStore()
// setIsLoading is not part of AuthState; remove this line
  const [loading, setLoading] = useState(false)
  const { executeRecaptcha } = useGoogleReCaptcha()

  const [loginUsuario] = useMutation(LOGIN_USUARIO)
  const [registerUsuario] = useMutation(REGISTER_USUARIO)
  const [sendResetPassword] = useMutation(SEND_RESET_PASSWORD)
  const [resetPassWithToken] = useMutation(RESET_PASS_WITH_TOKEN)

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      let tokenCaptcha = ''

      if (RECAPTCHA_KEY && executeRecaptcha) {
        tokenCaptcha = await executeRecaptcha(context)
      }

      const data = formData
      const rebootToken = localStorage.getItem("reboot-token") || null

      // ─── Validaciones ───────────────────────────────────────
      if (context !== "reboot" && !data.email) {
        notify({ type: "error", message: "El email es requerido" })
        return
      }

      if (context !== "reset" && !data.password) {
        notify({ type: "error", message: "La contraseña es requerida" })
        return
      }

      if (context === "register" || context === "reboot") {
        if (!data.confirmPassword) {
          notify({ type: "error", message: "La confirmación de la contraseña es requerida" })
          return
        }
        if (data.password !== data.confirmPassword) {
          notify({ type: "error", message: "Las contraseñas no coinciden" })
          return
        }
        if (!isStrongPassword(data.password)) {
          notify({ type: "warning", message: "La contraseña debe tener al menos 8 caracteres, incluir letras, números y al menos un símbolo" })
          return
        }
      }

      if (context === "register") {
        if (!isValidEmail(data.email)) {
          notify({ type: "error", message: "El email no es válido" })
          return
        }
        if (!data.firstName) {
          notify({ type: "error", message: "El nombre es requerido" })
          return
        }
        if (!data.lastName) {
          notify({ type: "error", message: "El apellido es requerido" })
          return
        }
        if (!data.phone) {
          notify({ type: "error", message: "El teléfono es requerido" })
          return
        }
        if (!data.idNumber) {
          notify({ type: "error", message: "La cédula es requerida" })
          return
        }
      }

      // ─── Ejecutar la mutación según el contexto ─────────────────────
      let responseData: any

      if (context === "login") {
        const { data: res } = await loginUsuario({
          variables: {
            email: data.email.toLowerCase(),
            password: data.password,
            captchaToken: tokenCaptcha,
          }
        })
        responseData = (res as any).loginUsuario
      }

      else if (context === "register") {
        const { data: res } = await registerUsuario({
          variables: {
            primerNombre: data.firstName,
            primerApellido: data.lastName,
            telefono: data.phone,
            cedula: data.idNumber,
            email: data.email.toLowerCase(),
            password: data.password,
            captchaToken: tokenCaptcha,
          }
        })
        responseData = (res as any).registerUsuario
      }

      else if (context === "reset") {
        const { data: res } = await sendResetPassword({
          variables: {
            email: data.email.toLowerCase(),
          }
        })
        responseData = (res as any).resetSendEmail
      }

      else if (context === "reboot") {
        const { data: res } = await resetPassWithToken({
          variables: {
            token: rebootToken,
            nuevaContrasena: data.password,
          }
        })
        responseData = (res as any).resetPassWithToken
      }

      // ─── Manejar la respuesta ────────────────────────────────────────
      const { type, message, data: datos } = responseData

      notify({ type, message })

      if (type === "error") return

      if (context === "reset" || context === "reboot") {
        if (onSuccess) onSuccess();
        return;
      }

      localStorage.setItem("token", datos.token)

      setLogin({
        token: datos.token,
        usuario: {
          ...datos
        }
      })

      if (onSuccess) onSuccess();
      router.push("/dashboard")

    } catch (error) {
      console.error("Error en el submit:", error)
      notify({ type: "error", message: "Ocurrió un error inesperado" })
    } finally {
      setLoading(false)
     
    }
  }

  return (
    <Button
      type="submit"
      className={`w-full ${className}`}
      id={id}
      disabled={loading || disabled}
      onClick={() => {
        setLoading(true)
       
        handleSubmit()
      }}
    >
      {loading ? "Cargando..." : children}
    </Button>
  )
}

export default AuthSubmitButton
