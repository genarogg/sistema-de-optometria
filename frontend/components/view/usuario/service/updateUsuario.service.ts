import { clientApollo } from "@/functions";
import UPDATE_USUARIO_ADMIN from "../querys/UPDATE_USUARIO_ADMIN";
import useUsuariosStore from "../store/usuariosStore";
import { Rol } from "@/global/enums";

interface UpdateUsuarioParams {
  id: string;
  primerNombre?: string;
  primerApellido?: string;
  telefono?: string;
  cedula?: string;
  email?: string;
  password?: string;
  rol?: Rol;
}

export async function updateUsuarioService(params: UpdateUsuarioParams) {
  const { actualizarUsuario } = useUsuariosStore.getState();

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No se encontró token de autenticación.");
    return;
  }

  // Actualización optimista: primero actualizamos el store
  const { id, password, ...camposDeUsuario } = params;
  actualizarUsuario(id, camposDeUsuario);

  try {
    const client = clientApollo;
    await client.mutate({
      mutation: UPDATE_USUARIO_ADMIN,
      variables: { usuarioId: id, token, password, ...camposDeUsuario },
    });
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    // En un caso real, aqui se podria revertir el cambio optimista
  }
}
