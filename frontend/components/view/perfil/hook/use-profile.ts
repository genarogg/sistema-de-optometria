import { print } from "graphql"
import { useProfileStore } from "../store/profile-store"
import { GET_MY_USUARIO, UPDATE_MY_USUARIO, RESET_PASS_WITH_TOKEN } from "../query"
import { URL_BACKEND } from "@/env"

import { useRouter } from 'next/navigation';

import { notify } from "@/components/nano"

export function useProfile() {
  const { setAll, getAll } = useProfileStore()
  const router = useRouter();

  const getToken = (): string | null => {
    return localStorage.getItem("token") || null
  }

  // Obtener datos del usuario
  const fetchUsuario = async (): Promise<boolean> => {
    const token = getToken()

    if (!token) {
      notify({ type: "error", message: "No hay token de autenticación" })
      return false
    }

    try {
      const response = await fetch(URL_BACKEND + "/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: print(GET_MY_USUARIO),
          variables: { token },
        }),
      })

      if (!response.ok) {
        notify({ type: "error", message: "Error al obtener datos del usuario" })
        return false
      }

      const responseData = await response.json()
      const { data, type, message } = responseData.data.getMyUsuario

      console.log("Usuario recibido:", data)

      if (type === "error") {
        notify({ type, message })
        return false
      }

      // 👉 Actualizar ZUSTAND con los nuevos nombres
      setAll({
        cedula: data.cedula || "",
        email: data.email || "",
        avatar: data.avatar || "",
        rol: data.rol || "",
        telefono: data.telefono || "",
        nombres: data.primerNombre || "",
        apellidos: data.primerApellido || "",
        // nombreCompleto NO hace falta: lo genera automáticamente el store
      })

      return true
    } catch (error) {
      console.error("Error al obtener usuario:", error)
      notify({ type: "error", message: "Error de conexión al servidor" })
      return false
    }
  }

  // Actualizar datos del usuario
  const actualizarUsuario = async (): Promise<boolean> => {
    const token = getToken()

    if (!token) {
      notify({ type: "error", message: "No hay token de autenticación" })
      return false
    }

    const profileData = getAll()

    try {
      // 1️⃣ Traer datos actuales del servidor para poder comparar
      const responseGet = await fetch(URL_BACKEND + "/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: print(GET_MY_USUARIO),
          variables: { token },
        }),
      })

      if (!responseGet.ok) {
        notify({ type: "error", message: "Error al verificar datos actuales" })
        return false
      }

      const responseGetData = await responseGet.json()
      const original = responseGetData.data.getMyUsuario.data   

      // 2️⃣ Detectar cambios
      const changedFields: {
        avatar?: any
        email?: string | null
        telefono?: string | null
        primerNombre?: string | null
        primerApellido?: string | null
      } = {}

      const changeAvatar = (profileData.avatar || "") !== (original.avatar || "")

      if (changeAvatar) {
        changedFields.avatar = profileData.avatar || null
      }

      if ((profileData.email || "") !== (original.email || "")) {
        changedFields.email = profileData.email || null
      }

      if ((profileData.telefono || "") !== (original.telefono || "")) {
        changedFields.telefono = profileData.telefono || null
      }

      if ((profileData.nombres || "") !== (original.primerNombre || "")) {
        changedFields.primerNombre = profileData.nombres || null
      }

      if ((profileData.apellidos || "") !== (original.primerApellido || "")) {
        changedFields.primerApellido = profileData.apellidos || null
      }

      // 3️⃣ Si no cambió nada, avisamos y salimos
      if (Object.keys(changedFields).length === 0) {
        notify({ type: "info", message: "No hay cambios para guardar" })
        return true
      }

      console.log("Campos modificados:", changedFields)

      // 4️⃣ Enviar mutación con solo los campos modificados
      const response = await fetch(URL_BACKEND + "/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: print(UPDATE_MY_USUARIO),
          variables: {
            token,
            ...changedFields,
          },
        }),
      })

      if (!response.ok) {
        notify({ type: "error", message: "Error al actualizar usuario" })
        return false
      }

      const responseData = await response.json()
      const { type, message } = responseData.data.updateMyUsuario

      if (type === "error") {
        notify({ type, message })
        return false
      }



      notify({ type, message })

      if (changeAvatar) {

        localStorage.getItem("avatarNew")

        if (localStorage.getItem("avatarNew") === "true") {
          localStorage.removeItem("avatarNew")
          router.push("/dashboard/documentos")
        }
      }


      return true
    } catch (error) {
      console.error("Error al actualizar usuario:", error)
      notify({ type: "error", message: "Error de conexión al servidor" })
      return false
    }
  }

  // Cambiar contraseña
  const cambiarPassword = async (nuevaContrasena: string, confirmarContrasena: string): Promise<boolean> => {
    const token = getToken()

    if (!token) {
      notify({ type: "error", message: "No hay token de autenticación" })
      return false
    }

    // Validaciones
    if (!nuevaContrasena) {
      notify({ type: "error", message: "La contraseña es requerida" })
      return false
    }

    if (!confirmarContrasena) {
      notify({ type: "error", message: "La confirmación de la contraseña es requerida" })
      return false
    }

    if (nuevaContrasena !== confirmarContrasena) {
      notify({ type: "error", message: "Las contraseñas no coinciden" })
      return false
    }

    try {
      const response = await fetch(URL_BACKEND + "/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: print(RESET_PASS_WITH_TOKEN),
          variables: {
            token,
            nuevaContrasena,
          },
        }),
      })

      if (!response.ok) {
        notify({ type: "error", message: "Error al cambiar la contraseña" })
        return false
      }

      const responseData = await response.json()
      const { type, message } = responseData.data.resetPassWithToken

      if (type === "error") {
        notify({ type, message })
        return false
      }

      notify({ type, message })
      return true
    } catch (error) {
      console.error("Error al cambiar contraseña:", error)
      notify({ type: "error", message: "Error de conexión al servidor" })
      return false
    }
  }

  return {
    fetchUsuario,
    actualizarUsuario,
    cambiarPassword,
  }
}