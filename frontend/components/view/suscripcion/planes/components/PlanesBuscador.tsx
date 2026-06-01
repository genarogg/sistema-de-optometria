'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface PlanesBuscadorProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCreateClick?: () => void;
}

export default function PlanesBuscador({
  searchTerm,
  onSearchChange,
  onCreateClick,
}: PlanesBuscadorProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="w-full min-md:max-w-[320px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por tipo o ID..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      {onCreateClick && (
        <Button onClick={onCreateClick} className="w-full md:w-auto" variant="outline">
          Crear Plan
        </Button>
      )}
    </div>
  );
}
