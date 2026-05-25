import { clientApollo } from "@/functions";
import { GET_SUSCRIPCIONES_EVENTO } from "../query";
import useSuscripcionEventoStore from "../store/suscripcionEventoStore";
import notify from "@/components/nano/notify";

interface GetSuscripcionesEventoParams {
  filtro?: string;
  estatus?: string | null;
  eventoId?: number | null;
  pagina?: number;
}

export const getSuscripcionesEventoService = async ({
  filtro = "",
  estatus = null,
  eventoId = null,
  pagina = 1,
}: GetSuscripcionesEventoParams = {}) => {
  const { setSuscripciones, setMeta, setCargando, setError } =
    useSuscripcionEventoStore.getState();

  setCargando(true);
  setError(null);

  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    const result = await clientApollo.query({
      query: GET_SUSCRIPCIONES_EVENTO,
      variables: {
        token,
        page: pagina,
        pageSize: 20,
        filtro: filtro || undefined,
        estatus: estatus || undefined,
        eventoId: eventoId || undefined,
      },
      fetchPolicy: "no-cache",
    });

    const data = (result.data as any)?.getSuscripcionesEvento;

    if (data.type === "error") {
      notify({ type: "error", message: data.message });
      setError(data.message);
      return;
    }

    setSuscripciones(data.data || []);
    setMeta(data.meta);
  } catch (error) {
    console.error("Error al obtener suscripciones de eventos:", error);
    const errorMessage = "Error al obtener suscripciones de eventos";
    setError(errorMessage);
    notify({ type: "error", message: errorMessage });
  } finally {
    setCargando(false);
  }
};

export default getSuscripcionesEventoService;
