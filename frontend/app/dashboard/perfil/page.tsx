'use client'
import React from 'react'
import Perfil from '@/components/view/perfil'
import LayoutAuth from '@/components/layout/auth'
import "./css/style.scss"

interface pageProps {

}

const page: React.FC<pageProps> = () => {
    return (
        <LayoutAuth where='dashboard'>
            <Perfil />
        </LayoutAuth>
    );
}

export default page;