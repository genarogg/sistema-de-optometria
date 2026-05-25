import { clientApollo } from "@/functions";
import ACTUALIZAR_EVENTO from "../query/ACTUALIZAR_EVENTO";
import useEventosStore from "../store/eventosStore";
import { getEventosService } from "./getEventos.service";
import { isProd } from "@/env";
import notify from "@/components/nano/notify";

interface PonenteInput {
  id: number;
  isActivo: boolean;
}

interface ActualizarEventoParams {
  eventoId: number;
  nombre?: string;
  fecha?: Date;
  lugar?: string;
  costo?: number;
  tipo?: string;
  descuentoEstudiante?: number;
  descuentoProfesor?: number;
  vigencia?: string;
  ponentes?: PonenteInput[];
}

export async function actualizarEventoService(params: ActualizarEventoParams) {
  const { actualizarEvento } = useEventosStore.getState();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  try {
    const client = clientApollo;
    const result = await client.mutate({
      mutation: ACTUALIZAR_EVENTO,
      variables: {
        token,
        ...params,
      },
    });

    const data = result.data as any;
    const evento = data?.actualizarEvento?.data;

    if (evento) {
      actualizarEvento(evento.id, evento);
    }

    if (data?.actualizarEvento?.type && data?.actualizarEvento?.message) {
      notify({ type: data.actualizarEvento.type, message: data.actualizarEvento.message });
    }

    await getEventosService();
  } catch (err: any) {
    if (!isProd) {
      console.warn("Fallo la mutación:", err);
    } else {
      notify({ type: "error", message: err.message || "Error al actualizar el evento. Intenta nuevamente." });
    }
    throw err;
  }
}
