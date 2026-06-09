import Image from "next/image";

import autoridad1 from "@/public/junta/autoridad1.webp";
import autoridad2 from "@/public/junta/autoridad2.webp";
import autoridad3 from "@/public/junta/autoridad3.webp";
import autoridad4 from "@/public/junta/autoridad4.webp";
import autoridad5 from "@/public/junta/autoridad5.webp";
import autoridad6 from "@/public/junta/autoridad6.webp";
import autoridad7 from "@/public/junta/autoridad7.webp";
import autoridad8 from "@/public/junta/autoridad8.webp";


const miembros = [
  { nombre: "Lcda. Maulin Milano", cargo: "Presidente (a)", foto: autoridad1 },
  { nombre: "Lcdo. Edgar Pérez", cargo: "Vicepresidente (a)", foto: autoridad2 },
  { nombre: "Lcdo. José Otto Rodríguez", cargo: "Secretario (a) de actas", foto: autoridad3 },
  { nombre: "Lcda. Zuleyma Gómez", cargo: "Director (a) academico", foto: autoridad4 },
  { nombre: "Lcdo. Carlos Ramírez", cargo: "Director (a) de finanzas", foto: autoridad5 },
  { nombre: "Lcda. loengri ricoberi", cargo: "Director (a) de eventos", foto: autoridad6 },
  { nombre: "Lcda. Maulin Milano (Duplicado)", cargo: "Presidente (a) (Duplicado)", foto: autoridad7 },
  { nombre: "Lcdo. Edgar Pérez (Duplicado)", cargo: "Vicepresidente (a) (Duplicado)", foto: autoridad8 },
  
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

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
