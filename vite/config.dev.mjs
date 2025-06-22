import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

console.log(path.resolve(__dirname, 'src'))

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        react(),
    ],
    server: {
        port: 8080
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src'), // Set '@' to point to 'src'
        },
    },
})
