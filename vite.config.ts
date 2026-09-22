import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],base:'./',build:{rollupOptions:{input:{game:'index.html',remake:'remake.html'},output:{manualChunks:id=>id.includes('node_modules')?'vendor':undefined}}}});
