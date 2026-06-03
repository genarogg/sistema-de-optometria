import Image from "next/image";

import actas from "@/public/junta/directiva-1_resultado.webp";
import academico from "@/public/junta/directiva-2_resultado.webp";
import presidente from "@/public/junta/directiva-3_resultado.webp";
import finanzas from "@/public/junta/directiva-4_resultado.webp";
import vicepresidente from "@/public/junta/directiva-6.webp";
import Eventos from "@/public/junta/directiva-5.webp";

const miembros = [
  { nombre: "Lcda. Maulin Milano", cargo: "Presidente (a)", foto: presidente },
  { nombre: "Lcdo. Edgar Pérez", cargo: "Vicepresidente (a)", foto: vicepresidente },
  { nombre: "Lcdo. José Otto Rodríguez", cargo: "Secretario (a) de actas", foto: actas },
  { nombre: "Lcda. Zuleyma Gómez", cargo: "Director (a) academico", foto: academico },
  { nombre: "Lcdo. Carlos Ramírez", cargo: "Director (a) de finanzas", foto: finanzas },
  { nombre: "Lcda. loengri ricoberi", cargo: "Director (a) de eventos", foto: Eventos },
];

const Autoridades = () => {
  return (
    <section id="autoridades" className="py-24 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Nuestras autoridades</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-foreground">
            Junta Directiva Interina Actual
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Profesionales comprometidos que lideran el rumbo de la Colegio de Optometristas de Venezuela.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {miembros.map((m) => (
            <article
              key={m.nombre}
              className="group rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-elegant transition-all hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden bg-secondary">
                <Image
                  src={m.foto}
                  blurDataURL={m.foto.blurDataURL}
                  alt={`Retrato de ${m.nombre}, ${m.cargo} de la Colegio de Optometristas de Venezuela`}
                  loading="lazy"
                  width={512}
                  height={512}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-foreground/40 to-transparent" />
              </div>
              <div className="p-5 text-center">
                <h3 className="font-display font-bold text-foreground text-lg">{m.nombre}</h3>
                <p className="mt-1 text-sm text-accent font-semibold">{m.cargo}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Autoridades;
