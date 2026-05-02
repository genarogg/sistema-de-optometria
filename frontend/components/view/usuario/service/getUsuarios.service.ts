import { clientApollo } from "@/functions";
import GET_USUARIOS from "../querys/GET_USUARIOS";
import useUsuariosStore from "../store/usuariosStore";
import USUARIOS_MOCK from "../fake/usuarios.mock";
import { isProd } from "@/env";
import { Rol } from "@/global/enums";

interface GetUsuariosParams {
  filtro?: string;
}

interface UsuarioRaw {
  id: string;
  primerNombre: string;
  primerApellido: string;
  email: string;
  cedula: string;
  telefono: string | null;
  rol: Rol;
}

export async function getUsuariosService({ filtro = "" }: GetUsuariosParams = {}) {
  const { setUsuarios, setCargando, setError } = useUsuariosStore.getState();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  setCargando(true);
  setError(null);

  try {
    const client = clientApollo;
    const result = await client.query({
      query: GET_USUARIOS,
      variables: { token, filtro: filtro || undefined },
    });

    const data = result.data as any;
    const usuarios: UsuarioRaw[] = data?.getUsuarios?.data ?? [];
    setUsuarios(usuarios);
  } catch (err) {
    if (!isProd) {
      console.warn("Fallo la query, cargando datos mock:", err);
      setUsuarios(USUARIOS_MOCK);
    } else {
      setError("Error al obtener los usuarios. Intenta nuevamente.");
    }
  } finally {
    setCargando(false);
  }
}
