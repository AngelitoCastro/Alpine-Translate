// Store global con Zustand: centraliza estado de traducción y acciones
import { create } from "zustand";

export const useTranslator = create((set) => ({
  translate: "", // Texto traducido actual
  prompt: "", // Texto de entrada que escribe el usuario
  languageInput: "Español", // Idioma origen por defecto
  languageOutput: "Inglés", // Idioma destino por defecto
  isLoading: false, // Indicador de carga al pedir traducción
  translations: [], // Historial de traducciones
  setTranslate: (translate) => set({ translate }),
  setPrompt: (prompt) => set({ prompt }),
  setLanguageInput: (languageInput) => set({ languageInput }),
  setLanguageOutput: (languageOutput) => set({ languageOutput }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setTranslations: (translations) => set({ translations }),
}));
