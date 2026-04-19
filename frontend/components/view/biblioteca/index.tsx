import { ArrowLeft, Download, BookOpen } from "lucide-react";
import Link from "next/link";
import { libros } from "./libros";
import Image from "next/image";

const BibliotecaPage = () => {
  return (
    <main className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="relative bg-gradient-hero text-primary-foreground py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary-foreground)/0.08)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary-foreground)/0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="container relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="grid place-items-center w-12 h-12 rounded-xl bg-primary-foreground/15 backdrop-blur-sm">
              <BookOpen className="w-6 h-6" />
            </span>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">
              Recursos académicos
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold">
            Biblioteca Digital
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/90 leading-relaxed">
            Explora y descarga nuestra colección de libros y publicaciones
            especializadas en optometría y ciencias de la visión.
          </p>
        </div>
      </header>

      {/* Listado de libros */}
      <section className="py-20">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {libros.map((libro) => (
              <article
                key={libro.id}
                className="group flex flex-col rounded-2xl overflow-hidden bg-card border border-border/60 shadow-soft hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
              >
                {/* Portada */}
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <Image
                    src={libro.portada}
                    alt={`Portada del libro ${libro.titulo}`}
                    width={512}
                    height={704}
                    blurDataURL={libro.portada.blurDataURL}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Contenido */}
                <div className="flex flex-col flex-1 p-6">
                  <h2 className="font-display text-xl font-bold text-foreground leading-tight">
                    {libro.titulo}
                  </h2>
                  <p className="mt-1 text-sm text-accent font-medium">
                    {libro.autor}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                    {libro.descripcion}
                  </p>

                  <a
                    href={libro.pdfUrl}
                    download
                    className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                    Descargar PDF
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BibliotecaPage;
