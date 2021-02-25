const fs = require('fs');
const { templateName, fileName } = require('./filename');
const template = process.argv[2];
const path = fileName(process.argv[3], false);

fs.copyFileSync(`templates/${template}.template.ts`, path);
