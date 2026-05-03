'use client';
import React from 'react'
import { A } from "@/components/nano";
import { Icon } from "@/components/ux";
import "./nav.scss"

interface MenuItem {
  href?: string;
  label?: string;
  component?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  visible?: boolean;
  role?: string | string[];
  children?: MenuItem[]; // 👈 soporte para subniveles
}

interface NavProps {
  className?: string;
  menuItems: MenuItem[];
  onClick?: () => void;
  userRole?: string;
}

/* 
Ejemplo de uso con subniveles:

const menuItems = [
  { href: "/", label: "Inicio", icon: <TiHome /> },

  { 
    label: "Gestión", 
    icon: <MdDashboard />,
    children: [
      { href: "/dashboard/trabajos", label: "Trabajos", role: "admin" },
      { href: "/dashboard/usuarios", label: "Usuarios", role: ["admin", "moderator"] },
      { 
        label: "Reportes",
        children: [
          { href: "/dashboard/reportes/mensuales", label: "Mensuales" },
          { href: "/dashboard/reportes/anuales", label: "Anuales" }
        ]
      }
    ]
  },

  { label: "Salir", onClick: () => borrarToken() }, // sin href, acción directa

  { href: "/login", label: "Login", visible: !isAuthenticated },

  { component: <MiBotonCustom />, onClick: () => borrarToken() }, 
];

const borrarToken = () => {
  localStorage.removeItem("auth_token");
}
*/

const Nav: React.FC<NavProps> = ({
  menuItems,
  className = "",
  onClick,
  userRole
}) => {

  const hasRequiredRole = (item: MenuItem): boolean => {
    if (!item.role) return true;
    if (!userRole) return false;
    return Array.isArray(item.role)
      ? item.role.includes(userRole)
      : item.role === userRole;
  };

  const isItemVisible = (item: MenuItem): boolean =>
    item.visible !== undefined ? item.visible : hasRequiredRole(item);

  const renderMenuItems = (items: MenuItem[]) => (
    <ul>
      {items.filter(isItemVisible).map((item, index) => {
        const content = (
          <>
            {item.icon && (
              <div className="container-icono">
                <Icon icon={item.icon} />
              </div>
            )}
            {item.component ? (
              <div className="container-component">{item.component}</div>
            ) : item.label ? (
              <div className="container-label">
                <label>{item.label}</label>
              </div>
            ) : null}
          </>
        );

        return (
          <li
            key={`${item.href ?? "custom"}-${index}`}
            onClick={() => {
              if (item.onClick) item.onClick();
              if (onClick) onClick();
            }}
          >
            {item.href ? <A href={item.href}>{content}</A> : content}

            {/* 👇 renderiza subniveles */}
            {item.children && item.children.length > 0 && (
              <div className="submenu"
                onClick={() => {
                  if (item.onClick) item.onClick();
                  if (onClick) onClick();
                }}
              >
                {renderMenuItems(item.children)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  const hasIcons = menuItems.some(item => item.icon);

  return (
    <div className={`container-nav ${className} ${hasIcons ? "" : "sin-iconos"}`}>
      <nav>
        {renderMenuItems(menuItems)}
      </nav>
    </div>
  );
};

export default Nav;
