import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { cpSync, mkdirSync } from 'fs';

function copyExtensionFiles() {
  return {
    name: 'copy-extension-files',
    writeBundle() {
      cpSync('manifest.json', 'dist/manifest.json');
      cpSync('src/background.js', 'dist/background.js');
      mkdirSync('dist/icons', { recursive: true });
      cpSync('icons', 'dist/icons', { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [react(), copyExtensionFiles()],
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'src/sidepanel/index.html'),
      },
    },
  },
  test: {
    environment: 'node',
  },
});
