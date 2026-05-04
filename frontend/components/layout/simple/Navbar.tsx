import { Eye, Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <nav className="flex items-center h-16 px-2 sm:px-4 md:px-6 lg:px-8 max-w-screen-2xl mx-auto justify-between">

        {/* ── Izquierda ── */}
        <div className="flex items-center shrink-0 md:w-[120px] lg:w-[140px]">

          {/* Hamburguesa — solo móvil */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[360px] px-0">
                <SheetHeader className="px-6 text-left">
                  <SheetTitle asChild>
                    <a href="#" className="flex flex-col leading-tight">
                      <span className="text-primary text-sm font-bold">Colegio de Optometristas</span>
                      {/* <span className="text-primary text-xs opacity-80">de Venezuela</span> */}
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 px-6">
                  <ScrollArea className="h-[calc(100vh-120px)]">
                    <ul className="flex flex-col">
                      {links.map((l) => (
                        <li key={l.href}>
                          <SheetClose asChild>
                            <a
                              href={l.href}
                              className="text-base font-medium text-muted-foreground hover:text-primary transition-colors block py-3 border-b border-border/40"
                            >
                              {l.label}
                            </a>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo — solo desktop */}
          <a href="#" className="hidden md:flex items-center gap-2 font-display font-bold">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-hero text-primary-foreground shadow-soft shrink-0">
              <Eye className="w-4 h-4" />
            </span>
            <span className="text-foreground text-base">CVO</span>
          </a>
        </div>

        {/* ── Centro ── */}

        {/* Nombre — solo móvil */}
   

        <div className="flex md:hidden flex-col leading-tight text-center">
          <a href="#" className="flex flex-col leading-tight text-center">
          <span className="text-primary text-[14px] sm:text-sm font-bold">
            Colegio de Optometristas
          </span>
          <span className="text-primary text-[10px] sm:text-xs opacity-80">
            de Venezuela
          </span>
        </a>
      </div>

      {/* Links — solo desktop: máximo 2 líneas */}
      <div className="hidden md:flex flex-1 justify-center overflow-hidden px-3">
        <ul
          className="flex items-center justify-center gap-x-3 lg:gap-x-5 gap-y-0.5 text-xs lg:text-sm font-medium text-muted-foreground flex-wrap"
          style={{ maxHeight: "2.8rem", overflow: "hidden" }}
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="hover:text-primary transition-colors whitespace-nowrap leading-tight block"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Derecha ── */}
      <div className="flex justify-end shrink-0 md:w-[120px] lg:w-[140px]">
        <a
          href="/dashboard/login"
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs lg:text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Login
        </a>
      </div>

    </nav >
    </header >
  );
};

export default Navbar;