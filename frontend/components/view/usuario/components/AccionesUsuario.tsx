"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, KeyRound, GraduationCap, Crown } from "lucide-react";
import WhatsAppButton from "@/components/ux/btn/whatsapp";
import type { Usuario } from "../store/usuariosStore";

interface AccionesUsuarioProps {
  usuario: Usuario;
  onEditar: (usuario: Usuario) => void;
  onPassword: (usuario: Usuario) => void;
  onEditarGremio: (usuario: Usuario) => void;
  onEditarAutoridad: (usuario: Usuario) => void;
}

const AccionesUsuario: React.FC<AccionesUsuarioProps> = ({
  usuario,
  onEditar,
  onPassword,
  onEditarGremio,
  onEditarAutoridad,
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 bg-[#F0F0F0] text-[#333] rounded-md"
        onClick={() => onEditar(usuario)}
        title="Editar usuario"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 bg-[#F0F0F0] text-[#333] rounded-md"
        onClick={() => onPassword(usuario)}
        title="Cambiar contrasena"
      >
        <KeyRound className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 bg-[#F0F0F0] text-[#333] rounded-md"
        onClick={() => onEditarGremio(usuario)}
        title="Editar gremio"
      >
        <GraduationCap className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 bg-[#F0F0F0] text-[#333] rounded-md"
        onClick={() => onEditarAutoridad(usuario)}
        title="Editar autoridad"
      >
        <Crown className="h-3.5 w-3.5" />
      </Button>
      <WhatsAppButton phoneNumber={usuario.telefono} />
    </div>
  );
};

export default AccionesUsuario;
