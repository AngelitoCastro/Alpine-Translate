# Alpine Translate

Aplicación full‑stack para traducir texto con Gemini y guardar el historial en Supabase.

## 🚀 Tecnologías

- Backend: Node.js + Express 5, Supabase, Google Generative AI (Gemini)
- Frontend: React + Vite, Zustand, Tailwind CSS

## 📦 Estructura

```
backend/
frontend/
```

## ✅ Requisitos

- Node.js 18+
- Cuenta de Supabase (URL y Public anon key)
- API Key de Gemini

## 🔐 Variables de entorno

Crea `backend/.env` con:

```
GEMINI_API_KEY=tu_clave
SUPABASE_URL=https://<tu-instancia>.supabase.co
SUPABASE_KEY=tu_public_anon_key
PORT=4000
```

Opcional en `frontend/.env` (para despliegue):

```
VITE_API_URL=http://localhost:4000
```

## ▶️ Cómo ejecutar

Backend:

```bash
cd backend
pnpm install   # o npm install
pnpm start     # http://localhost:4000
```

Frontend:

```bash
cd frontend
pnpm install
pnpm run dev   # http://localhost:5173
```

Nota: El frontend actualmente llama a `http://localhost:4000/translate` directamente. Puedes parametrizarlo con `VITE_API_URL` si lo prefieres.

## 🔗 Endpoints principales

- POST `/translate`: genera y guarda una traducción
- GET `/translations`: lista el historial
- PATCH `/translations/:id`: recalcula y actualiza una traducción
- DELETE `/translations/:id`: elimina una traducción

## 🧠 Flujo

1. El usuario escribe; un debounce (900 ms) dispara la petición.
2. El backend llama a Gemini y guarda en Supabase.
3. Vuelve un objeto con `id` y `translated_text` que se agrega al historial.
4. Desde el historial puedes editar o borrar entradas.

## 🛠️ Scripts

- Backend: `pnpm start`
- Frontend: `pnpm run dev`, `pnpm run build`, `pnpm run preview`

## 🧭 Directorios clave

- `backend/index.js`: API REST y lógica de traducción/CRUD
- `backend/src/libs/gemini.js`: cliente del modelo Gemini
- `backend/src/libs/supabase.js`: cliente Supabase
- `frontend/src/App.jsx`: UI principal y fetch de traducción
- `frontend/src/components/TranslateHistory.jsx`: historial con edición/borrado
- `frontend/src/stores/translate.js`: estado global con Zustand

## 🧪 Próximos pasos

- Parametrizar la URL del backend vía `VITE_API_URL`
- Añadir tests (Vitest/Jest) para lógica de UI/estado
- Añadir rate limiting al endpoint `/translate`
