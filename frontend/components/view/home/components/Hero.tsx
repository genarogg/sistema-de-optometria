import Image from "next/image";
import ImgHeroEye from "@/public/hero-eye.jpg"

const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-soft">
      <div className="absolute inset-0 -z-10 opacity-40 [background:radial-gradient(60%_60%_at_50%_0%,hsl(var(--primary-glow)/0.25),transparent_70%)]" />
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-secondary text-secondary-foreground uppercase">
            Sociedad Venezolana de Optometría
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-6xl font-extrabold leading-[1.05] text-foreground">
            Velando por la <span className="text-gradient">salud visual</span> de Venezuela
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Una organización gremial sin fines de lucro que impulsa los más altos estándares
            de educación, ejercicio profesional y cuidado ocular en todo el país.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#mision" className="px-6 py-3 rounded-full font-semibold bg-primary text-primary-foreground shadow-soft hover:shadow-elegant transition-shadow">
              Conoce nuestra misión
            </a>
            <a href="#lineas" className="px-6 py-3 rounded-full font-semibold border border-border text-foreground hover:bg-secondary transition-colors">
              Líneas de acción
            </a>
          </div>
        </div>

        <div className="relative animate-scale-in">
          <div className="absolute -inset-6 bg-gradient-hero opacity-20 blur-3xl rounded-full" />
          <Image
            blurDataURL={ImgHeroEye.blurDataURL}
            src={ImgHeroEye}
            alt="Ojo humano con iris detallado representando el cuidado visual y la optometría"
            width={1600}
            height={1024}
            className="relative rounded-3xl shadow-elegant object-cover aspect-[4/3] w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
