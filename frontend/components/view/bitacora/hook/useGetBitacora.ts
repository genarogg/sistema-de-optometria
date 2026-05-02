"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { useBitacoraStore } from "../store/bitacoraStore";
import GET_BITACORA from "../querys/getBitacora";
import { MOCK_BITACORA } from "../fake/mockData";
import { isProd } from "@/env";
import type { AccionesBitacora, Rol } from "../fake/enums";

interface GetBitacoraVars {
  token: string;
  page?: number;
  rol?: Rol | "";
  acciones?: AccionesBitacora | "";
  searchTerm?: string;
}

interface GetBitacoraData {
  getBitacora: {
    type: string;
    message: string;
    meta: { page: number; total: number };
    data: {
        id: number;
        fecha: string;
        mensaje: string;
        type: AccionesBitacora;
        usuario: { 
          email: string;
          cedula?: string;
          rol?: string;
        };
      }[];
  };
}

const DEBOUNCE_MS = 600;

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
}

export function useGetBitacora() {
  const { filters, setEntries, setLoading, setError } = useBitacoraStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [fetchBitacora, { loading, data, error: apolloError }] = useLazyQuery<
    GetBitacoraData,
    GetBitacoraVars
  >(GET_BITACORA, {
    fetchPolicy: "network-only",
  });

  const execute = useCallback(() => {
    const token = getToken();
    const variables: GetBitacoraVars = {
      token,
      page: filters.page,
      ...(filters.rol ? { rol: filters.rol } : {}),
      ...(filters.acciones ? { accion: filters.acciones } : {}),
      ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
    };

    console.log("Fetching bitacora with variables:", variables);
    fetchBitacora({ variables });
  }, [filters, fetchBitacora]);

  // Handle successful data fetch
  useEffect(() => {
    const result = data?.getBitacora;
    if (result) {
      setEntries(result.data, result.meta);
      setError(null);
    }
  }, [data, setEntries, setError]);

  // Handle errors (including mock data fallback in dev)
  useEffect(() => {
    if (apolloError) {
      console.error("[v0] getBitacora error:", apolloError);
      if (isProd) {
        // Fallback to mock data in development when server is unreachable
        setEntries(MOCK_BITACORA, { page: 1, total: MOCK_BITACORA.length });
        setError(null);
      } else {
        setError(apolloError.message);
      }
    }
  }, [apolloError, setEntries, setError]);

  // Debounced re-fetch whenever filters change
  useEffect(() => {
    // Only set loading if we're not already loading
    if (!loading) setLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      execute();
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters, execute, setLoading]);

  // Sync Apollo loading state to store
  useEffect(() => {
    // We only want to set loading to false once Apollo has finished fetching.
    if (!loading) {
      setLoading(false);
    }
  }, [loading, setLoading]);

  return { refetch: execute };
}
