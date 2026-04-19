import { Target, Eye } from "lucide-react";

const items = [
  {
    id: "mision",
    icon: Target,
    title: "Misión",
    text: "Somos una organización gremial sin fines de lucro encaminada a velar por los altos estándares de educación y práctica por parte de los profesionales con el apoyo de organizaciones nacionales e internacionales, propiciando el desarrollo de la ciencia de la optometría en nuestro país, generando oportunidades para el desarrollo de la profesión de ópticos y Optometristas. Promover programas de salud del cuidado ocular y visual en comunidades de menos recursos. Establecer alianzas con instituciones educativas públicas y privadas que fomenten la expansión de la carrera. Garantizar la mejora y el desarrollo del cuidado ocular y visual primario por parte de los profesionales del ramo.",
  },
  {
    id: "vision",
    icon: Eye,
    title: "Visión",
    text: "Ser la organización gremial a nivel nacional que haga realidad el reconocimiento de los profesionales por el Estado, la legalización de la carrera y la unión del gremio en Venezuela, a través de acciones con alto grado de responsabilidad social que beneficien a los profesionales y las comunidades, elevando los estándares profesionales mediante capacitaciones continuas de sus agremiados.",
  },
];

const MisionVision = () => {
  return (
    <section className="py-24" id="mision">
      <div className="container grid md:grid-cols-2 gap-8">
        {items.map(({ id, icon: Icon, title, text }) => (
          <article
            key={id}
            id={id}
            className="group relative rounded-3xl bg-gradient-card p-8 md:p-10 border border-border/60 shadow-soft hover:shadow-elegant transition-all duration-500"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-hero grid place-items-center text-primary-foreground shadow-glow group-hover:scale-110 transition-transform duration-500">
                <Icon className="w-7 h-7" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">{title}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-[15px]">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MisionVision;
