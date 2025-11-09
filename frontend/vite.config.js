import { defineConfig } from 'vite'; // Helper para config
import react from '@vitejs/plugin-react'; // Soporte React Fast Refresh
import tailwindcss from '@tailwindcss/vite'; // Plugin Tailwind

// Configuración Vite: plugins esenciales
export default defineConfig({
    plugins: [react(), tailwindcss()],
});
