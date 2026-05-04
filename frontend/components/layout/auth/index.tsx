import React from 'react'
import Header from "./header"
import Footer from './Footer'
import { usePathname } from 'next/navigation';
import "./css/layout.scss"

import { OptometrySpinner } from '@/components/ux/spinner';
import { useAuthStore } from '@/context/auth/AuthContext';
import useValidarSesion from "@/context/auth/useValidarSesion"

interface LayoutProps {
    children: React.ReactNode;
    where?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    where = "",
    header,
    footer
}) => {

    const { loading, isAuthenticated } = useAuthStore((state) => state);
    const pathname = usePathname();

    const isDashboardRoute =
        pathname.startsWith("/dashboard") &&
        pathname !== "/dashboard/login";

    // Si es ruta dashboard, mostramos spinner mientras loading o isAuthenticated=false
    const showSpinner = isDashboardRoute ? loading || !isAuthenticated : loading;
    useValidarSesion();

    return (
        <div className={`containerAll clean ${where}`}>
            {showSpinner ? (
                <OptometrySpinner />
            ) : (
                <>
                    {header ? header : <Header />}
                    <main>
                        {children}
                    </main>
                    {footer ? footer : <Footer />}
                </>
            )}
        </div>
    );
}

export default Layout;