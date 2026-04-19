import Image from "next/image";

import directiva1 from "@/public/directiva-1.jpg";
import directiva2 from "@/public/directiva-2.jpg";
import directiva3 from "@/public/directiva-3.jpg";
import directiva4 from "@/public/directiva-4.jpg";

const miembros = [
  { nombre: "Lcda. Maulin Milano", cargo: "Presidenta interina", foto: directiva1 },
  { nombre: "Lcdo. Edgar Pérez", cargo: "Vicepresidente interino", foto: directiva2 },
  { nombre: "Lcdo. José Otto Rodríguez", cargo: "Tesorero", foto: directiva3 },
  { nombre: "Lcda. Zuleyma Gómez", cargo: "Secretaria de Actas", foto: directiva4 },
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
            Profesionales comprometidos que lideran el rumbo de la Sociedad Venezolana de Optometría.
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
                  alt={`Retrato de ${m.nombre}, ${m.cargo} de la Sociedad Venezolana de Optometría`}
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
