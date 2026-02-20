import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@application/context/AuthContext";
import { favoritosApi } from "@infrastructure/api/favoritos.api";

/**
 * Hook para gestionar favoritos del usuario autenticado.
 * Carga los IDs al montar, expone toggle y check.
 */
export function useFavorites() {
  const { usuario } = useAuth();
  const [favIds, setFavIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  // Cargar favoritos al montar (solo si hay usuario)
  const fetchFavorites = useCallback(async () => {
    if (!usuario) {
      setFavIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const ids = await favoritosApi.getFavoritoIds(usuario.idusuario);
      setFavIds(new Set(ids));
    } catch {
      /* silencioso */
    } finally {
      setLoading(false);
    }
  }, [usuario]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  /** ¿Esta propiedad es favorita? */
  const isFavorito = useCallback(
    (idpropiedad: number) => favIds.has(idpropiedad),
    [favIds],
  );

  /** Agregar o quitar de favoritos */
  const toggleFavorito = useCallback(
    async (idpropiedad: number) => {
      if (!usuario) return;

      const esFav = favIds.has(idpropiedad);

      // Optimistic update
      setFavIds((prev) => {
        const next = new Set(prev);
        if (esFav) next.delete(idpropiedad);
        else next.add(idpropiedad);
        return next;
      });

      try {
        if (esFav) {
          await favoritosApi.removeFavorito(usuario.idusuario, idpropiedad);
        } else {
          await favoritosApi.addFavorito(usuario.idusuario, idpropiedad);
        }
      } catch {
        // Revertir si falla
        setFavIds((prev) => {
          const next = new Set(prev);
          if (esFav) next.add(idpropiedad);
          else next.delete(idpropiedad);
          return next;
        });
      }
    },
    [usuario, favIds],
  );

  return {
    favIds,
    loading,
    isFavorito,
    toggleFavorito,
    refetch: fetchFavorites,
  };
}
