import express from 'express'
import cors from 'cors'
import { model } from './src/libs/gemini.js'
import { supabase } from './src/libs/supabase.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors('*'))

// 🔹 Traducción nueva
app.post('/translate', async (req, res) => {
    const { source_text, source_lang, target_lang } = req?.body

    if (!source_text || !source_lang || !target_lang)
        return res
            .status(400)
            .json({ message: 'Datos incorrectos no se puede traducir' })

    const prompt = `Traduce el siguiente texto en ${source_lang} a ${target_lang}. Importante: responde únicamente con la traducción y nada más. Texto: ${source_text}`

    const { response } = await model.generateContent(prompt)

    if (!response)
        return res.status(500).json({ message: 'Error en la traducción' })

    const translated_text = response.text()

    const traduction = {
        source_text,
        translated_text,
        source_lang,
        target_lang,
    }

    const { error } = await supabase.from('translations').insert(traduction)

    if (error) {
        console.log(error)
        return res
            .status(500)
            .json({ message: 'Ocurrió un error al procesar la traducción' })
    }

    return res.status(200).json({ data: translated_text })
})

// 🔹 Obtener historial
app.get('/translations', async (req, res) => {
    const { data, error } = await supabase.from('translations').select('*')
    if (error) {
        console.log(error)
        return res
            .status(500)
            .json({ message: 'Ocurrió un error al obtener las traducciones' })
    }

    res.json({ data })
})

// 🔹 Eliminar traducción
app.delete('/translations/:id', async (req, res) => {
    const { id } = req.params
    if (!id)
        return res
            .status(400)
            .json({ message: 'Datos incorrectos no se puede eliminar' })

    const { error } = await supabase.from('translations').delete().eq('id', id)

    if (error) {
        console.log(error)
        return res
            .status(500)
            .json({ message: 'Ocurrió un error al borrar la traducción' })
    }

    res.status(204).json({ message: 'Borrado exitosamente' })
})

// 🔹 Editar traducción (recalcular automáticamente)
app.patch('/translations/:id', async (req, res) => {
    const { id } = req.params

    const { source_text, source_lang, target_lang } = req.body
    console.log(req.body)

    if (!id || !source_text || !source_lang || !target_lang)
        return res
            .status(400)
            .json({ message: 'Datos incorrectos, no se puede editar la traducción' })

    // 🧠 Recalcular nueva traducción
    const prompt = `Traduce el siguiente texto en ${source_lang} a ${target_lang}. Importante: responde únicamente con la traducción y nada más. Texto: ${source_text}`

    const { response } = await model.generateContent(prompt)

    if (!response)
        return res.status(500).json({ message: 'Error al recalcular la traducción' })

    const translated_text = response.text()

    // 🗄️ Actualizar en Supabase
    const { data, error } = await supabase
        .from('translations')
        .update({
            source_text,
            translated_text,
            source_lang,
            target_lang,
        })
        .eq('id', id)
        .select('*')
        .single()

    if (error) {
        console.log(error)
        return res
            .status(500)
            .json({ message: 'Ocurrió un error al actualizar la traducción' })
    }

    // ✅ Responder con la nueva traducción
    res.status(200).json({ data : data})
})

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`)
})
