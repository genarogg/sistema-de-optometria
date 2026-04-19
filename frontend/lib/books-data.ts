export type Genre =
  | "Ficcion"
  | "No Ficcion"
  | "Ciencia Ficcion"
  | "Fantasia"
  | "Misterio"
  | "Historia"
  | "Biografia"
  | "Tecnologia";

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: Genre;
  year: number;
  pages: number;
  rating: number;
  available: boolean;
  cover: string;
}

export const INITIAL_BOOKS: Book[] = [
  {
    id: 1,
    title: "Cien Anos de Soledad",
    author: "Gabriel Garcia Marquez",
    genre: "Ficcion",
    year: 1967,
    pages: 432,
    rating: 4.8,
    available: true,
    cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
  },
  {
    id: 2,
    title: "El Senor de los Anillos",
    author: "J.R.R. Tolkien",
    genre: "Fantasia",
    year: 1954,
    pages: 1178,
    rating: 4.9,
    available: false,
    cover: "https://covers.openlibrary.org/b/id/8743161-L.jpg",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    genre: "Ciencia Ficcion",
    year: 1949,
    pages: 328,
    rating: 4.7,
    available: true,
    cover: "https://covers.openlibrary.org/b/id/8575708-L.jpg",
  },
  {
    id: 4,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "Historia",
    year: 2011,
    pages: 443,
    rating: 4.6,
    available: true,
    cover: "https://covers.openlibrary.org/b/id/8739161-L.jpg",
  },
  {
    id: 5,
    title: "El Codigo Da Vinci",
    author: "Dan Brown",
    genre: "Misterio",
    year: 2003,
    pages: 454,
    rating: 4.1,
    available: false,
    cover: "https://covers.openlibrary.org/b/id/8231720-L.jpg",
  },
  {
    id: 6,
    title: "Steve Jobs",
    author: "Walter Isaacson",
    genre: "Biografia",
    year: 2011,
    pages: 630,
    rating: 4.5,
    available: true,
    cover: "https://covers.openlibrary.org/b/id/8258819-L.jpg",
  },
  {
    id: 7,
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Tecnologia",
    year: 2008,
    pages: 431,
    rating: 4.4,
    available: true,
    cover: "https://covers.openlibrary.org/b/id/7898616-L.jpg",
  },
  {
    id: 8,
    title: "Dune",
    author: "Frank Herbert",
    genre: "Ciencia Ficcion",
    year: 1965,
    pages: 688,
    rating: 4.7,
    available: false,
    cover: "https://covers.openlibrary.org/b/id/8225261-L.jpg",
  },
];

export const GENRES: Genre[] = [
  "Ficcion",
  "No Ficcion",
  "Ciencia Ficcion",
  "Fantasia",
  "Misterio",
  "Historia",
  "Biografia",
  "Tecnologia",
];

export const GENRE_COLORS: Record<Genre, string> = {
  Ficcion: "bg-violet-100 text-violet-700",
  "No Ficcion": "bg-amber-100 text-amber-700",
  "Ciencia Ficcion": "bg-cyan-100 text-cyan-700",
  Fantasia: "bg-emerald-100 text-emerald-700",
  Misterio: "bg-orange-100 text-orange-700",
  Historia: "bg-yellow-100 text-yellow-700",
  Biografia: "bg-pink-100 text-pink-700",
  Tecnologia: "bg-blue-100 text-blue-700",
};
