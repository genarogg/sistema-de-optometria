import { clientApollo } from "@/functions";
import GET_CERTIFICADO from "../../suscripciones/query/GET_CERTIFICADO";
import { decodeBase64Pdf } from "@react-pdf-levelup/core";
import { toast } from "sonner";
import { notify } from "@/components/nano";
import { TipoEvento } from "@/global/enums";

interface DownloadCertificadoParams {
    eventoId: number;
    usuario: {
        primerNombre: string;
        primerApellido: string;
    };
    evento: {
        tipo: TipoEvento;
        nombre: string;
    };
    setDownloading: (isDownloading: boolean) => void;
}

const downloadCertificadoService = async ({
    eventoId,
    usuario,
    evento,
    setDownloading,
}: DownloadCertificadoParams) => {
    const downloadPromise = (async () => {
        try {
            setDownloading(true);

            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;

            if (!token) {
                throw new Error("No se encontró el token de usuario.");
            }

            const result = await clientApollo.query({
                query: GET_CERTIFICADO,
                variables: {
                    token,
                    eventoId,
                },
                fetchPolicy: "no-cache",
            });

            console.log("result", result);

            interface GetCertificadoResponse {
                type: 'success' | 'error';
                message: string;
                data: string;
            }

            interface ApolloQueryResult {
                getCertificado: GetCertificadoResponse;
            }

            const data = (result.data as ApolloQueryResult)?.getCertificado;

            if (data.type === "error") {
                notify({
                    type: data.type,
                    message: data.message,
                });
                return data.message;
            }

            const filename = `${usuario.primerNombre}_${usuario.primerApellido}_certificado_${evento.tipo.toLowerCase()}.pdf`;
            decodeBase64Pdf(data.data, filename);

            return {
                tipo: evento.tipo.toLowerCase(),
            };
        } catch (error) {
            console.error("Error descargando certificado:", error);
            throw error;
        } finally {
            setDownloading(false);
        }
    })();

    toast.promise(downloadPromise, {
        loading: "Generando certificado...",
        success: (data) => {
            return `Descarga de certificado de ${evento.tipo.toLowerCase()} iniciada con éxito.`;
        },
        error: (err) => {
            return err?.message || "Error al descargar el certificado. Por favor, intenta de nuevo.";
        },
    });

    return downloadPromise;
};

export default downloadCertificadoService;
