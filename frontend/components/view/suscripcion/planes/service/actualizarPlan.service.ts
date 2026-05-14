import { clientApollo } from "@/functions";
import UPDATE_PLAN from "../querys/UPDATE_PLAN";
import usePlanesStore from "../store/planesStore";
import { TipoSuscripcion } from "@/global/enums";
import notify from "@/components/nano/notify";

interface ActualizarPlanParams {
  planId: number;
  tipo?: TipoSuscripcion;
  costo?: number;
  isActivo?: boolean;
}

export async function actualizarPlanService({
  planId,
  tipo,
  costo,
  isActivo,
}: ActualizarPlanParams) {
  const { actualizarPlan, setError } = usePlanesStore.getState();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  // Actualizar optimistamente
  actualizarPlan(planId, {
    ...(tipo && { tipo }),
    ...(costo !== undefined && { costo }),
    ...(isActivo !== undefined && { isActivo }),
  });

  setError(null);

  try {
    const client = clientApollo;
    const { data } = await client.mutate({
      mutation: UPDATE_PLAN,
      variables: {
        token,
        planId,
        tipo,
        costo,
        isActivo,
      },
    });

    const response = data as any;
    if (response?.updatePlan) {
      const { type, message } = response.updatePlan;
      notify({ type, message });
    }
  } catch (err: any) {
    console.error("Error al actualizar el plan:", err);
    notify({ type: "error", message: err.message || "Error al actualizar el plan. Intenta nuevamente." });
  }
}
