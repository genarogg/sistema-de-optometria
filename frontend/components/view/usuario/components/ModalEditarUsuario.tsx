"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rol } from "@/global/enums";
import { updateUsuarioService } from "../service/updateUsuario.service";
import type { Usuario } from "../store/usuariosStore";

interface ModalEditarUsuarioProps {
  usuario: Usuario;
  rolActual: Rol;
  open: boolean;
  onClose: () => void;
}

const ModalEditarUsuario: React.FC<ModalEditarUsuarioProps> = React.memo(
  ({ usuario, rolActual, open, onClose }) => {
    const [form, setForm] = useState({
      primerNombre: usuario.primerNombre,
      segundoNombre: usuario.segundoNombre || "",
      primerApellido: usuario.primerApellido,
      segundoApellido: usuario.segundoApellido || "",
      email: usuario.email,
      cedula: usuario.cedula,
      numeroGremino: usuario.numeroGremino ? String(usuario.numeroGremino) : "",
      rol: usuario.rol,
    });
    const [guardando, setGuardando] = useState(false);

    const rolesDisponibles = useMemo(() => {
      switch (rolActual) {
        case Rol.ADMIN:
          return Object.values(Rol);
        case Rol.ASISTENTE:
          return [Rol.ASISTENTE, Rol.CLIENTE];
        default:
          return [];
      }
    }, [rolActual]);

    const handleChange = useCallback(
      (campo: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
          setForm((prev) => ({ ...prev, [campo]: e.target.value }));
        },
      []
    );

    const handleRolChange = useCallback((value: string) => {
      setForm((prev) => ({ ...prev, rol: value as Rol }));
    }, []);

    const handleGuardar = useCallback(async () => {
      setGuardando(true);
      await updateUsuarioService({
        id: usuario.id,
        ...form,
        numeroGremino: form.numeroGremino ? parseInt(form.numeroGremino) : null,
      });
      setGuardando(false);
      onClose();
    }, [usuario.id, form, onClose]);

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-nombre">Primer nombre</Label>
                <Input
                  id="edit-nombre"
                  value={form.primerNombre}
                  onChange={handleChange("primerNombre")}
                  placeholder="Primer nombre"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-segundo-nombre">Segundo nombre</Label>
                <Input
                  id="edit-segundo-nombre"
                  value={form.segundoNombre}
                  onChange={handleChange("segundoNombre")}
                  placeholder="Segundo nombre"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-apellido">Primer apellido</Label>
                <Input
                  id="edit-apellido"
                  value={form.primerApellido}
                  onChange={handleChange("primerApellido")}
                  placeholder="Primer apellido"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-segundo-apellido">Segundo apellido</Label>
                <Input
                  id="edit-segundo-apellido"
                  value={form.segundoApellido}
                  onChange={handleChange("segundoApellido")}
                  placeholder="Segundo apellido"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-cedula">Cédula</Label>
                <Input
                  id="edit-cedula"
                  value={form.cedula}
                  onChange={handleChange("cedula")}
                  placeholder="Cédula"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-gremio">N° Gremio</Label>
                <Input
                  id="edit-gremio"
                  type="number"
                  value={form.numeroGremino}
                  onChange={handleChange("numeroGremino")}
                  placeholder="N° de gremio"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="Correo electrónico"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-rol">Rol</Label>
              <Select value={form.rol} onValueChange={handleRolChange}>
                <SelectTrigger id="edit-rol">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {rolesDisponibles.map((rol) => (
                    <SelectItem key={rol} value={rol}>
                      {rol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={guardando}>
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

ModalEditarUsuario.displayName = "ModalEditarUsuario";

export default ModalEditarUsuario;
