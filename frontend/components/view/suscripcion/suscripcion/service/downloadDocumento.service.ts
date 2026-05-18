import { clientApollo } from "@/functions";
import { GET_SOLVENCIA_CARNET } from "@/query";
import { decodeBase64Pdf } from "@react-pdf-levelup/core";
import { toast } from "sonner";
import { TipoDeDocumento } from "@/global/enums";
import { notify } from "@/components/nano";

interface DownloadDocumentoParams {
    tipo: TipoDeDocumento;
    suscripcionId: number;
    usuario: {
        primerNombre: string;
        primerApellido: string;
    };
    setDownloading: (tipo: TipoDeDocumento, isDownloading: boolean) => void;
}

const downloadDocumentoService = async ({
    tipo,
    suscripcionId,
    usuario,
    setDownloading,
}: DownloadDocumentoParams) => {
    const downloadPromise = (async () => {
        try {
            setDownloading(tipo, true);

            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;

            if (!token) {
                throw new Error("No se encontró el token de usuario.");
            }

            const result = await clientApollo.query({
                query: GET_SOLVENCIA_CARNET,
                variables: {
                    token,
                    tipoDeDocumento: tipo,
                    suscripcionId,
                },
                fetchPolicy: "no-cache",
            });

            console.log("result", result);

            interface GetCarnetSolvenciaResponse {
                type: 'success' | 'error';
                message: string;
                data: string;
            }

            interface ApolloQueryResult {
                getCarnetSolvencia: GetCarnetSolvenciaResponse;
            }

            const data = (result.data as ApolloQueryResult)?.getCarnetSolvencia;

            if (data.type === "error") {
                notify({
                    type: data.type,
                    message: data.message,
                });
                return;
            }

            const filename = `${usuario.primerNombre}_${usuario.primerApellido}_${tipo.toLowerCase()}.pdf`;
            decodeBase64Pdf(data.data, filename);

            return {
                tipo: tipo.toLowerCase(),
            };
        } catch (error) {
            console.error("Error descargando documento:", error);
            throw error;
        } finally {
            setDownloading(tipo, false);
        }
    })();

    toast.promise(downloadPromise, {
        loading: "Generando documento...",
        success: (data) => {
            return `Descarga de iniciada con éxito.`;
        },
        error: (err) => {
            return err?.message || "Error al descargar el documento. Por favor, intenta de nuevo.";
        },
    });

    return downloadPromise;
}


export default downloadDocumentoService;
