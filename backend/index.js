// Servidor principal Express: expone endpoints de traducción y CRUD de historial
import express from "express";
import cors from "cors";
// Modelo de Gemini (IA) para generar traducciones
import { model } from "./src/libs/gemini.js";
// Cliente Supabase para persistir traducciones
import { supabase } from "./src/libs/supabase.js";

const app = express(); // Instancia de la aplicación Express
const PORT = process.env.PORT || 3000; // Puerto configurable vía variable de entorno

app.use(express.json()); // Parseo de JSON en body de las peticiones
app.use(cors("*")); // Habilita CORS para cualquier origen (simplificación)

// 🔹 Crear nueva traducción (genera texto con Gemini y guarda en Supabase)
app.post("/translate", async (req, res) => {
  const { source_text, source_lang, target_lang } = req?.body;

  if (!source_text || !source_lang || !target_lang) {
    // Validación mínima de campos requeridos
    return res
      .status(400)
      .json({ message: "Datos incorrectos no se puede traducir" });
  }

  try {
    // Prompt enfocado: pide sólo la traducción sin extras
    const prompt = `Traduce el siguiente texto en ${source_lang} a ${target_lang}. Importante: responde únicamente con la traducción y nada más. Texto: ${source_text}`;

    const { response } = await model.generateContent(prompt); // Llamada al modelo IA

    if (!response) {
      // Caso raro: la API no devuelve respuesta estructurada
      return res.status(500).json({ message: "Error en la traducción" });
    }

    const translated_text = response.text(); // Extrae el texto traducido

    // Objeto a insertar en base de datos
    const traduction = {
      source_text,
      translated_text,
      source_lang,
      target_lang,
    };

    // Insert y devolver el registro completo con id
    const { data, error } = await supabase
      .from("translations")
      .insert(traduction)
      .select("*")
      .single();

    if (error) {
      // Error al insertar en Supabase
      console.log(error);
      return res
        .status(500)
        .json({ message: "Ocurrió un error al procesar la traducción" });
    }

    return res.status(200).json({ data }); // Respuesta exitosa
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error inesperado al traducir" });
  }
});

// 🔹 Obtener historial de traducciones (lista completa)
app.get("/translations", async (req, res) => {
  const { data, error } = await supabase.from("translations").select("*");
  if (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Ocurrió un error al obtener las traducciones" });
  }

  res.json({ data });
});

// 🔹 Eliminar una traducción por id
app.delete("/translations/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(400)
      .json({ message: "Datos incorrectos no se puede eliminar" });

  const { error } = await supabase.from("translations").delete().eq("id", id); // Borrado

  if (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Ocurrió un error al borrar la traducción" });
  }

  res.status(204).json({ message: "Borrado exitosamente" }); // 204: sin body de datos
});

// 🔹 Editar traducción (recalcula el texto traducido con nuevo source_text)
app.patch("/translations/:id", async (req, res) => {
  const { id } = req.params;

  const { source_text, source_lang, target_lang } = req.body; // Campos a actualizar
  console.log(req.body); // Log simple para depuración

  if (!id || !source_text || !source_lang || !target_lang)
    return res
      .status(400)
      .json({ message: "Datos incorrectos, no se puede editar la traducción" });

  // 🧠 Recalcular nueva traducción a partir del source_text editado
  const prompt = `Traduce el siguiente texto en ${source_lang} a ${target_lang}. Importante: responde únicamente con la traducción y nada más. Texto: ${source_text}`;

  const { response } = await model.generateContent(prompt); // Llamada al modelo para nueva traducción

  if (!response)
    return res
      .status(500)
      .json({ message: "Error al recalcular la traducción" });

  const translated_text = response.text(); // Nuevo texto traducido

  // 🗄️ Actualizar registro en Supabase
  const { data, error } = await supabase
    .from("translations")
    .update({
      source_text,
      translated_text,
      source_lang,
      target_lang,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Ocurrió un error al actualizar la traducción" });
  }

  // ✅ Responder con la nueva traducción actualizada
  res.status(200).json({ data: data });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`); // Inicio del servidor
});
