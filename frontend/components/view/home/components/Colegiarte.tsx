import { ShieldCheck, Users, Scale, Heart, Briefcase, Gavel, HandHeart, Megaphone, Sparkles } from "lucide-react";

const razones = [
  {
    icon: Megaphone,
    text: "Ser el órgano representativo y de expresión del gremio.",
  },
  {
    icon: Users,
    text: "Agrupar a todos los profesionales de la óptica y la optometría para promover su defensa, representación y cooperación entre los mismos, a fin de garantizar la eficacia de sus actividades y luchar contra las situaciones de hecho adversas y lesivas a los intereses comunes de los miembros de la misma que puedan surgir.",
  },
  {
    icon: HandHeart,
    text: "Luchar por el logro de reivindicaciones sociales, gremiales, laborales y profesionales de sus miembros.",
  },
  {
    icon: Scale,
    text: "Trabajar en el sentido de hacer realidad una legislación de optometría ajustada a las exigencias del desarrollo profesional y del progreso científico nacional.",
  },
  {
    icon: Heart,
    text: "Trabajar y luchar para que sean incluidos los optometristas en los programas de salud promovidos por el gobierno nacional a través de hospitales, institutos y otros organismos.",
  },
  {
    icon: ShieldCheck,
    text: "Proporcionar un sistema de protección y seguridad al afiliado sobre los riesgos generales derivados del ejercicio profesional.",
  },
  {
    icon: Gavel,
    text: "Actuar de árbitro a través de los órganos competentes en todas aquellas situaciones que puedan presentarse entre sus miembros y entre estos y extraños.",
  },
  {
    icon: Briefcase,
    text: "Organizar acciones conjuntas de los ópticos y optometristas para luchar por todos los medios lícitos en contra de todos aquellos que lesionen los derechos e intereses colectivos profesionales y/o pongan en peligro la salud pública.",
  },
  {
    icon: Sparkles,
    text: "Todo aquello que vaya en beneficio de la asociación y el bien común.",
  },
];

const Colegiarte = () => {
  return (
    <section id="colegiarte" className="py-24 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Agremiación</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-foreground">
            ¿Por qué y cómo colegiarte?
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Forma parte de un gremio que vela por tus derechos profesionales, tu desarrollo y el bienestar
            visual de las comunidades en Venezuela.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {razones.map(({ icon: Icon, text }, idx) => (
            <article
              key={idx}
              className="group relative p-6 rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-elegant transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-hero grid place-items-center text-primary-foreground shadow-soft">
                <Icon className="w-6 h-6" />
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-elegant"
          >
            Quiero colegiarme
          </a>
        </div>
      </div>
    </section>
  );
};

export default Colegiarte;
