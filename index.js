const { fileName } = require('./scripts/filename');
const fs = require('fs');
const nodemon = require('nodemon');

const path = fileName(process.argv[2]);

// ensure there are at least something to run
if (path === 'src/app.ts' && fs.existsSync('src/app.ts') === false) {
  fs.copyFileSync('templates/app.template.ts', 'src/app.ts');
}

nodemon(`--quiet --config nodemon.json ${path}`);

nodemon.on('start', () => {
  console.clear();
  console.log('started', new Date().toISOString());
}).on('quit', () => {
  //
}).on('restart', (files) => {
  console.clear();
  console.log('restarted', new Date().toISOString(), files);
});
