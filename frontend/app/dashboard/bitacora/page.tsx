'use client'
import React from 'react'
import Bitacora from '@/components/view/bitacora'
import LayoutAuth from '@/components/layout/auth'
import "./css/style.scss"

interface pageProps {

}

const page: React.FC<pageProps> = () => {
    return (
        <LayoutAuth where='dashboard'>
            <Bitacora />
        </LayoutAuth>
    );
}

export default page;