'use client';

import React, { JSX, useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuthStore } from "@/context/auth/AuthContext";
import { Rol, EstatusSuscripcion } from "@/global/enums";
import { useMediaQuery } from "react-responsive";

const useIsMobile = () => useMediaQuery({ maxWidth: 768 });

interface SuscripcionDetailsModalProps {
  suscripcion: any;
  onClose: () => void;
}

/* ─── Configuración de estatus ─────────────────────────────────────────────── */
const ESTATUS_CONFIG: Record<
  EstatusSuscripcion,
  { label: string; dotClass: string; badgeClass: string; pulse: boolean }
> = {
  [EstatusSuscripcion.PENDIENTE]: {
    label: "Pendiente",
    dotClass: "bg-amber-400",
    badgeClass: "bg-amber-50 border border-amber-200 text-amber-700",
    pulse: true,
  },
  [EstatusSuscripcion.VALIDADO]: {
    label: "Validado",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-50 border border-emerald-200 text-emerald-700",
    pulse: false,
  },
  [EstatusSuscripcion.RECHAZADA]: {
    label: "Rechazada",
    dotClass: "bg-rose-500",
    badgeClass: "bg-rose-50 border border-rose-200 text-rose-700",
    pulse: false,
  },
  [EstatusSuscripcion.VENCIDO]: {
    label: "Vencido",
    dotClass: "bg-slate-400",
    badgeClass: "bg-slate-50 border border-slate-200 text-slate-500",
    pulse: false,
  },
};

/* ─── Íconos SVG inline ─────────────────────────────────────────────────────── */
const Icon = ({ name, className = "w-3 h-3" }: { name: string; className?: string }) => {
  const icons: Record<string, JSX.Element> = {
    id: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm3 3a1 1 0 000 2h6a1 1 0 100-2H5zm0 4a1 1 0 000 2h4a1 1 0 100-2H5z" />
      </svg>
    ),
    voucher: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    ),
    money: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
      </svg>
    ),
    plan: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
      </svg>
    ),
    mail: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    ),
    phone: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    ),
    user: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
    role: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    ),
    hash: (
      <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clipRule="evenodd" />
      </svg>
    ),
    close: (
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className}>
        <line x1="1" y1="1" x2="11" y2="11" />
        <line x1="11" y1="1" x2="1" y2="11" />
      </svg>
    ),
  };
  return icons[name] ?? null;
};

/* ─── Componente principal ─────────────────────────────────────────────────── */
const SuscripcionDetailsModal: React.FC<SuscripcionDetailsModalProps> = ({
  suscripcion,
  onClose,
}) => {
  const { usuario } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const cfg =
    ESTATUS_CONFIG[suscripcion.estatus as EstatusSuscripcion] ??
    ESTATUS_CONFIG[EstatusSuscripcion.PENDIENTE];

  const formatearFecha = (fecha: string | number) => {
    const ts = typeof fecha === "string" ? parseInt(fecha, 10) : fecha;
    const d = new Date(ts);
    if (isNaN(d.getTime())) return String(fecha);
    return d.toLocaleDateString("es-VE", { day: "2-digit", month: "long", year: "numeric" });
  };

  const nombreCompleto = [
    suscripcion.usuario.primerNombre,
    suscripcion.usuario.segundoNombre,
    suscripcion.usuario.primerApellido,
    suscripcion.usuario.segundoApellido,
  ].filter(Boolean).join(" ");

  const iniciales = [suscripcion.usuario.primerNombre, suscripcion.usuario.primerApellido]
    .filter(Boolean)
    .map((n: string) => n[0].toUpperCase())
    .join("");

  const metricas = [
    { icon: "hash", label: "N° Suscripción", value: `#${suscripcion.id}` },
    { icon: "voucher", label: "Comprobante", value: suscripcion.comprobante },
    { icon: "money", label: "Costo", value: `$${suscripcion.planSuscripcion.costo}` },
    { icon: "plan", label: "Tipo de Plan", value: suscripcion.planSuscripcion.tipo },
  ];

  const campos = [
    { icon: "id", label: "Cédula", value: suscripcion.usuario.cedula },
    { icon: "user", label: "Nombre Completo", value: nombreCompleto },
    { icon: "mail", label: "Correo Electrónico", value: suscripcion.usuario.correo },
    { icon: "phone", label: "Teléfono", value: suscripcion.usuario.telefono },
    { icon: "role", label: "Rol en el sistema", value: suscripcion.usuario.rol },
    { icon: "calendar", label: "Fecha de registro", value: formatearFecha(suscripcion.createdAt) },
  ];

  return (
    <>
      <style>{`
       
        .mf { font-family: 'Syne', sans-serif; }
        .mm { font-family: 'JetBrains Mono', monospace; }
        .m-enter { opacity:0; transform:translateY(14px) scale(.988); }
        .m-enter.m-show { opacity:1; transform:none; transition: opacity .3s ease, transform .3s cubic-bezier(.22,1,.36,1); }
        .m-metric { transition: transform .18s, box-shadow .18s; }
        .m-metric:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(30,64,175,.1); }
        .m-field { transition: background .12s; }
        .m-field:hover { background: #eff6ff !important; }
        .m-close { transition: background .15s, color .15s, transform .15s; }
        .m-close:hover { background: #f1f5f9; color: #475569; transform: rotate(90deg); }
        @keyframes m-pulse { 0%,100%{ transform:scale(1); opacity:.8; } 50%{ transform:scale(1.7); opacity:0; } }
        .m-dot-pulse { animation: m-pulse 1.8s ease-in-out infinite; }
      `}</style>

      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent
          className={`mf m-enter ${mounted ? "m-show" : ""} w-[97vw] max-w-[860px] max-h-[90vh] p-0 gap-0 border-0 shadow-none bg-transparent rounded-2xl overflow-hidden`}
        >
          <div
            className="relative flex flex-col w-full max-h-[90vh] overflow-hidden rounded-2xl bg-white border border-slate-200"
            style={{ boxShadow: "0 24px 64px rgba(30,64,175,.1), 0 4px 16px rgba(30,64,175,.06)" }}
          >

            {/* ══ HEADER ══ */}
            <div
              className="relative flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0"
              style={{ background: "linear-gradient(160deg,#f8faff 0%,#ffffff 60%)" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-base flex-shrink-0 mm"
                  style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)", boxShadow: "0 4px 14px rgba(99,102,241,.3)" }}
                >
                  {iniciales}
                </div>
                <div>
                  <p className="mm text-[9px] font-semibold uppercase tracking-[.14em] text-blue-300 mb-0.5">Suscripción</p>
                  <h2 className="text-slate-900 text-lg font-extrabold tracking-tight leading-tight">{nombreCompleto}</h2>
                  <p className="mm text-[10px] text-slate-400 mt-0.5">{formatearFecha(suscripcion.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mm text-[10px] font-semibold tracking-[.06em] ${cfg.badgeClass}`}>
                  <span className="relative flex h-1.5 w-1.5">
                    {cfg.pulse && <span className={`m-dot-pulse absolute inline-flex h-full w-full rounded-full ${cfg.dotClass} opacity-60`} />}
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${cfg.dotClass}`} />
                  </span>
                  {cfg.label}
                </div>
                <button onClick={onClose} aria-label="Cerrar" className="m-close w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 bg-slate-50 border border-slate-200">
                  <Icon name="close" className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* ══ BODY ══ */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

              {/* Métricas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {metricas.map(({ icon, label, value }) => (
                  <div key={label} className="m-metric relative overflow-hidden rounded-[14px] border border-blue-100 bg-blue-50/60 px-4 py-3.5 cursor-default">
                    <div className="absolute bottom-0 left-3 right-3 h-px" style={{ background: "linear-gradient(90deg,transparent,#bfdbfe,transparent)" }} />
                    <div className="flex items-center gap-1.5 text-blue-300 mb-2 mm text-[9px] font-semibold uppercase tracking-[.12em]">
                      <Icon name={icon} className="w-2.5 h-2.5" />
                      {label}
                    </div>
                    <p className="mm text-[13px] font-bold text-blue-900 truncate">{value}</p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="mm text-[9px] font-bold text-slate-300 uppercase tracking-[.18em]">Perfil del suscriptor</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              {/* Campos */}
              <div className="rounded-[14px] border border-slate-100 overflow-hidden bg-white">
                {campos.map(({ icon, label, value }, i) => (
                  <React.Fragment key={label}>
                    <div className={`m-field flex items-center gap-4 px-5 py-3 ${i % 2 === 0 ? "bg-slate-50/60" : "bg-white"}`}>
                      <div className="flex items-center gap-2 w-[148px] flex-shrink-0">
                        <span className="text-blue-300 flex-shrink-0"><Icon name={icon} className="w-2.5 h-2.5" /></span>
                        <span className="mm text-[9px] font-semibold uppercase tracking-[.1em] text-slate-400 truncate">{label}</span>
                      </div>
                      <div className="w-px h-3.5 bg-slate-200 flex-shrink-0" />
                      <span className="mm text-[12px] font-medium text-slate-700 flex-1 truncate">{value || "—"}</span>
                    </div>
                    {i < campos.length - 1 && <div className="h-px bg-slate-100 mx-5" />}
                  </React.Fragment>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 pb-1">
                <p className="mm text-[9px] text-slate-300">ID interno · {suscripcion.id}</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                  <p className="mm text-[9px] text-slate-300">Sistema de suscripciones</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SuscripcionDetailsModal;