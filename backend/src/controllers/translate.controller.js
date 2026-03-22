import { model } from "../libs/gemini.js";
import { TranslateModel } from "../models/translate.model.js";

export class TranslateController {
  static _buildPrompt(source_text, source_lang, target_lang) {
    return `Traduce el siguiente texto en ${source_lang} a ${target_lang}. Importante: responde únicamente con la traducción y nada más. Texto: ${source_text}`;
  }

  static async create(req, res) {
    const { source_text, source_lang, target_lang } = req.body;

    if (!source_text || !source_lang || !target_lang) {
      return res.status(400).json({ message: "Datos incorrectos no se puede traducir" });
    }

    try {
      const prompt = TranslateController._buildPrompt(source_text, source_lang, target_lang);
      const { response } = await model.generateContent(prompt);

      if (!response) {
        return res.status(500).json({ message: "Error en la traducción" });
      }

      const translated_text = response.text();

      const traduction = {
        source_text,
        translated_text,
        source_lang,
        target_lang,
      };

      const { data, error } = await TranslateModel.create(traduction);

      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Ocurrió un error al procesar la traducción" });
      }

      return res.status(200).json({ data });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Error inesperado al traducir" });
    }
  }

  static async list(req, res) {
    try {
      const { data, error } = await TranslateModel.list();

      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Ocurrió un error al obtener las traducciones" });
      }

      return res.status(200).json({ data });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Error inesperado al obtener traducciones" });
    }
  }

  static async remove(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Datos incorrectos no se puede eliminar" });
    }

    try {
      const { error } = await TranslateModel.remove(id);

      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Ocurrió un error al borrar la traducción" });
      }

      return res.status(204).json();
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Error inesperado al borrar traducción" });
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const { source_text, source_lang, target_lang } = req.body;

    if (!id || !source_text || !source_lang || !target_lang) {
      return res.status(400).json({ message: "Datos incorrectos, no se puede editar la traducción" });
    }

    try {
      const prompt = TranslateController._buildPrompt(source_text, source_lang, target_lang);
      const { response } = await model.generateContent(prompt);

      if (!response) {
        return res.status(500).json({ message: "Error al recalcular la traducción" });
      }

      const translated_text = response.text();

      const { data, error } = await TranslateModel.update(id, {
        source_text,
        translated_text,
        source_lang,
        target_lang,
      });

      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Ocurrió un error al actualizar la traducción" });
      }

      return res.status(200).json({ data });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Error inesperado al editar traducción" });
    }
  }
}
