import { GraduationCap, Users, Globe2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import imgCongreso from "@/public/congreso.jpg";


const Congresos = () => {
  return (
    <section id="congresos" className="py-24 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            Eventos
          </span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-foreground">
            Congresos
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Espacios de encuentro académico y profesional para toda la comunidad optométrica
            venezolana.
          </p>
        </div>

        <article className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center rounded-2xl overflow-hidden bg-gradient-to-br from-card to-muted border border-border/60 shadow-soft hover:shadow-elegant transition-all duration-300 p-8 md:p-10">
          {/* Información (izquierda) */}
          <div className="order-2 lg:order-1">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-foreground/90 leading-relaxed text-lg">
                El Colegio de Optometristas de Venezuela organiza periódicamente congresos
                nacionales que reúnen a optometristas, ópticos, casas comerciales y público en
                general en torno a los avances más relevantes de la profesión.
              </p>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Cada edición ofrece conferencias con invitados nacionales e internacionales,
                talleres prácticos y una exposición de productos y servicios de las principales
                empresas del sector, fortaleciendo la formación continua y el intercambio
                profesional.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="text-sm text-foreground/80">Conferencias y talleres de actualización</span>
              </div>
              <div className="flex items-start gap-3">
                <Globe2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="text-sm text-foreground/80">Ponentes nacionales e internacionales</span>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="text-sm text-foreground/80">Networking con toda la comunidad óptica</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/60">
              <Button asChild size="lg" className="group">
                <Link href="/login">
                  Inscribirse en el próximo congreso
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Imagen (derecha) */}
          <div className="relative order-1 lg:order-2">
            <div className="absolute -inset-4 bg-gradient-hero opacity-20 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-elegant border border-border/60">
              <Image
                src={imgCongreso}
                blurDataURL={imgCongreso.blurDataURL}
                alt="Asistentes en un congreso de optometría con conferencias y exposiciones"
                width={1024}
                height={1024}
                loading="lazy"
                className="w-full h-full object-cover aspect-square"
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Congresos;
