import { clientApollo } from "@/functions";
import { UPDATE_SUSCRIPCION_EVENTO_ESTATUS } from "../query";
import useSuscripcionEventoStore from "../store/suscripcionEventoStore";
import notify from "@/components/nano/notify";
import { EstatusPagoEvento } from "@/global/enums";

interface UpdateEstatusSuscripcionEventoParams {
  suscripcionEventoId: number;
  estatus: EstatusPagoEvento;
}

export const updateEstatusSuscripcionEventoService = async ({
  suscripcionEventoId,
  estatus,
}: UpdateEstatusSuscripcionEventoParams) => {
  const { actualizarEstatusSuscripcion } = useSuscripcionEventoStore.getState();

  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";

    const result = await clientApollo.mutate({
      mutation: UPDATE_SUSCRIPCION_EVENTO_ESTATUS,
      variables: {
        token,
        suscripcionEventoId,
        estatus,
      },
    });

    const data = (result.data as any)?.actualizarSuscripcionEventoEstatus;

    if (data.type === "error") {
      notify({ type: "error", message: data.message });
      return;
    }

    // Actualización optimista
    actualizarEstatusSuscripcion(suscripcionEventoId, estatus);
    notify({ type: "success", message: data.message });
  } catch (error) {
    console.error("Error al actualizar estatus de suscripción de evento:", error);
    notify({
      type: "error",
      message: "Error al actualizar el estatus",
    });
  }
};

export default updateEstatusSuscripcionEventoService;
