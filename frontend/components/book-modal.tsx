"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Book, GENRES, Genre } from "@/lib/books-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookModalProps {
  open: boolean;
  editingBook: Book | null;
  onClose: () => void;
  onSave: (book: Omit<Book, "id"> & { id?: number }) => void;
}

const EMPTY_FORM = {
  title: "",
  author: "",
  genre: "Ficcion" as Genre,
  year: new Date().getFullYear(),
  pages: 0,
  rating: 0,
  available: true,
  cover: "",
};

export function BookModal({ open, editingBook, onClose, onSave }: BookModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (editingBook) {
      setForm({
        title: editingBook.title,
        author: editingBook.author,
        genre: editingBook.genre,
        year: editingBook.year,
        pages: editingBook.pages,
        rating: editingBook.rating,
        available: editingBook.available,
        cover: editingBook.cover,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editingBook, open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(editingBook ? { ...form, id: editingBook.id } : form);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 id="modal-title" className="text-lg font-semibold text-foreground">
            {editingBook ? "Editar libro" : "Agregar libro"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="title">Titulo</Label>
              <Input
                id="title"
                placeholder="Titulo del libro"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="author">Autor</Label>
              <Input
                id="author"
                placeholder="Nombre del autor"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="genre">Genero</Label>
              <Select
                value={form.genre}
                onValueChange={(value) =>
                  setForm({ ...form, genre: value as Genre })
                }
              >
                <SelectTrigger id="genre" className="w-full">
                  <SelectValue placeholder="Selecciona un genero" />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="year">Ano de publicacion</Label>
              <Input
                id="year"
                type="number"
                placeholder="2024"
                min={1000}
                max={new Date().getFullYear()}
                value={form.year}
                onChange={(e) =>
                  setForm({ ...form, year: Number(e.target.value) })
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pages">Paginas</Label>
              <Input
                id="pages"
                type="number"
                placeholder="300"
                min={1}
                value={form.pages}
                onChange={(e) =>
                  setForm({ ...form, pages: Number(e.target.value) })
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rating">Rating (0 - 5)</Label>
              <Input
                id="rating"
                type="number"
                placeholder="4.5"
                min={0}
                max={5}
                step={0.1}
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: Number(e.target.value) })
                }
                required
              />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="cover">URL de portada (opcional)</Label>
              <Input
                id="cover"
                type="url"
                placeholder="https://..."
                value={form.cover}
                onChange={(e) => setForm({ ...form, cover: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2.5">
              <Label htmlFor="available" className="cursor-pointer select-none text-sm">
                Disponible para prestamo
              </Label>
              <Switch
                id="available"
                checked={form.available}
                onCheckedChange={(checked) =>
                  setForm({ ...form, available: checked })
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-border mt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:opacity-90">
              {editingBook ? "Guardar cambios" : "Agregar libro"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
