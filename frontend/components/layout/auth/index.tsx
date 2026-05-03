import React from 'react'
import Header from "./header"
import Footer from './Footer'
import "./css/layout.scss"

import { OptometrySpinner } from '@/components/ux/spinner';
import { useAuthStore } from '@/context/auth/AuthContext';

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

    const { loading } = useAuthStore((state) => state);

    return (
        <div className={`containerAll clean ${where}`}>
            {loading ? (
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