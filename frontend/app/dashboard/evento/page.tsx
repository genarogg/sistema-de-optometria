'use client'
import React from 'react'
import LoginFreya from '@/components/view/loginFreya'
import LayoutAuth from '@/components/layout/auth'
import "./css/style.scss"

interface pageProps {

}

const page: React.FC<pageProps> = () => {
    return (
        <LayoutAuth where='evento'>
            <p>evento</p>
        </LayoutAuth>
    );
}

export default page;