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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import {
  Calendar as CalendarIcon,
  Search,
  X,
  UserPlus,
  Upload,
  Users,
  CalendarDays,
  Building2,
  PenLine,
} from 'lucide-react';
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

// ─── Componente de cabecera de sección ────────────────────────────────────────
function SectionHeader({
  icon,
  label,
  badge,
  badgeVariant = 'info',
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  badgeVariant?: 'info' | 'warning';
}) {
  const badgeClass =
    badgeVariant === 'warning'
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';

  return (
    <div className="flex items-center gap-2 px-1 pb-3 border-b mb-4">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {badge && (
        <span className={cn('ml-auto text-[11px] px-2 py-0.5 rounded-full font-medium', badgeClass)}>
          {badge}
        </span>
      )}
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────
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
  const [aliadoInstitucionImg, setAliadoInstitucionImg] = useState('');
  const [aliadoInstitucionNombre, setAliadoInstitucionNombre] = useState('');
  const [aliadoAutorizoFirmaImg, setAliadoAutorizoFirmaImg] = useState('');
  const [aliadoAutorizoNombreFirma, setAliadoAutorizoNombreFirma] = useState('');
  const [aliadoAutorizoCargo, setAliadoAutorizoCargo] = useState('');
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImage, setTempImage] = useState('');
  const [currentImageField, setCurrentImageField] = useState<string | null>(null);

  const isEditMode = Boolean(evento);
  const mostrarAliado =
    tipo === TipoEvento.TALLER || tipo === TipoEvento.DIPLOMADO;

  // ─── Búsqueda de usuarios ──────────────────────────────────────────────────
  const buscarUsuariosPorCedula = useCallback(async (cedula: string) => {
    if (!cedula || cedula.length < 3) {
      setUsuariosEncontrados([]);
      return;
    }
    setBuscandoUsuarios(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '';
    try {
      const result = await clientApollo.query({
        query: GET_USUARIOS,
        variables: { token, filtro: cedula },
      });
      const usuarios: Usuario[] = (result.data as any)?.getUsuarios?.data ?? [];
      setUsuariosEncontrados(usuarios);
    } catch (err) {
      if (!isProd) console.warn('Error buscando usuarios:', err);
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
      debounceRef.current = setTimeout(() => buscarUsuariosPorCedula(valor), 500);
    },
    [buscarUsuariosPorCedula]
  );

  const agregarPonente = (usuario: Usuario) => {
    if (ponentes.some((p) => p.usuarioId === usuario.id)) {
      notify({ type: 'warning', message: 'Este usuario ya es ponente del evento' });
      return;
    }
    setPonentes([
      ...ponentes,
      {
        usuarioId: usuario.id,
        nombreCompleto: `${usuario.primerNombre} ${usuario.primerApellido}`,
        cedula: usuario.cedula,
        isActivo: true,
      },
    ]);
    setBusquedaCedula('');
    setUsuariosEncontrados([]);
  };

  const eliminarPonente = (usuarioId: number) =>
    setPonentes(ponentes.filter((p) => p.usuarioId !== usuarioId));

  const togglePonenteActivo = (usuarioId: number) =>
    setPonentes(
      ponentes.map((p) =>
        p.usuarioId === usuarioId ? { ...p, isActivo: !p.isActivo } : p
      )
    );

  // ─── Imágenes ──────────────────────────────────────────────────────────────
  const handleAliadoImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const base64 = await handleImageSelect(e);
    if (base64) {
      setTempImage(base64);
      setCurrentImageField('aliadoInstitucionImg');
      setCropperOpen(true);
    }
  };

  const handleAliadoFirmaImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const base64 = await handleImageSelect(e);
    if (base64) {
      setTempImage(base64);
      setCurrentImageField('aliadoAutorizoFirmaImg');
      setCropperOpen(true);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    if (currentImageField === 'aliadoInstitucionImg') setAliadoInstitucionImg(croppedImage);
    else if (currentImageField === 'aliadoAutorizoFirmaImg') setAliadoAutorizoFirmaImg(croppedImage);
    setCurrentImageField(null);
  };

  // ─── Reset ─────────────────────────────────────────────────────────────────
  const resetForm = () => {
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
    setAliadoInstitucionImg('');
    setAliadoInstitucionNombre('');
    setAliadoAutorizoFirmaImg('');
    setAliadoAutorizoNombreFirma('');
    setAliadoAutorizoCargo('');
  };

  useEffect(() => {
    if (evento) {
      setNombre(evento.nombre);
      setFecha(new Date(evento.fecha));
      setLugar(evento.lugar);
      setCosto(evento.costo);
      setDescuentoEstudiante(evento.descuentoEstudiante);
      setDescuentoProfesor(evento.descuentoProfesor);
      setVigencia(evento.vigencia);
      setAliadoInstitucionImg(evento.aliadoInstitucionImg || '');
      setAliadoInstitucionNombre(evento.aliadoInstitucionNombre || '');
      setAliadoAutorizoFirmaImg(evento.aliadoAutorizoFirmaImg || '');
      setAliadoAutorizoNombreFirma(evento.aliadoAutorizoNombreFirma || '');
      setAliadoAutorizoCargo(evento.aliadoAutorizoCargo || '');
      setTimeout(() => setTipo(evento.tipo), 50);
      setPonentes(
        evento.ponenteEvento?.map((p: any) => ({
          usuarioId: p.usuarioId,
          nombreCompleto: `${p.usuario?.primerNombre} ${p.usuario?.primerApellido}`,
          cedula: p.usuario?.cedula || '',
          isActivo: p.isActivo,
        })) ?? []
      );
    } else {
      resetForm();
    }
  }, [evento, isOpen]);

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !fecha || !lugar || !costo || !tipo) {
      notify({ type: 'error', message: 'Por favor completa todos los campos obligatorios' });
      return;
    }

    const ponentesData = ponentes
      .filter((p) => p?.usuarioId && typeof p.isActivo === 'boolean')
      .map((p) => ({ id: Number(p.usuarioId), isActivo: Boolean(p.isActivo) }));

    setIsLoading(true);
    try {
      const payload = {
        nombre,
        fecha,
        lugar,
        costo,
        tipo,
        descuentoEstudiante,
        descuentoProfesor,
        vigencia: vigencia || undefined,
        ponentes: ponentesData,
        aliadoInstitucionImg: aliadoInstitucionImg || undefined,
        aliadoInstitucionNombre: aliadoInstitucionNombre || undefined,
        aliadoAutorizoFirmaImg: aliadoAutorizoFirmaImg || undefined,
        aliadoAutorizoNombreFirma: aliadoAutorizoNombreFirma || undefined,
        aliadoAutorizoCargo: aliadoAutorizoCargo || undefined,
      };

      if (isEditMode && evento?.id) {
        await actualizarEventoService({ eventoId: evento.id, ...payload });
      } else {
        await crearEventoService(payload);
      }

      resetForm();
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('[ModalCrearEvento] Error al guardar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Sub-componente: upload de imagen ─────────────────────────────────────
  const ImageUpload = ({
    value,
    onClear,
    onSelect,
    inputId,
    alt,
    placeholder,
  }: {
    value: string;
    onClear: () => void;
    onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputId: string;
    alt: string;
    placeholder: string;
  }) => (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={onSelect}
        className="hidden"
        id={inputId}
        disabled={isLoading}
      />
      <div
        className="w-full h-24 border-2 border-dashed border-muted-foreground/30 rounded-md flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 hover:bg-muted/30 transition-colors relative"
        onClick={() => document.getElementById(inputId)?.click()}
      >
        {value ? (
          <>
            <img src={value} alt={alt} className="w-full h-full object-cover rounded-md" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 w-6 h-6 z-10"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="w-7 h-7" />
            <span className="text-xs">{placeholder}</span>
          </div>
        )}
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar evento' : 'Crear nuevo evento'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 pt-2">

          {/* ── Sección 1: Información del evento ─────────────────────────── */}
          <section>
            <SectionHeader
              icon={<CalendarDays className="w-4 h-4" />}
              label="Información del evento"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="nombre">Nombre del evento *</Label>
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
                        'w-full justify-start text-left font-normal bg-transparent text-foreground',
                        !fecha && 'text-muted-foreground'
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fecha ? format(fecha, 'PPP', { locale: es }) : 'Seleccione una fecha'}
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
                <Label htmlFor="tipo">Tipo de evento *</Label>
                <Select
                  key={evento?.id ?? 'new'}
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
                <Label htmlFor="descuentoEstudiante">Descuento estudiante (%)</Label>
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
                <Label htmlFor="descuentoProfesor">Descuento profesor (%)</Label>
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
          </section>

          {/* ── Sección 2: Ponentes ───────────────────────────────────────── */}
          <section>
            <SectionHeader
              icon={<Users className="w-4 h-4" />}
              label="Ponentes"
              badge={ponentes.length > 0 ? `${ponentes.length} agregado${ponentes.length > 1 ? 's' : ''}` : undefined}
            />

            <div className="space-y-3">
              {/* Buscador */}
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
                <p className="text-sm text-muted-foreground">Buscando...</p>
              )}

              {usuariosEncontrados.length > 0 && !buscandoUsuarios && (
                <div className="border rounded-md divide-y max-h-40 overflow-y-auto">
                  {usuariosEncontrados.map((usuario) => (
                    <div
                      key={usuario.id}
                      className="flex items-center justify-between px-3 py-2 hover:bg-muted/50"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {usuario.primerNombre} {usuario.primerApellido}
                        </p>
                        <p className="text-xs text-muted-foreground">C.I: {usuario.cedula}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => agregarPonente(usuario)}
                        disabled={isLoading}
                      >
                        <UserPlus className="h-4 w-4 text-secondary" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Lista de ponentes agregados */}
              {ponentes.length > 0 && (
                <div className="border rounded-md divide-y">
                  {ponentes.map((ponente, index) => {
                    const key = ponente.usuarioId
                      ? `ponente-${ponente.usuarioId}`
                      : `ponente-${index}`;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium">{ponente.nombreCompleto}</p>
                          <p className="text-xs text-muted-foreground">C.I: {ponente.cedula}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {ponente.isActivo ? 'Activo' : 'Inactivo'}
                          </span>
                          <Switch
                            id={`switch-${ponente.usuarioId}`}
                            checked={ponente.isActivo}
                            onCheckedChange={() => togglePonenteActivo(ponente.usuarioId)}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => eliminarPonente(ponente.usuarioId)}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* ── Sección 3: Aliado (solo TALLER / DIPLOMADO) ──────────────── */}
          {mostrarAliado && (
            <section>
              <SectionHeader
                icon={<Building2 className="w-4 h-4" />}
                label="Aliado del evento"
            
                badgeVariant="warning"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="aliadoInstitucionNombre">Nombre del aliado</Label>
                  <Input
                    id="aliadoInstitucionNombre"
                    value={aliadoInstitucionNombre}
                    onChange={(e) => setAliadoInstitucionNombre(e.target.value)}
                    disabled={isLoading}
                    placeholder="Nombre del aliado"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>Imagen de la institución aliada</Label>
                  <ImageUpload
                    value={aliadoInstitucionImg}
                    onClear={() => setAliadoInstitucionImg('')}
                    onSelect={handleAliadoImageSelect}
                    inputId="aliado-institucion-image-upload"
                    alt="Imagen institución aliada"
                    placeholder="Haz clic para subir imagen de institución"
                  />
                </div>
              </div>
            </section>
          )}

          {/* ── Sección 4: Autorizador de firma (solo TALLER / DIPLOMADO) ── */}
          {mostrarAliado && (
            <section>
              <SectionHeader
                icon={<PenLine className="w-4 h-4" />}
                label="Autorizador de firma"
             
                badgeVariant="warning"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="aliadoAutorizoNombreFirma">Nombre del autorizador</Label>
                  <Input
                    id="aliadoAutorizoNombreFirma"
                    value={aliadoAutorizoNombreFirma}
                    onChange={(e) => setAliadoAutorizoNombreFirma(e.target.value)}
                    disabled={isLoading}
                    placeholder="Nombre de quien autoriza la firma"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aliadoAutorizoCargo">Cargo del autorizador</Label>
                  <Input
                    id="aliadoAutorizoCargo"
                    value={aliadoAutorizoCargo}
                    onChange={(e) => setAliadoAutorizoCargo(e.target.value)}
                    disabled={isLoading}
                    placeholder="Cargo de quien autoriza la firma"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>Imagen de firma</Label>
                  <ImageUpload
                    value={aliadoAutorizoFirmaImg}
                    onClear={() => setAliadoAutorizoFirmaImg('')}
                    onSelect={handleAliadoFirmaImageSelect}
                    inputId="aliado-firma-image-upload"
                    alt="Imagen de firma del autorizador"
                    placeholder="Haz clic para subir imagen de firma"
                  />
                </div>
              </div>
            </section>
          )}

          {/* ── Acciones ──────────────────────────────────────────────────── */}
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? `${isEditMode ? 'Actualizando' : 'Creando'}...`
                : isEditMode
                ? 'Actualizar evento'
                : 'Crear evento'}
            </Button>
          </div>
        </form>
      </DialogContent>

      <ImageCropper
        open={cropperOpen}
        onOpenChange={setCropperOpen}
        imageSrc={tempImage}
        onCropComplete={handleCropComplete}
      />
    </Dialog>
  );
}