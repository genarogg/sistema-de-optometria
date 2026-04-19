import { BookOpen, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import bibliotecaImg from "@/assets/biblioteca.jpg";

const Biblioteca = () => {
  return (
    <section id="biblioteca" className="py-24 bg-gradient-soft">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Imagen */}
          <div className="relative order-last lg:order-first">
            <div className="absolute -inset-4 bg-gradient-hero opacity-20 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-elegant border border-border/60">
              <img
                src={bibliotecaImg}
                alt="Biblioteca de la Sociedad Venezolana de Optometría con libros académicos especializados"
                width={1280}
                height={896}
                loading="lazy"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>

          {/* Contenido */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              Recursos académicos
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-foreground">
              Biblioteca
            </h2>
            <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
              Nuestra biblioteca digital reúne una selección de libros, manuales
              y publicaciones especializadas en optometría, óptica oftálmica,
              patología ocular y áreas afines. Una herramienta esencial para
              estudiantes, profesionales e investigadores que buscan fortalecer
              su formación y mantenerse actualizados con el conocimiento más
              relevante de la profesión.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Todos los recursos están disponibles para descarga gratuita en
              formato PDF, contribuyendo así con el desarrollo continuo de la
              comunidad optométrica venezolana.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/biblioteca"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-glow hover:opacity-90 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Ver más libros
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Biblioteca;
