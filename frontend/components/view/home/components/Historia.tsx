import { ScrollText, ArrowRight } from "lucide-react";
import Link from "next/link";
import historiaImg from "@/assets/historia.jpg";

const Historia = () => {
  return (
    <section id="historia" className="py-24 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              Nuestras raíces
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-foreground">
              Historia de la Optometría en Venezuela
            </h2>
            <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
              La optometría venezolana es el resultado de décadas de trabajo,
              compromiso académico y lucha gremial. Desde la creación del
              Colegio de Optometristas de Venezuela hasta el reconocimiento
              universitario de la profesión, generaciones de optometristas han
              consolidado una disciplina al servicio de la salud visual del
              país.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Conoce a los presidentes que han liderado el COV y los hitos que
              marcaron cada gestión.
            </p>

            <div className="mt-8">
              <Link
                href="/historia"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-glow hover:opacity-90 transition-all"
              >
                <ScrollText className="w-4 h-4" />
                Ver historia completa
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Imagen */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-hero opacity-20 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-elegant border border-border/60">
              <img
                src={historiaImg}
                alt="Historia de la optometría en Venezuela: equipos ópticos antiguos"
                width={1280}
                height={896}
                loading="lazy"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Historia;
