import { Users, GraduationCap, Scale, Stethoscope, Heart } from "lucide-react";

const lineas = [
  {
    icon: Users,
    title: "Agremiación",
    desc: "Unimos a los profesionales de la optometría en una sola voz fuerte y representativa.",
  },
  {
    icon: GraduationCap,
    title: "Educación",
    desc: "Capacitación continua y actualización profesional con estándares internacionales.",
  },
  {
    icon: Scale,
    title: "Legislación",
    desc: "Impulsamos el reconocimiento legal y la regulación de la carrera en Venezuela.",
  },
  {
    icon: Stethoscope,
    title: "Ejercicio Profesional",
    desc: "Garantizamos prácticas éticas y de calidad en el cuidado ocular y visual.",
  },
  {
    icon: Heart,
    title: "Compromiso Social",
    desc: "Atención visual a comunidades de menos recursos como bandera permanente.",
  },
];

const LineasAccion = () => {
  return (
    <section id="lineas" className="py-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Hacia dónde vamos</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-foreground">Líneas de acción</h2>
          <p className="mt-4 text-muted-foreground">
            Cinco frentes estratégicos para transformar la optometría venezolana.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lineas.map(({ icon: Icon, title, desc }, i) => (
            <article
              key={title}
              className="relative rounded-2xl p-7 bg-gradient-card border border-border/60 shadow-soft hover:shadow-elegant transition-all duration-500 group overflow-hidden"
            >
              <div className="absolute top-4 right-5 font-display font-extrabold text-6xl text-primary/5 group-hover:text-primary/10 transition-colors">
                0{i + 1}
              </div>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary grid place-items-center mb-5 group-hover:bg-gradient-hero group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LineasAccion;
