import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    plugins: [react()],
    base: './',

    resolve: {
      alias: isDev
        ? {
            // In local dev, point @appdeploy/client at a stub so Vite can
            // resolve the import without crashing. The stub returns null from
            // getUser() so the app lands on the landing page without errors.
            '@appdeploy/client': path.resolve(
              __dirname,
              'src/lib/appdeploy-stub.ts'
            ),
          }
        : {},
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        maxParallelFileOps: 128,
        // In production the AppDeploy platform injects both packages at
        // runtime via its own script loader — do not bundle them.
        external: ['@appdeploy/client', '@appdeploy/sdk'],
      },
    },
  };
});
