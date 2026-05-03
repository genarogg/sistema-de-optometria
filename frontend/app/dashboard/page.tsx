'use client'
import React from 'react'
// import LoginFreya from '@/components/view/'
import LayoutAuth from '@/components/layout/auth'
import "./css/style.scss"

interface pageProps {

}

const page: React.FC<pageProps> = () => {
    return (
        <LayoutAuth where='dashboard'>
            <p>hola</p>
        </LayoutAuth>
    );
}

export default page;