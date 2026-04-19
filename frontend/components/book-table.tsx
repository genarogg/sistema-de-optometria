"use client";

import { Pencil, Trash2, Star } from "lucide-react";
import { Book, GENRE_COLORS } from "@/lib/books-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BookTableProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
}

export function BookTable({ books, onEdit, onDelete }: BookTableProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left font-semibold text-foreground px-5 py-3.5">
                Titulo
              </th>
              <th className="text-left font-semibold text-foreground px-5 py-3.5 hidden md:table-cell">
                Autor
              </th>
              <th className="text-left font-semibold text-foreground px-5 py-3.5 hidden lg:table-cell">
                Genero
              </th>
              <th className="text-left font-semibold text-foreground px-5 py-3.5 hidden lg:table-cell">
                Ano
              </th>
              <th className="text-left font-semibold text-foreground px-5 py-3.5 hidden xl:table-cell">
                Paginas
              </th>
              <th className="text-left font-semibold text-foreground px-5 py-3.5">
                Rating
              </th>
              <th className="text-left font-semibold text-foreground px-5 py-3.5">
                Estado
              </th>
              <th className="text-right font-semibold text-foreground px-5 py-3.5">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {books.map((book) => (
              <tr
                key={book.id}
                className="hover:bg-muted/30 transition-colors duration-100"
              >
                <td className="px-5 py-4">
                  <span className="font-medium text-foreground leading-snug">
                    {book.title}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5 md:hidden">
                    {book.author}
                  </p>
                </td>
                <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">
                  {book.author}
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <Badge
                    variant="secondary"
                    className={`text-xs font-medium ${GENRE_COLORS[book.genre]}`}
                  >
                    {book.genre}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-muted-foreground hidden lg:table-cell">
                  {book.year}
                </td>
                <td className="px-5 py-4 text-muted-foreground hidden xl:table-cell">
                  {book.pages}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    <span className="text-xs font-semibold text-foreground">
                      {book.rating.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${book.available
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {book.available ? "Disponible" : "No disponible"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(book)}
                      aria-label={`Editar ${book.title}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(book.id)}
                      aria-label={`Eliminar ${book.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {books.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <p className="text-base font-medium">No se encontraron libros</p>
            <p className="text-sm mt-1">Agrega un libro para comenzar</p>
          </div>
        )}
      </div>
    </div>
  );
}
