import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

const browser = process.env.BROWSER || 'chrome';

function copyExtensionFiles() {
  return {
    name: 'copy-extension-files',
    writeBundle() {
      const manifest = JSON.parse(readFileSync('manifest.json', 'utf-8'));

      if (browser === 'firefox') {
        manifest.background = { scripts: ['background.js'] };
        manifest.browser_specific_settings = {
          gecko: { id: 'smartwallet@example.com', strict_min_version: '109.0' },
        };
      }

      writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));
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
