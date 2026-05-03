'use client'
import React from 'react'
import { LoginForm } from '@/components/view/loginFreya/components/LoginForm'
import LayoutAuth from '@/components/layout/auth'

interface pageProps {

}

const page: React.FC<pageProps> = () => {
    return (
        <LayoutAuth>
            <LoginForm />
        </LayoutAuth>
    );
}

export default page;