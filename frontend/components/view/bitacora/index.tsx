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
import { FakeRol } from "./fake/enums";
import { useBitacoraStore } from "./store/bitacoraStore";
import { useBitacoraFilters } from "./hook/useBitacoraFilters";
import { useGetBitacora } from "./hook/useGetBitacora";
import BitacoraTable from "./BitacoraTable";
import BitacoraCardList from "./BitacoraCard";
import BitacoraToolbar from "./BitacoraToolbar";
import { BitacoraDetailModal } from "./BitacoraDetailModal";
import { isProd } from "@/env";
import { useIsMobile } from "@/hooks/use-mobile";
import type { BitacoraEntry } from "./store/bitacoraStore";

/**
 * Determines which columns / data to show based on the active fake rol
 * (only relevant in dev; in production use the real user role).
 */
function useFilteredEntries() {
  const { entries, fakeRol } = useBitacoraStore();

  return useMemo(() => {
    if (isProd) return entries; // In prod, server already filters by role
    // In dev, simulate role-based filtering
    if (fakeRol === FakeRol.ESTANDAR) {
      // Standard users see only LOGIN and VIEW entries
      return entries.filter(
        (e) => e.type === "LOGIN" || e.type === "VIEW"
      );
    }
    return entries; // ADMIN and SUPER see everything
  }, [entries, fakeRol]);
}

const BitacoraView = memo(function BitacoraView() {
  // Kick off data fetching (watches store filters automatically)
  useGetBitacora();

  const { loading } = useBitacoraStore();
  const { fakeRol, handleFakeRolChange } = useBitacoraFilters();
  const filteredEntries = useFilteredEntries();
  const isMobile = useIsMobile();

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

  const showRolSelector = isProd ? (fakeRol === FakeRol.ADMIN) : true; // In prod, only show if real user is ADMIN; in dev, always show
  // In production the rol selector is only visible to ADMINs. For simplicity,
  // we rely on fakeRol === FakeRol.ADMIN as the proxy here (wire to your real
  // auth session in production).
  const canSeeRolSelector =
    isProd ? (fakeRol === FakeRol.ADMIN) : true;

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

          {/* Role selector: always in dev, ADMIN-only in prod */}
          {showRolSelector && canSeeRolSelector && (
            <Select
              value={fakeRol}
              onValueChange={(v) => handleFakeRolChange(v as FakeRol)}
            >
              <SelectTrigger
                className="w-40"
                aria-label="Cambiar rol de visualización"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FakeRol).map((rol) => (
                  <SelectItem key={rol} value={rol}>
                    {rol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>


      </CardHeader>
      <CardHeader>

        {/* Search + filter toolbar */}
        <BitacoraToolbar />

      </CardHeader>

      <CardContent className="pt-4">

        {isMobile ? (
          <BitacoraCardList
            entries={filteredEntries}
            loading={loading}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <BitacoraTable
            entries={filteredEntries}
            loading={loading}
            onViewDetails={handleViewDetails}
          />
        )}

        <BitacoraDetailModal
          record={selectedEntry}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </CardContent>
    </Card >
  );
});

export default BitacoraView;
