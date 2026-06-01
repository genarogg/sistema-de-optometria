import { clientApollo } from "@/functions";
import SUSCRIBIRSE_EVENTO from "../query/SUSCRIBIRSE_EVENTO";
import { isProd } from "@/env";
import notify from "@/components/nano/notify";

interface SuscribirseEventoParams {
  eventoId: number;
  comprobante: string;
  comprobanteImg: string;
  onSuccess?: () => void;
}

export async function suscribirseEventoService({ eventoId, comprobante, comprobanteImg, onSuccess }: SuscribirseEventoParams) {
  console.log("suscribirseEventoService");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  
  try {
    const client = clientApollo;
    const result = await client.mutate({
      mutation: SUSCRIBIRSE_EVENTO,
      variables: { 
        token,
        eventoId,
        comprobante,
        comprobanteImg
      },
    });

    const data = result.data as any;

    if (data?.suscribirseEvento?.type && data?.suscribirseEvento?.message) {
      notify({ type: data.suscribirseEvento.type, message: data.suscribirseEvento.message });
    }

    onSuccess?.();
  } catch (err: any) {
    if (!isProd) {
      console.warn("Fallo la mutación:", err);
    } else {
      notify({ type: "error", message: err.message || "Error al suscribirse al evento. Intenta nuevamente." });
    }
  }
}
