import { clientApollo } from "@/functions";
import GET_EVENTOS_ACTIVOS from "../query/GET_EVENTOS_ACTIVOS";
import useEventosActivosStore from "../store/eventosActivosStore";
import { isProd } from "@/env";
import notify from "@/components/nano/notify";

export async function getEventosActivosService() {
  console.log("getEventosActivosService");
  const { setEventos, setSuscripcionesEventoUsuario, setCargando, setError } = useEventosActivosStore.getState();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  setCargando(true);
  setError(null);
  
  try {
    const client = clientApollo;
    const result = await client.query({
      query: GET_EVENTOS_ACTIVOS,
      variables: { 
        token
      },
    });

    const data = result.data as any;
    const responseData = data?.getEventosActivos?.data;
    const eventos: any[] = responseData?.eventos ?? [];
    const suscripcionesEventoUsuario: any[] = responseData?.suscripcionesEventoUsuario ?? [];
    
    console.log("eventos activos:", eventos);
    console.log("suscripciones evento usuario:", suscripcionesEventoUsuario);
    
    setEventos(eventos);
    setSuscripcionesEventoUsuario(suscripcionesEventoUsuario);

    // if (data?.getEventosActivos?.type && data?.getEventosActivos?.message) {
    //   notify({ type: data.getEventosActivos.type, message: data.getEventosActivos.message });
    // }
  } catch (err: any) {
    if (!isProd) {
      console.warn("Fallo la query:", err);
    } else {
      notify({ type: "error", message: err.message || "Error al obtener los eventos activos. Intenta nuevamente." });
    }
  } finally {
    setCargando(false);
  }
}
