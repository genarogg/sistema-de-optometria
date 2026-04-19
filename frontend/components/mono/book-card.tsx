"use client";

import Image from "next/image";
import { Pencil, Trash2, Star, BookOpen } from "lucide-react";
import { Book, GENRE_COLORS } from "@/lib/books-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
}

export function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative h-52 bg-muted flex items-center justify-center overflow-hidden">
        {book.cover ? (
          <Image
            src={book.cover}
            alt={`Portada de ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <BookOpen className="w-16 h-16 text-muted-foreground" />
        )}
        <span
          className={`absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full ${
            book.available
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {book.available ? "Disponible" : "No disponible"}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4 flex-1">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-foreground leading-snug text-balance line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </div>

        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={`text-xs font-medium ${GENRE_COLORS[book.genre]}`}
          >
            {book.genre}
          </Badge>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            <span className="text-xs font-semibold text-foreground">
              {book.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
          <span>{book.year}</span>
          <span>{book.pages} pags.</span>
        </div>

        <div className="flex items-center gap-2 mt-auto pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => onEdit(book)}
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => onDelete(book.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar
          </Button>
        </div>
      </div>
    </article>
  );
}
