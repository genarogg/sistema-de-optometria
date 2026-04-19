// Infinite right-moving marquee of alliance logos.
// Logos rendered as styled SVG placeholders — replace `src` with real assets when available.

const alianzas = [
  "WCO",
  "OMS",
  "FENOOV",
  "IAPB",
  "AOA",
  "FEDOPTO",
  "UCS",
  "UNERG",
  "OPS",
  "Visión 2030",
];

const LogoChip = ({ name }: { name: string }) => (
  <div className="shrink-0 mx-6 flex items-center justify-center h-24 w-48 rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-elegant transition-all duration-300 grayscale hover:grayscale-0">
    <span className="font-display font-extrabold text-xl tracking-tight text-muted-foreground hover:text-primary transition-colors">
      {name}
    </span>
  </div>
);

const Alianzas = () => {
  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...alianzas, ...alianzas];

  return (
    <section id="alianzas" className="py-24 overflow-hidden">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Trabajamos juntos</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-foreground">Alianzas</h2>
          <p className="mt-4 text-muted-foreground">
            Organizaciones e instituciones que respaldan nuestro trabajo.
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex w-max animate-marquee" style={{ animationDirection: "reverse" }}>
          {loop.map((name, i) => (
            <LogoChip key={`${name}-${i}`} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Alianzas;
