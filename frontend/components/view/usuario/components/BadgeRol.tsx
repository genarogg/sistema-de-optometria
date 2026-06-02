"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Rol } from "@/global/enums";

interface BadgeRolProps {
  rol: Rol;
  className?: string;
}

const getBadgeStyles = (rol: Rol) => {
  switch (rol) {
    case Rol.SUPER_USUARIO:
      return "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200";
    case Rol.ADMINISTRADOR:
      return "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200";
    case Rol.AGREMIADO_SOLVENTE:
      return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
    case Rol.AGREMIADO_INSOLVENTE:
      return "bg-red-100 text-red-800 border-red-300 hover:bg-red-200";
    case Rol.ESTUDIANTE:
      return "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200";
    case Rol.PROFESOR:
      return "bg-teal-100 text-teal-800 border-teal-300 hover:bg-teal-200";
    case Rol.VISITANTE:
      return "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200";
  }
};

const formatearRol = (rol: Rol) => {
  const rolStr = rol.replace(/_/g, " ");
  return rolStr.charAt(0) + rolStr.slice(1).toLowerCase();
};

const BadgeRol: React.FC<BadgeRolProps> = ({ rol, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 w-[140px] h-[24px]",
        getBadgeStyles(rol),
        className
      )}
    >
      {formatearRol(rol)}
    </span>
  );
};

export default BadgeRol;
