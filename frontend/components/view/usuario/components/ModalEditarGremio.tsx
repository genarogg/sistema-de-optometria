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
import { NivelAcademico } from "@/global/enums";
import { updateUsuarioService } from "../service/updateUsuario.service";
import type { Usuario } from "../store/usuariosStore";

interface ModalEditarGremioProps {
  usuario: Usuario;
  open: boolean;
  onClose: () => void;
}

const ModalEditarGremio: React.FC<ModalEditarGremioProps> = React.memo(
  ({ usuario, open, onClose }) => {
    const [form, setForm] = useState({
      numeroGremio: usuario.gremio?.numeroGremio?.toString() || "",
      nivelAcademico: usuario.gremio?.nivelAcademico || "",
    });
    const [guardando, setGuardando] = useState(false);

    const handleChange = useCallback(
      (campo: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
          setForm((prev) => ({ ...prev, [campo]: e.target.value }));
        },
      []
    );

    const handleNivelAcademicoChange = useCallback((value: string) => {
      setForm((prev) => ({ ...prev, nivelAcademico: value as NivelAcademico }));
    }, []);

    const handleGuardar = useCallback(async () => {
      setGuardando(true);
      await updateUsuarioService({
        id: usuario.id.toString(),
        numeroGremio: form.numeroGremio ? parseInt(form.numeroGremio) : undefined,
        nivelAcademico: form.nivelAcademico as NivelAcademico || undefined,
      });
      setGuardando(false);
      onClose();
    }, [usuario.id, form, onClose]);

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar gremio</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-numero-gremio">Número de Gremio</Label>
              <Input
                id="edit-numero-gremio"
                type="number"
                value={form.numeroGremio}
                onChange={handleChange("numeroGremio")}
                placeholder="Número de gremio"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-nivel-academico">Nivel Académico</Label>
              <Select value={form.nivelAcademico} onValueChange={handleNivelAcademicoChange}>
                <SelectTrigger id="edit-nivel-academico">
                  <SelectValue placeholder="Selecciona nivel académico" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(NivelAcademico).map((nivel) => (
                    <SelectItem key={nivel} value={nivel}>
                      {nivel}
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

ModalEditarGremio.displayName = "ModalEditarGremio";

export default ModalEditarGremio;
