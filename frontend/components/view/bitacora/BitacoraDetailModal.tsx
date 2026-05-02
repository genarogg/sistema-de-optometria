'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { BitacoraEntry } from './store/bitacoraStore';

interface BitacoraDetailModalProps {
  record: BitacoraEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  try {
    const date = isNaN(Number(dateString)) 
      ? new Date(dateString) 
      : new Date(Number(dateString));
      
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } catch {
    return dateString;
  }
};

export const BitacoraDetailModal: React.FC<BitacoraDetailModalProps> = ({
  record,
  isOpen,
  onClose,
}) => {
  if (!record) return null;

  const formattedDate = formatDate(record.fecha);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalles del Registro</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">ID</span>
            <span className="text-sm text-gray-900">{record.id}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Correo</span>
            <span className="text-sm text-gray-900 truncate max-w-[60%]" title={record.usuario.email}>
              {record.usuario.email}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Cédula</span>
            <span className="text-sm text-gray-900">{record.usuario.cedula || 'N/A'}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Rol</span>
            <span className="text-sm text-gray-900">{record.usuario.rol || 'N/A'}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Fecha y Hora</span>
            <span className="text-sm text-gray-900">{formattedDate}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Acción</span>
            <span className="text-sm text-gray-900">{record.type}</span>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Mensaje</span>
            <p className="text-sm text-gray-900 mt-1">{record.mensaje}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
