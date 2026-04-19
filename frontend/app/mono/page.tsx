"use client";

import { useState } from "react";
import { Plus, LayoutGrid, List, Search, BookOpen } from "lucide-react";
import { Book, INITIAL_BOOKS } from "@/lib/books-data";
import { BookCard } from "@/components/mono/book-card";
import { BookTable } from "@/components/mono/book-table";
import { BookModal } from "@/components/mono/book-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type ViewMode = "card" | "table";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.genre.toLowerCase().includes(search.toLowerCase())
  );

  function handleOpenAdd() {
    setEditingBook(null);
    setModalOpen(true);
  }

  function handleOpenEdit(book: Book) {
    setEditingBook(book);
    setModalOpen(true);
  }

  function handleDelete(id: number) {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }

  function handleSave(data: Omit<Book, "id"> & { id?: number }) {
    if (data.id !== undefined) {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === data.id ? ({ ...data, id: data.id! } as Book) : b
        )
      );
    } else {
      const newBook: Book = { ...data, id: Date.now() };
      setBooks((prev) => [newBook, ...prev]);
    }
    setModalOpen(false);
  }

  return (
    <main className="min-h-screen bg-background font-sans">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-primary shrink-0" />
          <span className="text-lg font-bold text-foreground">Biblioteca</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground text-balance">
                Catalogo de libros
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {books.length} libro{books.length !== 1 ? "s" : ""} en total
              </p>
            </div>
            <Button
              onClick={handleOpenAdd}
              className="bg-primary text-primary-foreground hover:opacity-90 gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Agregar libro
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Buscar por titulo, autor o genero..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9 pr-4"
              />
            </div>

            <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-muted/40 self-start sm:self-auto">
              <button
                onClick={() => setViewMode("card")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "card"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Vista tarjeta"
                aria-pressed={viewMode === "card"}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Tarjetas</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "table"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Vista tabla"
                aria-pressed={viewMode === "table"}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Tabla</span>
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
              <Search className="w-10 h-10 opacity-30" />
              <p className="text-base font-medium">
                {search
                  ? `Sin resultados para "${search}"`
                  : "No hay libros aun"}
              </p>
              <p className="text-sm">
                {search
                  ? "Intenta con otro termino de busqueda"
                  : "Agrega un libro para comenzar"}
              </p>
            </div>
          ) : viewMode === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <BookTable
              books={filtered}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          )}
        </Card>
      </div>

      <BookModal
        open={modalOpen}
        editingBook={editingBook}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </main>
  );
}
