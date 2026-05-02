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
    const [password, setPassword] = useState("");
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [error, setError] = useState<string | undefined>();
    const [guardando, setGuardando] = useState(false);

    const handleGuardar = useCallback(async () => {
      if (!password || !nuevaPassword) {
        setError("Ambos campos son requeridos.");
        return;
      }
      if (password === nuevaPassword) {
        setError("La nueva contrasena debe ser diferente a la actual.");
        return;
      }
      setError(undefined);
      setGuardando(true);
      await updateUsuarioService({ id: usuario.id, password: nuevaPassword });
      setGuardando(false);
      setPassword("");
      setNuevaPassword("");
      onClose();
    }, [usuario.id, password, nuevaPassword, onClose]);

    const handleClose = useCallback(() => {
      setPassword("");
      setNuevaPassword("");
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
              name="password-actual"
              type="password"
              placeholder="Contraseña actual"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hasContentState={true}
              error={error}
            />
            <Input
              name="password-nueva"
              type="password"
              placeholder="Nueva Contraseña"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
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
