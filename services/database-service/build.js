const { build } = require('esbuild');

build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.js',
  sourcemap: true,
  target: 'es2020',
  format: 'cjs',
  loader: {
    '.node': 'file'
  }
}).catch(() => process.exit(1));
