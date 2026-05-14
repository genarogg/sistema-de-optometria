import { clientApollo } from "@/functions";
import GET_PLANES from "../querys/GET_PLANES";
import usePlanesStore from "../store/planesStore";
import PLANES_MOCK from "../fake/planes.mock";
import { isProd } from "@/env";
import type { Plan } from "../store/planesStore";

export async function getPlanesService() {
  const { setPlanes, setCargando, setError } = usePlanesStore.getState();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  setCargando(true);
  setError(null);

  try {
    const client = clientApollo;
    const result = await client.query({
      query: GET_PLANES,
      variables: { token },
    });

    const data = result.data as any;
    const planes: Plan[] = data?.getPlanes?.data ?? [];
    setPlanes(planes);
  } catch (err) {
    if (!isProd) {
      console.warn("Fallo la query, cargando datos mock:", err);
      setPlanes(PLANES_MOCK);
    } else {
      setError("Error al obtener los planes. Intenta nuevamente.");
    }
  } finally {
    setCargando(false);
  }
}
