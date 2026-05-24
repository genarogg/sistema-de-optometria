import { clientApollo } from "@/functions";
import CREAR_SUSCRIPCION from "../querys/CREAR_SUSCRIPCION";
import notify from "@/components/nano/notify";

interface CrearSuscripcionParams {
  planId: number;
  comprobante: number;
  comprobanteImg: string;
}

export async function crearSuscripcionService(params: CrearSuscripcionParams) {
  const token = localStorage.getItem("token")

  console.log(params)
  try {
    const client = clientApollo;
    const result = await client.mutate({
      mutation: CREAR_SUSCRIPCION,
      variables: {
        token,
        planId: params.planId,
        comprobante: params.comprobante,
        comprobanteImg: params.comprobanteImg
      },
    });

    const data = result.data as any;
    if (data?.crearSuscripcion?.type && data?.crearSuscripcion?.message) {
      notify({ type: data.crearSuscripcion.type, message: data.crearSuscripcion.message });
    }

    return data;
  } catch (err: any) {
    notify({ type: "error", message: err.message || "Error al crear la suscripción. Intenta nuevamente." });
    throw err;
  }
}
