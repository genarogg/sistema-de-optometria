import { HeartHandshake, ShieldCheck, Award, Briefcase, Mountain } from "lucide-react";

const valores = [
  { icon: HeartHandshake, label: "Compromiso" },
  { icon: ShieldCheck, label: "Disciplina" },
  { icon: Award, label: "Responsabilidad" },
  { icon: Briefcase, label: "Profesionalismo" },
  { icon: Mountain, label: "Perseverancia" },
];

const Valores = () => {
  return (
    <section id="valores" className="py-24 bg-secondary/40">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Nuestros pilares</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-foreground">Valores</h2>
          <p className="mt-4 text-muted-foreground">
            Los principios que guían cada acción de nuestra sociedad gremial.
          </p>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {valores.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="group rounded-2xl bg-card border border-border/60 p-6 text-center shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mx-auto w-14 h-14 rounded-xl bg-gradient-hero grid place-items-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-7 h-7" />
              </div>
              <p className="font-display font-bold text-foreground">{label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Valores;
