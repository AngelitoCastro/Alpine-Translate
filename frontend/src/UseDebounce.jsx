import { useState, useEffect } from "react";

// Hook que retrasa (debounce) la propagación de un valor hasta que pasan "delay" ms sin cambios
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value); // estado con el valor "estabilizado"

  useEffect(() => {
    // Programa la actualización tras el periodo indicado
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Si el valor cambia antes de cumplirse el tiempo, se limpia el timeout
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue; // devuelve el valor estabilizado
};
