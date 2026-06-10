import { clientApollo } from "@/functions";
import GET_EVENTOS from "../query/GET_EVENTOS";
import useEventosStore from "../store/eventosStore";
import { isProd } from "@/env";
import notify from "@/components/nano/notify";

export async function getEventosService() {
  console.log("getEventosService");
  const { setEventos, setCargando, setError, paginaActual, itemsPorPagina, filtro, vigenciaFiltro, tipoFiltro, setTotalPaginas } = useEventosStore.getState();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  setCargando(true);
  setError(null);
  
  try {
    const client = clientApollo;
    const result = await client.query({
      query: GET_EVENTOS,
      variables: { 
        token, 
        page: paginaActual, 
        pageSize: itemsPorPagina,
        filtro: filtro || undefined,
        vigencia: vigenciaFiltro || undefined,
        tipo: tipoFiltro || undefined
      },
    });

    const data = result.data as any;
    const eventos: any[] = data?.getEventos?.data ?? [];
    const meta = data?.getEventos?.meta ?? { total: 0, limit: itemsPorPagina };
    const totalPaginasCalculadas = Math.ceil(meta.total / meta.limit);

    console.log("eventos:", eventos);
    setEventos(eventos);
    setTotalPaginas(totalPaginasCalculadas);

    if (data?.getEventos?.type && data?.getEventos?.message) {
      notify({ type: data.getEventos.type, message: data.getEventos.message });
    }
  } catch (err: any) {
    if (!isProd) {
      console.warn("Fallo la query, cargando datos mock:", err);
    } else {
      notify({ type: "error", message: err.message || "Error al obtener los eventos. Intenta nuevamente." });
    }
  } finally {
    setCargando(false);
  }
}
