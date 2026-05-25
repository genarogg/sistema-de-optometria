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
import { Calendar as CalendarIcon, Search, X, UserPlus, Trash2 } from 'lucide-react';
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
  const [costoInput, setCostoInput] = useState<HTMLInputElement | null>(null);

  // Inicializar money inputs y escuchar eventos
  useEffect(() => {
    if (!costoInput) return;

    const handleMoneyInput = (e: CustomEvent<{ value: number }>) => {
      setCosto(e.detail.value);
    };

    costoInput.addEventListener('money-input', handleMoneyInput as EventListener);
    return () => costoInput.removeEventListener('money-input', handleMoneyInput as EventListener);
  }, [costoInput]);

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

  useEffect(() => {
    if (!costoInput) return;

    if (evento) {
      setNombre(evento.nombre);
      setFecha(new Date(evento.fecha));
      setLugar(evento.lugar);
      const cents = evento.costo ?? 0;
      setCosto(cents);
      setTimeout(() => (costoInput as any).setCents?.(cents, false), 0);
      setTipo(evento.tipo);
      setDescuentoEstudiante(evento.descuentoEstudiante);
      setDescuentoProfesor(evento.descuentoProfesor);
      setVigencia(evento.vigencia);

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
      setCosto(0);
      setTimeout(() => (costoInput as any).setCents?.(0, false), 0);
      setTipo('');
      setDescuentoEstudiante(0);
      setDescuentoProfesor(0);
      setVigencia('');
      setPonentes([]);
      setBusquedaCedula('');
      setUsuariosEncontrados([]);
    }
  }, [evento, isOpen, costoInput]);

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
      <DialogContent className="sm:max-w-[600px]">
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
              <Input
                ref={(el) => setCostoInput(el)}
                id="costo"
                type="money"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Evento *</Label>
              <Select
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

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
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
    </Dialog>
  );
}
