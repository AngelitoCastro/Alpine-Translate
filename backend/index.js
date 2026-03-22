// Servidor principal Express: expone endpoints de traducción y CRUD de historial
import express from "express";
import cors from "cors";

const app = express(); // Instancia de la aplicación Express
const PORT = process.env.PORT || 3000; // Puerto configurable vía variable de entorno

app.use(express.json()); // Parseo de JSON en body de las peticiones
app.use(cors("*")); // Habilita CORS para cualquier origen (simplificación)

// Rutas centralizadas del módulo translate
import translateRoutes from "./src/routes/translate.route.js";
app.use(translateRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`); // Inicio del servidor
});
