import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createLocalApiApp } from './api/app.js';

function localApiPlugin() {
  const apiApp = createLocalApiApp();

  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url.startsWith('/api')) {
          return apiApp(req, res, next);
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url.startsWith('/api')) {
          return apiApp(req, res, next);
        }
        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), localApiPlugin()],
    server: {
      host: '127.0.0.1'
    },
    preview: {
      host: '127.0.0.1'
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
            'motion-vendor': ['gsap', 'lenis', 'split-type', 'swiper']
          }
        }
      }
    }
  };
});
