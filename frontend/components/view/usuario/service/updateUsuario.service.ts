import { clientApollo } from "@/functions";
import UPDATE_USUARIO_ADMIN from "../querys/UPDATE_USUARIO_ADMIN";
import useUsuariosStore from "../store/usuariosStore";
import { Rol } from "@/global/enums";
import { notify } from "@/components/nano";

interface UpdateUsuarioParams {
  id: string;
  primerNombre?: string;
  segundoNombre?: string | null;
  primerApellido?: string;
  segundoApellido?: string | null;
  telefono?: string;
  cedula?: string;
  email?: string;
  numeroGremino?: number | null;
  password?: string;
  rol?: Rol;
}

export async function updateUsuarioService(params: UpdateUsuarioParams) {
  const { actualizarUsuario } = useUsuariosStore.getState();

  const token = localStorage.getItem("token");

  if (!token) {
    notify({ type: "error", message: "No se encontró token de autenticación." });
    return;
  }

  // Actualización optimista: primero actualizamos el store
  const { id, password, ...camposDeUsuario } = params;
  actualizarUsuario(id, camposDeUsuario);

  try {
    const client = clientApollo;
    const { data } = await client.mutate({
      mutation: UPDATE_USUARIO_ADMIN,
      variables: { usuarioId: parseInt(id), token, password, ...camposDeUsuario },
    });

    if (data?.updateUsuarioAdmin) {
      const { type, message } = data.updateUsuarioAdmin;
      notify({ type, message });
    }
  } catch (err: any) {
    console.error("Error al actualizar usuario:", err);
    notify({ type: "error", message: err.message || "Error al actualizar usuario" });
    // En un caso real, aqui se podria revertir el cambio optimista
  }
}
