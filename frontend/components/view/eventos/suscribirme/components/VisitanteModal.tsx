"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Lock, Star, CalendarDays, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Rol } from "@/global/enums"
import "@/components/modalInfo/modalInfo.css"

interface VisitanteModalProps {
  isOpen: boolean
  rol: Rol
  onClose: () => void
}

const colors = {
  primaryStart:     "#2dd4bf",
  primaryEnd:       "#0f766e",
  iconBackground:   "#ffffff",
  iconColor:        "#0d9488",
  textColor:        "#ffffff",
  buttonBackground: "#ffffff",
  buttonText:       "#0d9488",
  buttonHover:      "rgba(255, 255, 255, 0.9)",
  ghostBg:          "rgba(255, 255, 255, 0.15)",
  ghostBorder:      "rgba(255, 255, 255, 0.4)",
}

const PARTICLES = Array.from({ length: 20 }).map(() => ({
  width:    Math.random() * 8 + 4,
  height:   Math.random() * 8 + 4,
  opacity:  Math.random() * 0.3 + 0.1,
  top:      `${Math.random() * 100}%`,
  left:     `${Math.random() * 100}%`,
  duration: `${5 + Math.random() * 3}s`,
  delay:    `${Math.random() * 2}s`,
}))

const VisitanteModal: React.FC<VisitanteModalProps> = ({ isOpen, rol, onClose }) => {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [active, setActive]   = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (isOpen && (rol === Rol.VISITANTE || rol === Rol.AGREMIADO_INSOLVENTE)) {
      setMounted(true)
      timerRef.current = setTimeout(() => setActive(true), 16)
    } else {
      setActive(false)
      timerRef.current = setTimeout(() => setMounted(false), 300)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isOpen, rol])

  if (!mounted || (rol !== Rol.VISITANTE && rol !== Rol.AGREMIADO_INSOLVENTE)) return null

  const handleSuscripcion = () => {
    router.push("/dashboard/suscripcion")
  }

  return (
    <>
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50%       { transform: translateY(-20px) translateX(8px); opacity: 0.5; }
        }
        @keyframes pulseRing {
          0%   { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2);   opacity: 0; }
        }
        @keyframes bgPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.2); }
        }
        @keyframes spinIn {
          from { transform: scale(0) rotate(-180deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg);   opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes fadeLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes fadeRight {
          from { transform: translateX(20px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }

        .vm-overlay { opacity: 0; transition: opacity 0.25s ease; }
        .vm-overlay.vm-active { opacity: 1; }

        .vm-card {
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .vm-active .vm-card { opacity: 1; transform: scale(1); }

        .vm-active .vm-icon    { animation: spinIn  0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.15s both; }
        .vm-active .vm-title   { animation: fadeUp  0.35s ease 0.35s both; }
        .vm-active .vm-message { animation: fadeUp  0.35s ease 0.45s both; }
        .vm-active .vm-btn-primary { animation: fadeLeft  0.35s ease 0.6s both; }
        .vm-active .vm-btn-ghost   { animation: fadeRight 0.35s ease 0.6s both; }

        .vm-particle   { animation: floatParticle var(--duration) var(--delay) ease-in-out infinite; }
        .vm-pulse-ring { animation: pulseRing 2s var(--ring-delay) ease-out infinite; }
        .vm-bg-gradient{ animation: bgPulse 3s ease-in-out infinite; }
      `}</style>

      <div className={`modal-overlay vm-overlay${active ? " vm-active" : ""}`} style={{ cursor: "default" }}>
        <div
          className="modal-content vm-card relative"
          style={{ background: `linear-gradient(135deg, ${colors.primaryStart}, #0d9488, ${colors.primaryEnd})` }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-50 p-1 rounded-full hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>

          {/* Fondo animado */}
          <div className="modal-background">
            <div className="modal-background-gradient vm-bg-gradient" />
            {PARTICLES.map((p, i) => (
              <div
                key={i}
                className="modal-particle vm-particle"
                style={{
                  width: p.width,
                  height: p.height,
                  backgroundColor: `rgba(255,255,255,${p.opacity})`,
                  top: p.top,
                  left: p.left,
                  "--duration": p.duration,
                  "--delay": p.delay,
                } as React.CSSProperties}
              />
            ))}
          </div>

          <div className="modal-inner-content" style={{ minHeight: "auto", padding: "2.5rem 1.5rem" }}>
            {/* Icono */}
            <div className="modal-icon-wrapper vm-icon">
              <div
                className="modal-icon-circle"
                style={{ backgroundColor: colors.iconBackground, color: colors.iconColor }}
              >
                <Lock size={48} />
              </div>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="modal-pulse-ring vm-pulse-ring"
                  style={{ borderColor: colors.iconBackground, "--ring-delay": `${i * 0.4}s` } as React.CSSProperties}
                />
              ))}
            </div>

            <h2
              className="modal-title vm-title"
              style={{ color: colors.textColor, fontSize: "1.75rem", marginBottom: "1rem" }}
            >
              Acceso Restringido
            </h2>

            <p
              className="modal-message vm-message"
              style={{ color: colors.textColor, marginBottom: "2rem", opacity: 0.9 }}
            >
              Actualmente no posee una suscripción activa o su cuenta está inactiva.
              <br />
              Con una suscripción puede acceder a eventos exclusivos, certificados, carnets y mucho más.
              <br /><br />
              <strong>¡Desbloquee todos los beneficios hoy!</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              {/* Adquirir suscripción */}
              <div className="w-full sm:w-auto vm-btn-primary">
                <button
                  className="modal-action-button flex items-center justify-center gap-2 w-full transition-all"
                  style={{
                    backgroundColor: colors.buttonBackground,
                    color: colors.buttonText,
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.buttonHover
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.buttonBackground
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                  onClick={handleSuscripcion}
                >
                  <Star size={20} />
                  Adquirir suscripción
                </button>
              </div>

              {/* Ver eventos */}
              <div className="w-full sm:w-auto vm-btn-ghost">
                <button
                  className="modal-action-button flex items-center justify-center gap-2 w-full transition-all"
                  style={{
                    backgroundColor: colors.ghostBg,
                    color: colors.textColor,
                    border: `1.5px solid ${colors.ghostBorder}`,
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.25)"
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.ghostBg
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                  onClick={onClose}
                >
                  <CalendarDays size={20} />
                  Ver eventos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default VisitanteModal