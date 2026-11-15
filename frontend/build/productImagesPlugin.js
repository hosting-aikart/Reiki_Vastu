// Vite plugin: builds the product image list from public/Products_images.
//
// Files named "<Product> view <n>.jpeg" (or .jpg / .png / .webp) are grouped by
// product name and sorted by view number. The website imports the result as
// `virtual:product-images`, so adding, replacing or removing a photo needs no
// code change: drop the file in the folder and rebuild (the dev server reloads
// by itself).
//
// Each URL ends with "?v=<fingerprint of the file's contents>". Replacing a
// photo with a new one of the same name changes the fingerprint, so browsers
// fetch the new photo instead of showing an old copy from their cache.

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Encodes spaces etc. but keeps "+" as is: some static servers don't decode "%2B"
const encodeFileName = (file) => encodeURIComponent(file).replace(/%2B/g, '+');

const VIRTUAL_ID = 'virtual:product-images';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;
const FOLDER = 'Products_images';
const FILE_PATTERN = /^(.+?)\s+view\s+(\d+)\s*\.(jpe?g|png|webp)$/i;

function fingerprint(file) {
  return crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 10);
}

function scan(dir) {
  const groups = {};
  if (!fs.existsSync(dir)) return groups;

  for (const file of fs.readdirSync(dir)) {
    const match = file.match(FILE_PATTERN);
    if (!match) continue;
    const name = match[1].trim();
    (groups[name] ||= []).push({ view: Number(match[2]), file });
  }

  const manifest = {};
  for (const [name, views] of Object.entries(groups)) {
    views.sort((a, b) => a.view - b.view);
    // One URL per view number, even if e.g. "view 1.jpeg" and "view 1.png" both exist
    const seen = new Set();
    manifest[name] = views
      .filter(({ view }) => !seen.has(view) && seen.add(view))
      .map(({ file }) => `/${FOLDER}/${encodeFileName(file)}?v=${fingerprint(path.join(dir, file))}`);
  }
  return manifest;
}

export default function productImagesPlugin() {
  let dir;

  return {
    name: 'product-images',
    configResolved(config) {
      dir = path.join(config.publicDir, FOLDER);
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      return `export default ${JSON.stringify(scan(dir), null, 2)};`;
    },
    configureServer(server) {
      // Reload the page when photos are added, renamed or removed during development
      server.watcher.add(dir);
      const refresh = (file) => {
        if (!file.startsWith(dir)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh);
      server.watcher.on('unlink', refresh);
      server.watcher.on('change', refresh); // a photo replaced under the same name
    }
  };
}
