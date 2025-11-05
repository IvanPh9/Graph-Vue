import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"

import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [vue(), tailwindcss()],
    server: {
        host: 'localhost',
        port: 3030,
        strictPort: false,
        open: true
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    }
})