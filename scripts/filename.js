const fs = require('fs');

function fileName(name, checkAvail = true) {
  if (name !== undefined) {
    const fileName = `src/${name}.ts`;
    if (checkAvail === false || fs.existsSync(`${__dirname}/../${fileName}`) === true) {
      return fileName;
    }
  }
  return 'src/app.ts';
}
module.exports = { fileName };
