'use client'
import React from 'react'
import LayoutSimple from "@/components/layout/simple";
import Hero from './components/utils/Hero'
import Valores from './components/utils/Valores'
import MisionVision from './components/utils/MisionVision'
import LineasAccion from './components/utils/LineasAccion';
import DondeEstudiar from './components/utils/DondeEstudiar';
import Congresos from './components/utils/Congresos';

interface HomeProps {

}

const Home: React.FC<HomeProps> = () => {
    return (
        <LayoutSimple>
            <Hero />
            <MisionVision />
            <Valores />
            <LineasAccion />
            <DondeEstudiar />
            <Congresos />
        </LayoutSimple>
    );
}

export default Home;