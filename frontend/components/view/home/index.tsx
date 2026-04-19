'use client'
import React from 'react'
import LayoutSimple from "@/components/layout/simple";
import Hero from './components/utils/Hero'
import Valores from './components/utils/Valores'
import MisionVision from './components/utils/MisionVision'

interface HomeProps {

}

const Home: React.FC<HomeProps> = () => {
    return (
        <LayoutSimple>
            <Hero />
            <MisionVision />
            <Valores />
        </LayoutSimple>
    );
}

export default Home;