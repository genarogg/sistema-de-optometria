'use client';

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Img from "next/image";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
  open: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose, open }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[448px] max-w-[95vw] h-[600px] p-0 z-[1000000]">
        <VisuallyHidden>
          <DialogTitle>Imagen del Comprobante</DialogTitle>
        </VisuallyHidden>
        <div className="relative w-full h-full">
          <Img
            src={imageUrl}
            alt="Comprobante"
            fill
            className="object-contain"
            sizes="448px"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
