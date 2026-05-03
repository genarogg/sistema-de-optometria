'use client'
import React from 'react'
import { Eye } from "lucide-react";

interface TitleProps { }

const Title: React.FC<TitleProps> = () => {
    return (
        <div className="titulo">
            <a href="#" className="flex items-center gap-2 font-display font-bold">
                {/* Desktop: Icono + CVO */}
                <div className="hidden md:flex items-center gap-2">
                    <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-hero text-primary-foreground shadow-soft shrink-0">
                        <Eye className="w-4 h-4" />
                    </span>
                    <span className="text-foreground text-base">CVO</span>
                </div>

                {/* Móvil: Nombre completo en dos líneas */}
                <div className="flex md:hidden flex-col leading-tight text-center">
                    <span className="text-primary text-[14px] sm:text-sm font-bold">
                        Colegio de Optometristas
                    </span>
                    <span className="text-primary text-[10px] sm:text-xs opacity-80">
                        de Venezuela
                    </span>
                </div>
            </a>
        </div>
    );
}

export default Title;