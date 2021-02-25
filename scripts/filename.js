const fs = require('fs');

function fileName(name, checkAvail = true) {
  if (name !== undefined) {
    const fileName = `src/${name}.ts`;
    if (checkAvail === false) {
      return fileName;
    }
    try {
      if (fs.existsSync(`${__dirname}/../${fileName}`)) {
        return fileName;
      }
    } catch (error) {}
  }
  return 'src/app.ts';
}
module.exports = { fileName };
