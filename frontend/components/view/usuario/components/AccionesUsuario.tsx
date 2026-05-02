"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, KeyRound } from "lucide-react";
import WhatsAppButton from "@/components/ux/btn/whatsapp";
import type { Usuario } from "../store/usuariosStore";

interface AccionesUsuarioProps {
  usuario: Usuario;
  onEditar: (usuario: Usuario) => void;
  onPassword: (usuario: Usuario) => void;
}

const AccionesUsuario: React.FC<AccionesUsuarioProps> = ({
  usuario,
  onEditar,
  onPassword,
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10"
        onClick={() => onEditar(usuario)}
        title="Editar usuario"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10"
        onClick={() => onPassword(usuario)}
        title="Cambiar contrasena"
      >
        <KeyRound className="h-3.5 w-3.5" />
      </Button>
      <WhatsAppButton phoneNumber={usuario.telefono} />
    </div>
  );
};

export default AccionesUsuario;
