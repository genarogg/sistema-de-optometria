import { clientApollo } from "@/functions";
import CREAR_EVENTO from "../query/CREAR_EVENTO";
import useEventosStore from "../store/eventosStore";
import { isProd } from "@/env";
import notify from "@/components/nano/notify";

interface PonenteInput {
  id: number;
  isActivo: boolean;
}

interface CrearEventoParams {
  nombre: string;
  fecha: Date;
  lugar: string;
  costo: number;
  tipo: string;
  descuentoEstudiante?: number;
  descuentoProfesor?: number;
  vigencia?: string;
  ponentes?: PonenteInput[];
  aliadoInstitucionImg?: string;
  aliadoInstitucionNombre?: string;
  aliadoAutorizoFirmaImg?: string;
  aliadoAutorizoNombreFirma?: string;
  aliadoAutorizoCargo?: string;
}

export async function crearEventoService(params: CrearEventoParams) {
  const { agregarEvento } = useEventosStore.getState();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  try {
    const client = clientApollo;
    const result = await client.mutate({
      mutation: CREAR_EVENTO,
      variables: {
        token,
        ...params,
      },
    });

    const data = result.data as any;
    const evento = data?.crearEvento?.data;

    if (evento) {
      agregarEvento(evento);
    }

    if (data?.crearEvento?.type && data?.crearEvento?.message) {
      notify({ type: data.crearEvento.type, message: data.crearEvento.message });
    }
  } catch (err: any) {
    if (!isProd) {
      console.warn("Fallo la mutación:", err);
    } else {
      notify({ type: "error", message: err.message || "Error al crear el evento. Intenta nuevamente." });
    }
    throw err;
  }
}
