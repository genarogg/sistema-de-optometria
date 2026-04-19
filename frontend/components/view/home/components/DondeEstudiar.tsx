import { GraduationCap, MapPin } from "lucide-react";
import imgUniversity from "@/public/university.jpg";
import Image from "next/image";

const universidades = [
  "Universidad de las Ciencias de la Salud",
  "Universidad Nacional Experimental Rómulo Gallegos",
];

const DondeEstudiar = () => {
  return (
    <section id="estudiar" className="py-24 bg-secondary/40">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-2xl rounded-full" />
          <Image
            src={imgUniversity}
            blurDataURL={imgUniversity.blurDataURL}
            alt="Campus universitario en Venezuela donde se imparte la carrera de Optometría"
            loading="lazy"
            width={1200}
            height={800}
            className="relative rounded-3xl shadow-elegant object-cover aspect-[4/3] w-full"
          />
        </div>

        <div className="order-1 lg:order-2">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Formación</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-foreground">
            ¿Dónde estudiar Optometría?
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Actualmente hay <strong className="text-foreground">2 universidades en Venezuela</strong> que
            tienen en su formación académica la carrera de Optometría:
          </p>

          <ul className="mt-8 space-y-4">
            {universidades.map((u) => (
              <li
                key={u}
                className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-elegant transition-shadow"
              >
                <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-hero grid place-items-center text-primary-foreground">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-display font-bold text-foreground">{u}</p>
                  <p className="text-sm text-muted-foreground inline-flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> Venezuela
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DondeEstudiar;
