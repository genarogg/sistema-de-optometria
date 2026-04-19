'use client'
import React from 'react'
import LayoutSimple from "@/components/layout/simple";
import Hero from './components/Hero'
import Valores from './components/Valores'
import MisionVision from './components/MisionVision'
import LineasAccion from './components/LineasAccion';
import DondeEstudiar from './components/DondeEstudiar';
import Congresos from './components/Congresos';
import Colegiarte from './components/Colegiarte';
import Biblioteca from './components/Biblioteca';
import Historia from './components/Historia';
import Autoridades from './components/Autoridades';
import Alianzas from './components/Alianzas';
import Contacto from './components/Contacto';

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
    return (
        <LayoutSimple>
            <Hero />
            <MisionVision />
            <Valores />
            <LineasAccion />
            <DondeEstudiar />
            <Congresos />
            <Colegiarte />
            <Biblioteca />
            <Historia />
            <Autoridades />
            <Alianzas />
            <Contacto />
        </LayoutSimple>
    );
}

export default Home;