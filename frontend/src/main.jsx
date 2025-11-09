// Punto de entrada del frontend: monta el componente raíz en #root
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Estilos globales
import { App } from "./App.jsx";

// Renderiza la aplicación dentro de StrictMode (ayuda a detectar problemas en desarrollo)
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
