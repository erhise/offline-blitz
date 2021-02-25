const { fileName } = require('./scripts/filename');
const nodemon = require('nodemon');

const path = fileName(process.argv[2]);

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
