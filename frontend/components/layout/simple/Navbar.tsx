import { Eye } from "lucide-react";

const links = [
  { href: "#mision", label: "Misión" },
  { href: "#valores", label: "Valores" },
  { href: "#lineas", label: "Líneas de acción" },
  { href: "#estudiar", label: "¿Dónde estudiar?" },
  { href: "#congresos", label: "Congresos" },
  { href: "#colegiarte", label: "Colegiarte" },
  { href: "#biblioteca", label: "Biblioteca" },
  { href: "#historia", label: "Historia" },
  { href: "#autoridades", label: "Autoridades" },
  { href: "#contacto", label: "Contacto" },
];

const Navbar = () => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
      <nav className="container flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-gradient-hero text-primary-foreground shadow-soft">
            <Eye className="w-5 h-5" />
          </span>
          <span className="text-foreground">SVO</span>
        </a>
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-primary transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contacto"
          className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Únete
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
