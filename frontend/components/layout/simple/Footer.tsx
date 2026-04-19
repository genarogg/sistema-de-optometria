import { Eye, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contacto" className="bg-gradient-hero text-primary-foreground">
      <div className="container py-16 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-xl">
            <span className="grid place-items-center w-9 h-9 rounded-lg bg-primary-foreground/10 backdrop-blur">
              <Eye className="w-5 h-5" />
            </span>
            Sociedad Venezolana de Optometría
          </div>
          <p className="mt-4 text-sm text-primary-foreground/80 max-w-xs">
            Promoviendo la excelencia profesional y el cuidado visual en Venezuela.
          </p>
        </div>

        <div>
          <h4 className="font-display font-bold mb-4">Contacto</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> contacto@svoptometria.org</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Caracas, Venezuela</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold mb-4">Únete</h4>
          <p className="text-sm text-primary-foreground/80 mb-4">
            Forma parte del gremio que está transformando la optometría venezolana.
          </p>
          <a
            href="mailto:contacto@svoptometria.org"
            className="inline-flex px-5 py-2.5 rounded-full font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors"
          >
            Agremiarme
          </a>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-5 text-center text-xs text-primary-foreground/70">
        © {new Date().getFullYear()} Sociedad Venezolana de Optometría. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
