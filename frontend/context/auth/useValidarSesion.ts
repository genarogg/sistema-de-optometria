import { useEffect, useRef } from "react";
import { useApolloClient } from '@apollo/client/react';
import { VALIDAR_SESION } from "@/query";
import { useAuthStore } from "./AuthContext";
import { usePathname, useRouter } from 'next/navigation';
import { Usuario } from "@/global/prismaTypes";

const useValidarSesion = () => {
    const client = useApolloClient();
    const { setLogin, logout, setLoading } = useAuthStore();
    const hasRun = useRef(false);
    const navigate = useRouter();
    const location = usePathname();
    const pendingLogin = useRef<{ usuario: Usuario | null; token: string } | null>(null);

    // Efecto para validar sesión
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const validar = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.log("No hay token");

                    if (location?.startsWith("/dashboard")) {
                        navigate.push("/dashboard/login");
                    }

                    logout();
                    return;
                }

                const response = await client.query({
                    query: VALIDAR_SESION,
                    variables: { token },
                    fetchPolicy: 'no-cache',
                });

                console.log(response)
                const data: any = response.data;

                console.log("validacion data: ", data)

                if (!data?.validarSesion) {
                    logout();
                    return;
                }

                const datos = data.validarSesion.data;

                const usuario = {
                    ...datos
                }

                // Guardamos temporalmente para login posterior
                pendingLogin.current = { usuario, token };

                // Si estamos en la página de inicio, redirigimos
                if (location === "/dashboard/login") {
                    navigate.push("/dashboard");
                }

                else {
                    setLogin({
                        usuario,
                        token
                    });
                }

            } catch (err) {
                console.error(err);
                logout();
                setLoading(false);
            }
        };

        validar();
    }, []);

    useEffect(() => {
        if (pendingLogin.current && location === "/dashboard") {
            setLogin(pendingLogin.current);
            pendingLogin.current = null;
        }
    }, [location, setLogin]);
};

export default useValidarSesion;
