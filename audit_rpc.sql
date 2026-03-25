-- Crear la función RPC para insertar auditorías saltándose el RLS
CREATE OR REPLACE FUNCTION public.insert_auditoria(
  p_tipo varchar,
  p_entidad varchar,
  p_identidad int,
  p_detalle text,
  p_idusuario int
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insertar directamente en la tabla autorizando como superusuario (SECURITY DEFINER)
  INSERT INTO public.auditorias (tipo, entidad, identidad, detalle, idusuario)
  VALUES (p_tipo, p_entidad, p_identidad, p_detalle, p_idusuario);
END;
$$;
