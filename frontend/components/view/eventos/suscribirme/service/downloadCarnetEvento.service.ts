import { clientApollo } from "@/functions";
import GET_CARNET_PONENTE from "../query/GET_CARNET_PONENTE";
import notify from "@/components/nano/notify";
import { isProd } from "@/env";

interface DownloadCarnetEventoProps {
  eventoId: number;
  setDownloading: (downloading: boolean) => void;
}

export default async function downloadCarnetEventoService({
  eventoId,
  setDownloading,
}: DownloadCarnetEventoProps) {
  setDownloading(true);

  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

    const client = clientApollo;
    const result = await client.query({
      query: GET_CARNET_PONENTE,
      variables: {
        token,
        eventoId,
      },
    });

    const data = result.data as any;
    const carnetBase64 = data?.getCarnetEvento?.data;

    if (carnetBase64) {
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${carnetBase64}`;
      link.download = `carnet_evento_${eventoId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      notify({ type: "success", message: "Carnet descargado correctamente" });
    } else {
      notify({ type: "error", message: "No se pudo obtener el carnet." });
    }

    if (data?.getCarnetEvento?.type && data?.getCarnetEvento?.message) {
      notify({ type: data.getCarnetEvento.type, message: data.getCarnetEvento.message });
    }
  } catch (err: any) {
    if (!isProd) {
      console.error("Error al descargar carnet:", err);
    }
    notify({ type: "error", message: err.message || "Error al descargar el carnet." });
  } finally {
    setDownloading(false);
  }
}
