const fs = require('fs');
const path = require('path');

const routes = [
  'innovate-with-ballerina',
  'ieeextreme',
  'moraxtreme',
  'ieee-summer-school',
  'morauxplore',
];

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  throw new Error('dist/index.html not found. Run vite build before creating static routes.');
}

for (const route of routes) {
  const routeDir = path.join(distDir, route);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.copyFileSync(indexPath, path.join(routeDir, 'index.html'));
}

fs.copyFileSync(indexPath, path.join(distDir, '404.html'));

console.log(`Created static route fallbacks for ${routes.length} event routes.`);
