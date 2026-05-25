import { clientApollo } from "@/functions";
import GET_CARNET_PONENTE from "../query/GET_CARNET_PONENTE";
import { decodeBase64Pdf } from "@react-pdf-levelup/core";
import { toast } from "sonner";
import { notify } from "@/components/nano";

interface DownloadCarnetPonenteParams {
    usuarioId: number;
    eventoId: number;
    usuario: {
        primerNombre: string;
        primerApellido: string;
    };
    setDownloading: (isDownloading: boolean) => void;
}

const downloadCarnetPonenteService = async ({
    usuarioId,
    eventoId,
    usuario,
    setDownloading,
}: DownloadCarnetPonenteParams) => {
    const downloadPromise = (async () => {
        try {
            setDownloading(true);

            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;

            if (!token) {
                throw new Error("No se encontró el token de usuario.");
            }

            const result = await clientApollo.query({
                query: GET_CARNET_PONENTE,
                variables: {
                    token,
                    usuarioId,
                    eventoId,
                },
                fetchPolicy: "no-cache",
            });

            console.log("result", result);

            const data = result.data?.getCarnetEvento;

            if (data.type === "error") {
                notify({
                    type: data.type,
                    message: data.message,
                });
                return;
            }

            const filename = `${usuario.primerNombre}_${usuario.primerApellido}_carnet_ponente.pdf`;
            decodeBase64Pdf(data.data, filename);

            return {
                tipo: "carnet_ponente",
            };
        } catch (error) {
            console.error("Error descargando carnet de ponente:", error);
            throw error;
        } finally {
            setDownloading(false);
        }
    })();

    toast.promise(downloadPromise, {
        loading: "Generando carnet...",
        success: () => {
            return "Descarga de carnet iniciada con éxito.";
        },
        error: (err) => {
            return err?.message || "Error al descargar el carnet. Por favor, intenta de nuevo.";
        },
    });

    return downloadPromise;
};

export default downloadCarnetPonenteService;
