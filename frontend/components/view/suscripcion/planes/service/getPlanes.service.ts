import { clientApollo } from "@/functions";
import GET_PLANES from "../querys/GET_PLANES";
import usePlanesStore from "../store/planesStore";

import { isProd } from "@/env";

import notify from "@/components/nano/notify";

export async function getPlanesService() {
  console.log("getPlanesService");
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
    const planes: any[] = data?.getPlanes?.data ?? [];
    console.log("planes:", planes);
    setPlanes(planes);

    // if (data?.getPlanes?.type && data?.getPlanes?.message) {
    //   notify({ type: data.getPlanes.type, message: data.getPlanes.message });
    // }
  } catch (err: any) {
    if (!isProd) {
      console.warn("Fallo la query, cargando datos mock:", err);
 
    } else {
      notify({ type: "error", message: err.message || "Error al obtener los planes. Intenta nuevamente." });
    }
  } finally {
    setCargando(false);
  }
}
