import { clientApollo } from "@/functions";
import GET_EVENTOS_ACTIVOS from "../query/GET_EVENTOS_ACTIVOS";
import useEventosActivosStore from "../store/eventosActivosStore";
import { isProd } from "@/env";
import notify from "@/components/nano/notify";

export async function getEventosActivosService() {
  console.log("getEventosActivosService");
  const { setEventos, setSuscripcionesEventoUsuario, setCargando, setError, paginaActual, itemsPorPagina, filtro, tipoFiltro, setTotalPaginas } = useEventosActivosStore.getState();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  setCargando(true);
  setError(null);
  
  try {
    const client = clientApollo;
    const result = await client.query({
      query: GET_EVENTOS_ACTIVOS,
      variables: {
        token,
        page: paginaActual,
        pageSize: itemsPorPagina,
        filtro: filtro || undefined,
        tipo: tipoFiltro || undefined
      },
    });

    const data = result.data as any;
    const responseData = data?.getEventosActivos?.data;
    const meta = data?.getEventosActivos?.meta ?? { total: 0, limit: itemsPorPagina };
    const totalPaginasCalculadas = Math.ceil(meta.total / meta.limit);

    const eventos: any[] = responseData?.eventos ?? [];
    const suscripcionesEventoUsuario: any[] = responseData?.suscripcionesEventoUsuario ?? [];

    setEventos(eventos);
    setSuscripcionesEventoUsuario(suscripcionesEventoUsuario);
    setTotalPaginas(totalPaginasCalculadas);

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
