import React from "react";
import "./css/header.scss";

import { BtnFreya } from "@/components/ux";

import Title from "./Title";
import SideBar from "./sidebar";

import Nav from "../nav";
import { useAuthStore } from "@/context/auth/AuthContext";
import { useRouter } from 'next/navigation';
import { Rol } from "@/global/enums";

interface HeaderProps {
    children?: React.ReactNode;
    where?: string;
}

const Header: React.FC<HeaderProps> = () => {

    const { isAuthenticated, logout, usuario } = useAuthStore((state) => state);

    const isSuperUsuarioOrAdmin = usuario?.rol === Rol.SUPER_USUARIO || usuario?.rol === Rol.ADMINISTRADOR;
    const router = useRouter();
    const btnRemove = () => {
        console.log("btnRemove");
        const btn = document.getElementById("btn-hamburguer-loki");
        btn?.classList.remove("active");
    }

    const toggleAside = () => {
        const container = document.getElementById("container-aside");
        container?.classList.toggle("sidebar-header");
    }

    const menuItems = [
        { href: "/", label: "Inicio", visible: !isAuthenticated },
        { href: "/dashboard/suscripcion", label: "Suscripción", visible: isAuthenticated },
        { href: "/dashboard/perfil", label: "Perfil", visible: isAuthenticated },
        { href: "/dashboard/usuarios", label: "Usuarios", visible: isAuthenticated, role: [Rol.SUPER_USUARIO, Rol.ADMINISTRADOR] },
        { href: "/dashboard/bitacora", label: "bitacora", visible: isAuthenticated, role: [Rol.SUPER_USUARIO] },
        {
            href: "/dashboard/login",
            label: "Salir",
            visible: isAuthenticated,
            onClick: () => { btnRemove(); logout(); }
        },

    ];


    return (
        <header className="header-container">
            <div className="desktop-header">
                <Title />
                <Nav menuItems={menuItems} userRole={usuario?.rol} />
            </div>

            <div className="movile-header">
                <nav>
                    <ul className="elements">
                        <li>
                            <BtnFreya onClick={() => { toggleAside() }} />
                        </li>
                        <li>
                            <Title />
                        </li>
                        <li></li>
                    </ul>
                    <SideBar
                        logoutfn={() => { btnRemove(); logout(); router.push('/dashboard/login'); }}
                    >
                        <Nav
                            userRole={usuario?.rol}
                            menuItems={menuItems}
                            onClick={() => { btnRemove(); }}
                        />
                    </SideBar>
                </nav>
            </div>

        </header>
    );
};

export default Header;
