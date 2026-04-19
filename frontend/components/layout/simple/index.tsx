'use client'
import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

interface LayoutSimpleProps {
    children: React.ReactNode
}

const LayoutSimple: React.FC<LayoutSimpleProps> = ({ children }) => {
    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </>
    );
}

export default LayoutSimple;