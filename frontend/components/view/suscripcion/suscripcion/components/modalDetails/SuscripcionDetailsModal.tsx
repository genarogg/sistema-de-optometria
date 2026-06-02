'use client';

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuthStore } from "@/context/auth/AuthContext";
import { EstatusSuscripcion } from "@/global/enums";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Hash,
  Receipt,
  DollarSign,
  ClipboardList,
  BadgeInfo,
  User,
  Mail,
  Phone,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

import { showMoney } from "@/functions/super-money";

import type { Suscripcion } from "../../store/suscripcionStore";

interface SuscripcionDetailsModalProps {
  suscripcion: Suscripcion | undefined;
  onClose: () => void;
}

/* ─── Estatus ──────────────────────────────────────────────────────────────── */
const ESTATUS_CONFIG: Record<
  EstatusSuscripcion,
  { label: string; dotColor: string; badgeStyle: React.CSSProperties }
> = {
  [EstatusSuscripcion.PENDIENTE]: {
    label: "Pendiente",
    dotColor: "#f59e0b",
    badgeStyle: { background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e" },
  },
  [EstatusSuscripcion.VALIDADO]: {
    label: "Validado",
    dotColor: "#22c55e",
    badgeStyle: { background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534" },
  },
  [EstatusSuscripcion.RECHAZADA]: {
    label: "Rechazada",
    dotColor: "#f43f5e",
    badgeStyle: { background: "#fff1f2", border: "1px solid #fecdd3", color: "#9f1239" },
  },
  [EstatusSuscripcion.VENCIDO]: {
    label: "Vencido",
    dotColor: "#94a3b8",
    badgeStyle: { background: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b" },
  },
};

/* ─── Utilidades ───────────────────────────────────────────────────────────── */
const formatearFecha = (fecha: string | number): string => {
  const ts = typeof fecha === "string" ? parseInt(fecha, 10) : fecha;
  const d = new Date(ts);
  if (isNaN(d.getTime())) return String(fecha);
  return d.toLocaleDateString("es-VE", { day: "2-digit", month: "long", year: "numeric" });
};

const buildNombre = (u: any): string =>
  [u.primerNombre, u.segundoNombre, u.primerApellido, u.segundoApellido]
    .filter(Boolean)
    .join(" ");

const buildIniciales = (u: any): string =>
  [u.primerNombre, u.primerApellido]
    .filter(Boolean)
    .map((n: string) => n[0].toUpperCase())
    .join("");

/* ─── MODO DESKTOP: fila con icono | label | separador | valor ─────────────── */
const FieldRow = ({
  icon,
  label,
  value,
  shaded,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  shaded: boolean;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 16px",
      background: shaded ? "#fafcff" : "#fff",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 6, width: 148, flexShrink: 0 }}>
      <span style={{ color: "#93c5fd", display: "flex", alignItems: "center" }}>{icon}</span>
      <span
        style={{
          color: "#475569",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
    <div style={{ width: 1, height: 14, background: "#e2e8f0", flexShrink: 0 }} />
    <span
      style={{
        color: "#1e293b",
        fontSize: 13,
        fontWeight: 500,
        flex: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {value || "—"}
    </span>
  </div>
);

/* ─── MODO MÓVIL: tarjeta con label arriba y valor abajo ───────────────────── */
const FieldCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div
    style={{
      background: "#f8faff",
      border: "1px solid #e8f0fe",
      borderRadius: 12,
      padding: "12px 14px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        color: "#93c5fd",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 5,
      }}
    >
      {icon}
      {label}
    </div>
    <p
      style={{
        color: "#1e293b",
        fontSize: 14,
        fontWeight: 600,
        margin: 0,
        wordBreak: "break-word",
      }}
    >
      {value || "—"}
    </p>
  </div>
);

/* ─── Tarjeta de métrica ───────────────────────────────────────────────────── */
const MetricCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div
    style={{
      background: "#f8faff",
      border: "1px solid #dbeafe",
      borderRadius: 12,
      padding: "12px 14px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        color: "#93c5fd",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 6,
      }}
    >
      {icon}
      {label}
    </div>
    <p style={{ color: "#1e3a8a", fontSize: 13, fontWeight: 700, margin: 0 }}>{value}</p>
  </div>
);

/* ─── Componente principal ─────────────────────────────────────────────────── */
const SuscripcionDetailsModal: React.FC<SuscripcionDetailsModalProps> = ({
  suscripcion,
  onClose,
}) => {
  const isMobile = useIsMobile();
  const { usuario } = useAuthStore();

  if (!suscripcion) {
    return null;
  }

  const cfg =
    ESTATUS_CONFIG[suscripcion.estatus as EstatusSuscripcion] ??
    ESTATUS_CONFIG[EstatusSuscripcion.PENDIENTE];

  const nombreCompleto = buildNombre(suscripcion.usuario);
  const iniciales = buildIniciales(suscripcion.usuario);

  const metricas = [
    { icon: <Hash size={11} />, label: "N° Suscripción", value: `#${suscripcion.id}` },
    { icon: <Receipt size={11} />, label: "Comprobante", value: suscripcion.comprobante },
    { icon: <DollarSign size={11} />, label: "Costo", value: suscripcion.planSuscripcion.costo === 0 ? "sin costo" : showMoney(suscripcion.planSuscripcion.costo) },
    { icon: <ClipboardList size={11} />, label: "Tipo de Plan", value: suscripcion.planSuscripcion.tipo },
  ];

  const campos = [
    { icon: <BadgeInfo size={11} />, label: "Cédula", value: suscripcion.usuario.cedula },
    { icon: <User size={11} />, label: "Nombre completo", value: nombreCompleto },
    { icon: <Mail size={11} />, label: "Correo electrónico", value: suscripcion.usuario.correo },
    { icon: <Phone size={11} />, label: "Teléfono", value: suscripcion.usuario.telefono },
    { icon: <ShieldCheck size={11} />, label: "Rol en el sistema", value: suscripcion.usuario.rol },
    { icon: <CalendarDays size={11} />, label: "Fecha de registro", value: formatearFecha(suscripcion.createdAt) },
  ];

  /* ── Estilos compartidos ── */
  const FONT: React.CSSProperties = {
    fontFamily: "ui-monospace, 'Cascadia Mono', 'Segoe UI Mono', monospace",
  };

  const DIVIDER = (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ height: 1, flex: 1, background: "#f1f5f9" }} />
      <span
        style={{
          color: "#cbd5e1",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        Perfil del suscriptor
      </span>
      <div style={{ height: 1, flex: 1, background: "#f1f5f9" }} />
    </div>
  );

  const FOOTER = (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 4 }}>
      <span style={{ color: "#64748b", fontSize: 10 }}>ID interno · {suscripcion.id}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#93c5fd" }} />
        <span style={{ color: "#64748b", fontSize: 10 }}>Sistema de suscripciones</span>
      </div>
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        style={{
          ...FONT,
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 32px rgba(30,64,175,.08)",
          overflow: "hidden",
          padding: 0,
          gap: 0,
          maxWidth: isMobile ? "100vw" : 860,
          width: isMobile ? "100vw" : "97vw",
          maxHeight: isMobile ? "92dvh" : "90vh",
          margin: isMobile ? "auto 0 0 0" : undefined,
          borderBottomLeftRadius: isMobile ? 0 : 16,
          borderBottomRightRadius: isMobile ? 0 : 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ══ HEADER (compartido) ══ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "16px 18px" : "18px 22px",
            borderBottom: "1px solid #f1f5f9",
            background: "#f8faff",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Avatar */}
            <div
              style={{
                width: isMobile ? 38 : 42,
                height: isMobile ? 38 : 42,
                borderRadius: 10,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: isMobile ? 13 : 15,
                flexShrink: 0,
                boxShadow: "0 3px 10px rgba(99,102,241,.25)",
              }}
            >
              {iniciales}
            </div>

            <div>
              <p
                style={{
                  color: "#93c5fd",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  margin: 0,
                  marginBottom: 2,
                }}
              >
                Suscripción
              </p>
              <h2
                style={{
                  color: "#0f172a",
                  fontSize: isMobile ? 15 : 17,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {nombreCompleto}
              </h2>
              <p style={{ color: "#94a3b8", fontSize: 11, margin: 0, marginTop: 2 }}>
                {formatearFecha(suscripcion.createdAt)}
              </p>
            </div>
          </div>

          {/* Badge estatus */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 11px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              flexShrink: 0,
              ...cfg.badgeStyle,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: cfg.dotColor,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            {cfg.label}
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            padding: isMobile ? "16px 14px" : "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* ── Métricas: 2 cols en móvil, 4 en desktop ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              gap: 8,
            }}
          >
            {metricas.map(({ icon, label, value }) => (
              <MetricCard key={label} icon={icon} label={label} value={value} />
            ))}
          </div>

          {DIVIDER}

          {/* ── Campos: tarjetas en móvil, filas en desktop ── */}
          {isMobile ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 8,
              }}
            >
              {campos.map(({ icon, label, value }) => (
                <FieldCard key={label} icon={icon} label={label} value={value} />
              ))}
            </div>
          ) : (
            <div style={{ border: "1px solid #f1f5f9", borderRadius: 12, overflow: "hidden" }}>
              {campos.map(({ icon, label, value }, i) => (
                <React.Fragment key={label}>
                  <FieldRow icon={icon} label={label} value={value} shaded={i % 2 === 0} />
                  {i < campos.length - 1 && (
                    <div style={{ height: 1, background: "#f8fafc", margin: "0 16px" }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {FOOTER}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuscripcionDetailsModal;