'use client'
import React from 'react'
import LoginFreya  from '@/components/view/loginFreya/components/index'
import LayoutAuth from '@/components/layout/auth'
import "./css/style.scss"

interface pageProps {

}

const page: React.FC<pageProps> = () => {
    return (
        <LayoutAuth where='login'>
            <LoginFreya />
        </LayoutAuth>
    );
}

export default page;