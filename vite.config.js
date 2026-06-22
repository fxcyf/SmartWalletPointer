import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

const target = process.env.TARGET || 'extension';
const browser = process.env.BROWSER || 'chrome';

function copyExtensionFiles() {
  return {
    name: 'copy-extension-files',
    writeBundle() {
      if (target === 'web') {
        mkdirSync('dist-web/icons', { recursive: true });
        cpSync('icons', 'dist-web/icons', { recursive: true });
        cpSync('src/webapp/pwa-manifest.json', 'dist-web/pwa-manifest.json');
        writeFileSync('dist-web/index.html',
          '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=src/webapp/index.html"></head></html>\n');
        return;
      }

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

const extensionConfig = {
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: { sidepanel: resolve(__dirname, 'src/sidepanel/index.html') },
    },
  },
};

const webConfig = {
  base: './',
  build: {
    outDir: 'dist-web',
    rollupOptions: {
      input: { webapp: resolve(__dirname, 'src/webapp/index.html') },
    },
  },
};

export default defineConfig({
  plugins: [react(), copyExtensionFiles()],
  ...(target === 'web' ? webConfig : extensionConfig),
  test: {
    environment: 'node',
  },
});
