import { MapPin, Phone, Mail } from "lucide-react";

const items = [
  {
    icon: MapPin,
    title: "Visítanos",
    lines: ["El Marqués. Quinta Isabelita, Calle Araure,", "Caracas 1071, Miranda, Venezuela."],
  },
  {
    icon: Phone,
    title: "Llámanos",
    lines: ["+58 (0212) 242.24.47", "+58 (0212) 242.20.69"],
  },
  {
    icon: Mail,
    title: "Contáctanos",
    lines: ["Covzlaoficial@gmail.com"],
  },
];

const Contacto = () => {
  const address = "El Marqués, Quinta Isabelita, Calle Araure, Caracas 1071, Miranda, Venezuela";
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <section id="contacto" className="py-24 bg-secondary/40">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Contacto</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-foreground">
            Estamos para atenderte
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Acércate a nuestra sede, escríbenos o llámanos. Tu voz fortalece al gremio.
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="grid sm:grid-cols-1 gap-5">
            {items.map(({ icon: Icon, title, lines }) => (
              <article
                key={title}
                className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-elegant transition-shadow"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-hero grid place-items-center text-primary-foreground">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground text-lg">{title}</h3>
                  {lines.map((l) => (
                    <p key={l} className="text-sm text-muted-foreground mt-1">
                      {l}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border border-border/60 shadow-elegant min-h-[400px]">
            <iframe
              title="Ubicación Sociedad Venezolana de Optometría"
              src={mapsSrc}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[400px] border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
