import fs from 'fs';
import { fileName } from './filename';
const template = process.argv[2];
const path = fileName(process.argv[3]);

fs.copyFileSync(`templates/${template}.template.ts`, path);
