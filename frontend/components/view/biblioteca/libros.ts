import libro1 from "@/public/libro-1.jpg";
import libro2 from "@/public/libro-2.jpg";
import libro3 from "@/public/libro-3.jpg";
import libro4 from "@/public/libro-4.jpg";
import libro5 from "@/public/libro-5.jpg";
import libro6 from "@/public/libro-6.jpg";

export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  descripcion: string;
  portada: any;
  pdfUrl: string;
}

export const libros: Libro[] = [
  {
    id: "1",
    titulo: "Fundamentos de Optometría Clínica",
    autor: "Dr. Carlos Méndez",
    descripcion: "Manual completo sobre los principios fundamentales de la optometría clínica moderna.",
    portada: libro1,
    pdfUrl: "#",
  },
  {
    id: "2",
    titulo: "Óptica Oftálmica",
    autor: "Dra. María Rivas",
    descripcion: "Estudio detallado de los principios ópticos aplicados a la corrección visual.",
    portada: libro2,
    pdfUrl: "#",
  },
  {
    id: "3",
    titulo: "Lentes de Contacto: Teoría y Práctica",
    autor: "Dr. Luis Hernández",
    descripcion: "Guía esencial para la adaptación y manejo profesional de lentes de contacto.",
    portada: libro3,
    pdfUrl: "#",
  },
  {
    id: "4",
    titulo: "Patología Ocular",
    autor: "Dra. Ana Castillo",
    descripcion: "Compendio de las principales patologías oculares y su abordaje clínico.",
    portada: libro4,
    pdfUrl: "#",
  },
  {
    id: "5",
    titulo: "Refracción Ocular",
    autor: "Dr. José Pérez",
    descripcion: "Tratado moderno sobre técnicas de refracción y prescripción óptica.",
    portada: libro5,
    pdfUrl: "#",
  },
  {
    id: "6",
    titulo: "Visión Binocular y Estrabismo",
    autor: "Dra. Laura Sánchez",
    descripcion: "Estudio integral de la visión binocular, sus alteraciones y tratamientos.",
    portada: libro6,
    pdfUrl: "#",
  },
];
