import { clientApollo } from "@/functions";
import UPDATE_PLAN from "../querys/UPDATE_PLAN";
import usePlanesStore from "../store/planesStore";
import { TipoSuscripcion } from "@/global/enums";

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
    await client.mutate({
      mutation: UPDATE_PLAN,
      variables: {
        token,
        planId,
        tipo,
        costo,
        isActivo,
      },
    });
  } catch (err) {
    console.error("Error al actualizar el plan:", err);
    setError("Error al actualizar el plan. Intenta nuevamente.");
  }
}
