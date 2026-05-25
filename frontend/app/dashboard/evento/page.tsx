'use client'
import React from 'react'
import LoginFreya from '@/components/view/eventos'
import LayoutAuth from '@/components/layout/auth'
import "./css/style.scss"


interface pageProps {

}

const page: React.FC<pageProps> = () => {
    return (
        <LayoutAuth where='evento'>
            <LoginFreya />
        </LayoutAuth>
    );
}

export default page;