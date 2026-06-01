"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";
import { TipoAutoridad } from "@/global/enums";
import { updateUsuarioService } from "../service/updateUsuario.service";
import type { Usuario } from "../store/usuariosStore";
import { ImageCropper } from "./image-cropper";

interface ModalEditarAutoridadProps {
  usuario: Usuario;
  open: boolean;
  onClose: () => void;
}

const ModalEditarAutoridad: React.FC<ModalEditarAutoridadProps> = React.memo(
  ({ usuario, open, onClose }) => {
    const [form, setForm] = useState({
      firma: usuario.autoridad?.firma || "",
      tipoAutoridad: usuario.autoridad?.tipoAutoridad || "",
      vigente: usuario.autoridad?.vigente !== undefined ? usuario.autoridad.vigente : true,
    });
    const [guardando, setGuardando] = useState(false);
    const [showCropper, setShowCropper] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ firma?: string; tipoAutoridad?: string }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setTempImageSrc(result);
          setShowCropper(true);
        };
        reader.readAsDataURL(file);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, []);

    const handleCropComplete = useCallback((croppedImage: string) => {
      setForm((prev) => ({ ...prev, firma: croppedImage }));
      setShowCropper(false);
      setTempImageSrc(null);
      if (errors.firma) {
        setErrors((prev) => ({ ...prev, firma: undefined }));
      }
    }, [errors.firma]);

    const handleTipoAutoridadChange = useCallback((value: string) => {
      setForm((prev) => ({ ...prev, tipoAutoridad: value as TipoAutoridad }));
      if (errors.tipoAutoridad) {
        setErrors((prev) => ({ ...prev, tipoAutoridad: undefined }));
      }
    }, [errors.tipoAutoridad]);

    const handleVigenteChange = useCallback((checked: boolean) => {
      setForm((prev) => ({ ...prev, vigente: checked }));
    }, []);

    const handleGuardar = useCallback(async () => {
      const newErrors: { firma?: string; tipoAutoridad?: string } = {};
      
      if (!form.firma) {
        newErrors.firma = "Debe seleccionar una imagen de firma";
      }
      
      if (!form.tipoAutoridad) {
        newErrors.tipoAutoridad = "Debe seleccionar un tipo de autoridad";
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      setErrors({});
      setGuardando(true);
      await updateUsuarioService({
        id: usuario.id.toString(),
        firma: form.firma || undefined,
        tipoAutoridad: form.tipoAutoridad as TipoAutoridad || undefined,
        vigente: form.vigente,
      });
      setGuardando(false);
      onClose();
    }, [usuario.id, form, onClose]);

    return (
      <>
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar autoridad</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <Label>Firma</Label>
                <div
                  className={`relative cursor-pointer group border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors ${errors.firma ? "border-red-500" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {form.firma ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={form.firma}
                        alt="Firma"
                        className="max-w-full h-24 object-contain"
                      />
                      <p className="text-sm text-muted-foreground">
                        Haga clic para cambiar la firma
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Haga clic para seleccionar una imagen
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG o GIF (máx. 2MB)
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                {errors.firma && <p className="text-sm text-red-500">{errors.firma}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="edit-tipo-autoridad">Tipo de Autoridad</Label>
                <Select value={form.tipoAutoridad} onValueChange={handleTipoAutoridadChange}>
                  <SelectTrigger id="edit-tipo-autoridad" className={errors.tipoAutoridad ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecciona tipo de autoridad" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TipoAutoridad).map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tipoAutoridad && <p className="text-sm text-red-500">{errors.tipoAutoridad}</p>}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-vigente">Vigente</Label>
                <Switch
                  id="edit-vigente"
                  checked={form.vigente}
                  onCheckedChange={handleVigenteChange}
                />
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

        {tempImageSrc && (
          <ImageCropper
            open={showCropper}
            onOpenChange={setShowCropper}
            imageSrc={tempImageSrc}
            onCropComplete={handleCropComplete}
          />
        )}
      </>
    );
  }
);

ModalEditarAutoridad.displayName = "ModalEditarAutoridad";

export default ModalEditarAutoridad;
