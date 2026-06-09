'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MoneyInput from '@/components/nano/MoneyInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarIcon, Search, X, UserPlus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { crearEventoService } from '../service/crearEvento.service';
import { actualizarEventoService } from '../service/actualizarEvento.service';
import { TipoEvento, VigenciaEvento } from '@/global/enums';
import notify from '@/components/nano/notify';
import { clientApollo } from '@/functions';
import GET_USUARIOS from '../../../usuario/querys/GET_USUARIOS';
import { isProd } from '@/env';
import { ImageCropper } from './ImageCropper';
import { handleImageSelect } from '../lib/image-utils';

interface Usuario {
  id: number;
  primerNombre: string;
  segundoNombre: string | null;
  primerApellido: string;
  segundoApellido: string | null;
  cedula: string;
}

interface Ponente {
  usuarioId: number;
  nombreCompleto: string;
  cedula: string;
  isActivo: boolean;
}

interface ModalCrearEventoProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  evento?: any;
}

export default function ModalCrearEvento({
  isOpen,
  onClose,
  evento,
  onSuccess,
}: ModalCrearEventoProps) {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState<Date | undefined>(undefined);
  const [lugar, setLugar] = useState('');
  const [costo, setCosto] = useState(0);
  const [tipo, setTipo] = useState<TipoEvento | ''>('');
  const [descuentoEstudiante, setDescuentoEstudiante] = useState(0);
  const [descuentoProfesor, setDescuentoProfesor] = useState(0);
  const [vigencia, setVigencia] = useState<VigenciaEvento | ''>(VigenciaEvento.VIGENTE);
  const [ponentes, setPonentes] = useState<Ponente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [busquedaCedula, setBusquedaCedula] = useState('');
  const [usuariosEncontrados, setUsuariosEncontrados] = useState<Usuario[]>([]);
  const [buscandoUsuarios, setBuscandoUsuarios] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  
  // Campos de aliado
  const [aliadoImg, setAliadoImg] = useState<string>('');
  const [aliadoNombre, setAliadoNombre] = useState<string>('');
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string>('');



  const isEditMode = Boolean(evento);

  const buscarUsuariosPorCedula = useCallback(async (cedula: string) => {
    if (!cedula || cedula.length < 3) {
      setUsuariosEncontrados([]);
      return;
    }

    setBuscandoUsuarios(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '';

    try {
      const client = clientApollo;
      const result = await client.query({
        query: GET_USUARIOS,
        variables: { token, filtro: cedula },
      });

      const data = result.data as any;
      const usuarios: Usuario[] = data?.getUsuarios?.data ?? [];
      setUsuariosEncontrados(usuarios);
    } catch (err) {
      if (!isProd) {
        console.warn('Error buscando usuarios:', err);
      }
      setUsuariosEncontrados([]);
    } finally {
      setBuscandoUsuarios(false);
    }
  }, []);

  const handleBusquedaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const valor = e.target.value;
      setBusquedaCedula(valor);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        buscarUsuariosPorCedula(valor);
      }, 500);
    },
    [buscarUsuariosPorCedula]
  );

  const agregarPonente = (usuario: Usuario) => {
    const yaAgregado = ponentes.some((p) => p.usuarioId === usuario.id);
    if (yaAgregado) {
      notify({ type: 'warning', message: 'Este usuario ya es ponente del evento' });
      return;
    }

    const nombreCompleto = `${usuario.primerNombre} ${usuario.primerApellido}`;
    setPonentes([...ponentes, { usuarioId: usuario.id, nombreCompleto, cedula: usuario.cedula, isActivo: true }]);
    setBusquedaCedula('');
    setUsuariosEncontrados([]);
  };

  const eliminarPonente = (usuarioId: number) => {
    setPonentes(ponentes.filter((p) => p.usuarioId !== usuarioId));
  };

  const togglePonenteActivo = (usuarioId: number) => {
    setPonentes(ponentes.map((p) => 
      p.usuarioId === usuarioId ? { ...p, isActivo: !p.isActivo } : p
    ));
  };

  // Handlers para la imagen del aliado
  const handleAliadoImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const base64 = await handleImageSelect(e);
    if (base64) {
      setTempImage(base64);
      setCropperOpen(true);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setAliadoImg(croppedImage);
  };

  const clearAliadoImg = () => {
    setAliadoImg('');
  };

  // Separamos useEffect para establecer valores iniciales (sin depender de costoInput)
  useEffect(() => {
    if (evento) {
      console.log('evento completo:', evento);
      console.log('evento.tipo:', evento.tipo, '| tipo:', typeof evento.tipo);
      setNombre(evento.nombre);
      setFecha(new Date(evento.fecha));
      setLugar(evento.lugar);
      setCosto(evento.costo);
      setDescuentoEstudiante(evento.descuentoEstudiante);
      setDescuentoProfesor(evento.descuentoProfesor);
      setVigencia(evento.vigencia);
      setAliadoImg(evento.aliadoImg || '');
      setAliadoNombre(evento.aliadoNombre || '');
      
      // Establecemos el tipo después de un pequeño delay para asegurar que el componente Select esté listo
      setTimeout(() => {
        setTipo(evento.tipo);
        console.log('Después de setTipo en timeout, valor en estado:', tipo);
      }, 50);

      console.log('evento.ponenteEvento:', evento.ponenteEvento);
      
      const ponentesEvento = evento.ponenteEvento?.map((p: any) => ({
        usuarioId: p.usuarioId,
        nombreCompleto: `${p.usuario?.primerNombre} ${p.usuario?.primerApellido}`,
        cedula: p.usuario?.cedula || '',
        isActivo: p.isActivo,
      })) || [];
      
      console.log('ponentesEvento:', ponentesEvento);
      setPonentes(ponentesEvento);
    } else {
      setNombre('');
      setFecha(undefined);
      setLugar('');
      setTipo('');
      setDescuentoEstudiante(0);
      setDescuentoProfesor(0);
      setVigencia('');
      setPonentes([]);
      setBusquedaCedula('');
      setUsuariosEncontrados([]);
      setAliadoImg('');
      setAliadoNombre('');
    }
  }, [evento, isOpen]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !fecha || !lugar || !costo || !tipo) {
      notify({ type: 'error', message: 'Por favor completa todos los campos obligatorios' });
      return;
    }

    const ponentesData = ponentes
      .filter((p) => {
        if (!p || typeof p !== 'object') return false;
        if (!p.usuarioId) return false;
        if (typeof p.isActivo !== 'boolean') return false;
        return true;
      })
      .map((p) => ({
        id: Number(p.usuarioId),
        isActivo: Boolean(p.isActivo),
      }));
    
    console.log('Ponentes originales:', ponentes);
    console.log('Ponentes data a enviar:', ponentesData);

    setIsLoading(true);
    try {
      if (isEditMode && evento?.id) {
        await actualizarEventoService({
          eventoId: evento.id,
          nombre,
          fecha,
          lugar,
          costo,
          tipo,
          descuentoEstudiante,
          descuentoProfesor,
          vigencia: vigencia || undefined,
          ponentes: ponentesData,
          aliadoImg: aliadoImg || undefined,
          aliadoNombre: aliadoNombre || undefined,
        });
      } else {
        await crearEventoService({
          nombre,
          fecha,
          lugar,
          costo,
          tipo,
          descuentoEstudiante,
          descuentoProfesor,
          vigencia: vigencia || undefined,
          ponentes: ponentesData,
          aliadoImg: aliadoImg || undefined,
          aliadoNombre: aliadoNombre || undefined,
        });
      }

      setNombre('');
      setFecha(undefined);
      setLugar('');
      setCosto(0);
      setTipo('');
      setDescuentoEstudiante(0);
      setDescuentoProfesor(0);
      setVigencia('');
      setPonentes([]);
      setBusquedaCedula('');
      setUsuariosEncontrados([]);
      setAliadoImg('');
      setAliadoNombre('');
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('[v0] Error saving event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const title = isEditMode ? 'Editar Evento' : 'Crear Nuevo Evento';
  const submitLabel = isEditMode ? 'Actualizar Evento' : 'Crear Evento';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="nombre">Nombre del Evento *</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={isLoading}
                placeholder="Ingrese el nombre del evento"
              />
            </div>

            <div className="space-y-2">
              <Label>Fecha *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fecha && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fecha ? (
                      format(fecha, "PPP", { locale: es })
                    ) : (
                      <span>Seleccione una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fecha}
                    onSelect={setFecha}
                    initialFocus
                    disabled={isLoading}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lugar">Lugar *</Label>
              <Input
                id="lugar"
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                disabled={isLoading}
                placeholder="Ingrese el lugar"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costo">Costo *</Label>
              <MoneyInput
                id="costo"
                value={costo}
                onChange={setCosto}
                disabled={isLoading}
                symbol="$."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Evento *</Label>
              <Select
                key={evento?.id || 'new'}
                value={tipo}
                onValueChange={(value) => setTipo(value as TipoEvento)}
                disabled={isLoading}
              >
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TipoEvento).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descuentoEstudiante">Descuento Estudiante (%)</Label>
              <Input
                id="descuentoEstudiante"
                type="number"
                value={descuentoEstudiante}
                onChange={(e) => setDescuentoEstudiante(Number(e.target.value))}
                disabled={isLoading}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descuentoProfesor">Descuento Profesor (%)</Label>
              <Input
                id="descuentoProfesor"
                type="number"
                value={descuentoProfesor}
                onChange={(e) => setDescuentoProfesor(Number(e.target.value))}
                disabled={isLoading}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>

            {isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="vigencia">Vigencia</Label>
                <Select
                  value={vigencia}
                  onValueChange={(value) => setVigencia(value as VigenciaEvento)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="vigencia">
                    <SelectValue placeholder="Selecciona una vigencia" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(VigenciaEvento).map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Campos de aliado - solo para TALLER y DIPLOMADO */}
            {(tipo === TipoEvento.TALLER || tipo === TipoEvento.DIPLOMADO) && (
              <div className="col-span-2 space-y-4 pt-4 border-t">
                <Label>Aliado del Evento</Label>
                
                <div className="space-y-2">
                  <Label htmlFor="aliadoNombre">Nombre del Aliado</Label>
                  <Input
                    id="aliadoNombre"
                    value={aliadoNombre}
                    onChange={(e) => setAliadoNombre(e.target.value)}
                    disabled={isLoading}
                    placeholder="Nombre del aliado"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Imagen del Aliado</Label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAliadoImageSelect}
                      className="hidden"
                      id="aliado-image-upload"
                      disabled={isLoading}
                    />
                    
                    <div
                      className="w-full h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors relative"
                      onClick={() => document.getElementById('aliado-image-upload')?.click()}
                    >
                      {aliadoImg ? (
                        <>
                          <img
                            src={aliadoImg}
                            alt="Aliado"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 w-6 h-6 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearAliadoImg();
                            }}
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            Haz clic para subir imagen
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label>Ponentes del Evento</Label>

            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  className="pl-9"
                  placeholder="Buscar usuario por cédula..."
                  value={busquedaCedula}
                  onChange={handleBusquedaChange}
                  disabled={isLoading}
                />
              </div>

              {buscandoUsuarios && (
                <div className="text-sm text-muted-foreground py-2">Buscando...</div>
              )}

              {usuariosEncontrados.length > 0 && !buscandoUsuarios && (
                <div className="border rounded-md p-2 space-y-2 max-h-40 overflow-y-auto">
                  {usuariosEncontrados.map((usuario) => (
                    <div key={usuario.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                      <div>
                        <div className="font-medium">
                          {usuario.primerNombre} {usuario.primerApellido}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          C.I: {usuario.cedula}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => agregarPonente(usuario)}
                        disabled={isLoading}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {ponentes.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Ponentes agregados ({ponentes.length})</Label>
                  <div className="border rounded-md p-2 space-y-2">
                    {ponentes.map((ponente, index) => {
                    console.log(`Ponente ${index}:`, ponente);
                    const key = ponente.usuarioId ? `ponente-${ponente.usuarioId}` : `ponente-${index}`;
                    return (
                      <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{ponente.nombreCompleto}</div>
                          <div className="text-sm text-muted-foreground">C.I: {ponente.cedula}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`switch-${ponente.usuarioId}`} className="text-sm">
                            {ponente.isActivo ? 'Activo' : 'Inactivo'}
                          </Label>
                          <Switch
                            id={`switch-${ponente.usuarioId}`}
                            checked={ponente.isActivo}
                            onCheckedChange={() => togglePonenteActivo(ponente.usuarioId)}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? `${submitLabel}...` : submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
      
      {/* Image Cropper Modal */}
      <ImageCropper
        open={cropperOpen}
        onOpenChange={setCropperOpen}
        imageSrc={tempImage}
        onCropComplete={handleCropComplete}
      />
    </Dialog>
  );
}
