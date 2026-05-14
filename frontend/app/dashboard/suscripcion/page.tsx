'use client'
import React from 'react'
import Suscripcion from '@/components/view/suscripcion'
import LayoutAuth from '@/components/layout/auth'
import "./css/style.scss"

interface pageProps {

}

const page: React.FC<pageProps> = () => {
    return (
        <LayoutAuth where='dashboard'>
            <Suscripcion />
        </LayoutAuth>
    );
}

export default page;