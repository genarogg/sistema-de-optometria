"use client";

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Input from "@/components/ux/input";
import { updateUsuarioService } from "../service/updateUsuario.service";
import type { Usuario } from "../store/usuariosStore";

interface ModalCambiarPasswordProps {
  usuario: Usuario;
  open: boolean;
  onClose: () => void;
}

const ModalCambiarPassword: React.FC<ModalCambiarPasswordProps> = React.memo(
  ({ usuario, open, onClose }) => {
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [repetirNuevaPassword, setRepetirNuevaPassword] = useState("");
    const [error, setError] = useState<string | undefined>();
    const [guardando, setGuardando] = useState(false);

    const handleGuardar = useCallback(async () => {
      if (!nuevaPassword || !repetirNuevaPassword) {
        setError("Ambos campos son requeridos.");
        return;
      }
      if (nuevaPassword !== repetirNuevaPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
      setError(undefined);
      setGuardando(true);
      await updateUsuarioService({ id: usuario.id, password: nuevaPassword });
      setGuardando(false);
      setNuevaPassword("");
      setRepetirNuevaPassword("");
      onClose();
    }, [usuario.id, nuevaPassword, repetirNuevaPassword, onClose]);

    const handleClose = useCallback(() => {
      setNuevaPassword("");
      setRepetirNuevaPassword("");
      setError(undefined);
      onClose();
    }, [onClose]);

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar contrasena</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2 pt-6">
            <Input
              name="password-nueva"
              type="password"
              placeholder="Nueva Contraseña"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              error={error}
              hasContentState={true}
            />
            <Input
              name="password-repetir"
              type="password"
              placeholder="Repetir Nueva Contraseña"
              value={repetirNuevaPassword}
              onChange={(e) => setRepetirNuevaPassword(e.target.value)}
              error={error}
              hasContentState={true}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={guardando}>
              Cancelar
            </Button>
            <Button onClick={handleGuardar} disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

ModalCambiarPassword.displayName = "ModalCambiarPassword";

export default ModalCambiarPassword;
