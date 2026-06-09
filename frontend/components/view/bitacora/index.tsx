"use client";

import React, { memo, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClipboardList } from "lucide-react";
import { useBitacoraStore } from "./store/bitacoraStore";
import { useBitacoraFilters } from "./hook/useBitacoraFilters";
import { useGetBitacora } from "./hook/useGetBitacora";
import BitacoraTable from "./BitacoraTable";
import BitacoraCardList from "./BitacoraCard";
import BitacoraToolbar from "./BitacoraToolbar";
import { BitacoraDetailModal } from "./BitacoraDetailModal";
import BitacoraPagination from "./BitacoraPagination";
import { useIsMobile } from "@/hooks/use-mobile";
import type { BitacoraEntry } from "./store/bitacoraStore";

const BitacoraView = memo(function BitacoraView() {
  // Kick off data fetching (watches store filters automatically)
  useGetBitacora();

  const { loading, meta, filters, setFilters, entries } = useBitacoraStore();
  const isMobile = useIsMobile();

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const [selectedEntry, setSelectedEntry] = React.useState<BitacoraEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleViewDetails = React.useCallback((entry: BitacoraEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setIsModalOpen(false);
    setSelectedEntry(null);
  }, []);

  return (
    <Card className="w-full  max-w-[1200] m-auto my-4">
      <CardHeader className="pb-0 border-b" style={{
        paddingBottom: 0
      }}>
        <div className="flex items-center justify-between ">
          <CardTitle className="flex items-center gap-2 text-lg text-primary">
            <ClipboardList className="h-5 w-5" aria-hidden="true" />
            Bitácora
          </CardTitle>
        </div>


      </CardHeader>
      <CardHeader>

        {/* Search + filter toolbar */}
        <BitacoraToolbar />

      </CardHeader>

      <CardContent className="pt-4 max-sm:px-0 max-sm:px-0 max-sm:max-w-[96vw]">

        {isMobile ? (
          <BitacoraCardList
            entries={entries}
            loading={loading}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <BitacoraTable
            entries={entries}
            loading={loading}
            onViewDetails={handleViewDetails}
          />
        )}

        <BitacoraDetailModal
          record={selectedEntry}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
        
        {meta.total > 0 && (
          <BitacoraPagination
            currentPage={filters.page}
            totalPages={meta.total}
            setCurrentPage={handlePageChange}
          />
        )}
      </CardContent>
    </Card>
  );
});

export default BitacoraView;
