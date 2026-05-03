'use client'
import React from 'react'
import Usuarios from '@/components/view/usuario'
import LayoutAuth from '@/components/layout/auth'
import "./css/style.scss"

interface pageProps {

}

const page: React.FC<pageProps> = () => {
    return (
        <LayoutAuth where='dashboard'>
            <Usuarios />
        </LayoutAuth>
    );
}

export default page;