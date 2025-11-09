// Cliente oficial de la API Generative AI de Google (Gemini)
import { GoogleGenerativeAI } from "@google/generative-ai";

// API Key obtenida de variables de entorno
const apiKey = process.env.GEMINI_API_KEY;
// Instancia principal para acceder a modelos generativos
const genAI = new GoogleGenerativeAI(apiKey);
// Se obtiene el modelo concreto que usaremos para traducciones rápidas
export const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash", // Variante "flash" optimizada para velocidad
  systemInstruction: "", // Espacio para instrucciones globales si se requieren
});
