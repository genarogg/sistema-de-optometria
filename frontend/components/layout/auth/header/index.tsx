import React from "react";
import "./css/header.scss";

import { BtnFreya } from "@/components/ux";

import Title from "./Title";
import SideBar from "./sidebar";

import Nav from "../nav";
import { useAuthStore } from "@/context/auth/AuthContext";

interface HeaderProps {
    children?: React.ReactNode;
    where?: string;
}

const Header: React.FC<HeaderProps> = () => {

    const { isAuthenticated, logout } = useAuthStore((state) => state);

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
        { href: "/dashboard/perfil", label: "Perfil", visible: isAuthenticated },
        { href: "/dashboard/usuarios", label: "Usuarios", visible: isAuthenticated },
        { href: "/dashboard/bitacora", label: "bitacora", visible: isAuthenticated },
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
                <Nav menuItems={menuItems} />
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
                    </ul>
                    <SideBar
                        logoutfn={() => { btnRemove(); toggleAside(); }}
                    >
                        <Nav
                            menuItems={menuItems}
                            onClick={() => { btnRemove(); toggleAside(); }}
                        />
                    </SideBar>
                </nav>
            </div>

        </header>
    );
};

export default Header;
