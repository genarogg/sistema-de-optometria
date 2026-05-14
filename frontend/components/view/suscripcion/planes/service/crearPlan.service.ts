import { clientApollo } from "@/functions";
import CREAR_PLAN from "../querys/CREAR_PLAN";
import usePlanesStore from '../store/planesStore';
import { TipoSuscripcion } from '@/global/enums';
import { PlanSuscripcion } from '@/global/prismaTypes';
import { isProd } from "@/env";

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
    await client.mutate({
      mutation: CREAR_PLAN,
      variables: { token, tipo, costo },
    });
  } catch (err) {
    console.error("Error al crear el plan:", err);
    setError("Error al crear el plan. Intenta nuevamente.");
    // No revertir cambio optimista por ahora
  }
}
