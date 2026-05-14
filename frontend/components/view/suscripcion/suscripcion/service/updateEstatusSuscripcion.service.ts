import { clientApollo } from "@/functions";
import UPDATE_SUSCRIPCION_ESTATUS from "../querys/UPDATE_SUSCRIPCION_ESTATUS";
import useSuscripcionStore from "../store/suscripcionStore";
import { EstatusSuscripcion } from "@/global/enums";
import { isProd } from "@/env";

interface UpdateEstatusSuscripcionParams {
  suscripcionId: number;
  nuevoEstatus: EstatusSuscripcion;
}

export async function updateEstatusSuscripcionService({
  suscripcionId,
  nuevoEstatus,
}: UpdateEstatusSuscripcionParams) {
  const { actualizarEstatusSuscripcion } = useSuscripcionStore.getState();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  // Actualización optimista
  actualizarEstatusSuscripcion(suscripcionId, nuevoEstatus);

  try {
    const client = clientApollo;
    await client.mutate({
      mutation: UPDATE_SUSCRIPCION_ESTATUS,
      variables: {
        token,
        suscripcionId,
        estatus: nuevoEstatus,
      },
    });
  } catch (err) {
    console.error("Error al actualizar estatus:", err);
    // Aqui podrias hacer un rollback si lo deseas
    if (!isProd) {
      console.warn("Fallo la mutacion de actualizar estatus");
    }
  }
}
