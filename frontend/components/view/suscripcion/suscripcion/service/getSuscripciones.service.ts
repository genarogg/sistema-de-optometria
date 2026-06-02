import { clientApollo } from "@/functions";
import GET_SUSCRIPCIONES from "../querys/GET_SUSCRIPCIONES";
import useSuscripcionStore from "../store/suscripcionStore";
import SUSCRIPCIONES_MOCK from "../fake/suscripciones.mock";
import { isProd } from "@/env";
import type { Suscripcion, SuscripcionMeta } from "../store/suscripcionStore";
import { EstatusSuscripcion } from "@/global/enums";

interface GetSuscripcionesParams {
  filtro?: string;
  pagina?: number;
  estatus?: EstatusSuscripcion | null | "todos";
}

export async function getSuscripcionesService({
  filtro = "",
  pagina = 1,
  estatus,
}: GetSuscripcionesParams = {}) {
  const { setSuscripciones, setMeta, setCargando, setError } =
    useSuscripcionStore.getState();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  setCargando(true);
  setError(null);

  try {
    const client = clientApollo;
    const result = await client.query({
      query: GET_SUSCRIPCIONES,
      variables: { 
        token, 
        filtro: filtro || undefined,
        pagina: pagina || 1,
        estatus: estatus === null ? undefined : estatus,
      },
    });

    console.log("Resultado de getSuscripciones:", result);

    const data = result.data as any;
    const suscripciones: Suscripcion[] = data?.getSuscripciones?.data ?? [];
    const meta: SuscripcionMeta = data?.getSuscripciones?.meta ?? {
      total: 0,
      page: 1,
      limit: 10,
    };

    setSuscripciones(suscripciones);
    setMeta(meta);
  } catch (err) {
    if (!isProd) {
      console.warn("Fallo la query, cargando datos mock:", err);
      // setSuscripciones(SUSCRIPCIONES_MOCK);
      setMeta({
        total: SUSCRIPCIONES_MOCK.length,
        page: 1,
        limit: 10,
      });
    } else {
      setError(
        "Error al obtener las suscripciones. Intenta nuevamente."
      );
    }
  } finally {
    setCargando(false);
  }
}
