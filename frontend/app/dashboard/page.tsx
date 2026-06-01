'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import LoginFreya from '@/components/view/'
import LayoutAuth from '@/components/layout/auth'
import "./css/style.scss"

interface pageProps {

}

const Page: React.FC<pageProps> = () => {
    const router = useRouter()

    useEffect(() => {
        router.push('/dashboard/evento')
    }, [router])

    return (
        <LayoutAuth where='dashboard'>
            <p>hola</p>
        </LayoutAuth>
    );
}

export default Page;