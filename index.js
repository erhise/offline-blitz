const fs = require('fs');
var nodemon = require('nodemon');

const filename = process.argv[2];

let runFile = 'app';
if (filename !== undefined) {
  try {
    if (fs.existsSync(`${__dirname}/src/${filename}.ts`)) {
      runFile = filename;
    }
  } catch (error) {}
}

nodemon(`--quiet --config nodemon.json src/${runFile}.ts`);

nodemon.on('start', () => {
  console.clear();
  console.log('started', new Date().toISOString());
}).on('quit', () => {
  //
}).on('restart', (files) => {
  console.clear();
  console.log('restarted', new Date().toISOString(), files);
});
