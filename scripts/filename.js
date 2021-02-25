const fs = require('fs');

function fileName(name) {
  return name !== undefined ? `src/${name}.ts` : 'src/app.ts';
}

function ensureValidPath(path) {
  if (fs.existsSync(path) === true) {
    return path;
  } else {
    fs.copyFileSync('templates/app.template.ts', 'src/app.ts');
    return 'src/app.ts';
  }
}

module.exports = {
  fileName,
  ensureValidPath,
};
