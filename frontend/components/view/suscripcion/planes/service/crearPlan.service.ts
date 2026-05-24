import { clientApollo } from "@/functions";
import CREAR_PLAN from "../querys/CREAR_PLAN";
import usePlanesStore from '../store/planesStore';
import { TipoSuscripcion } from '@/global/enums';
import notify from "@/components/nano/notify";

interface CrearPlanParams {
  tipo: TipoSuscripcion;
  costo: number;
  isActivo?: boolean;
}

export async function crearPlanService({ tipo, costo, isActivo }: CrearPlanParams) {
  const { planes, agregarPlan, setError } = usePlanesStore.getState();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  // Generar ID optimista (mayor ID + 1)

  const nuevoId = Math.max(...planes.map((p) => p.id), 0) + 1;
  const nuevoPlan = {
    id: nuevoId,
    tipo,
    costo,
    isActivo: isActivo ?? true,
  };

  // Agregar optimistamente
  agregarPlan(nuevoPlan);
  setError(null);

  try {
    const client = clientApollo;
    const { data } = await client.mutate({
      mutation: CREAR_PLAN,
      variables: { token, tipo, costo },
    });

    const response = data as any;
    if (response?.crearPlan) {
      const { type, message } = response.crearPlan;
      notify({ type, message });
    }
  } catch (err: any) {
    console.error("Error al crear el plan:", err);
    notify({ type: "error", message: err.message || "Error al crear el plan. Intenta nuevamente." });
    // No revertir cambio optimista por ahora
  }
}
