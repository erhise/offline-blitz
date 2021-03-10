import fs from 'fs';

export function fileName(name: string) {
  return name !== undefined ? `src/${name}.ts` : 'src/app.ts';
}

export function ensureValidPath(path: string) {
  if (fs.existsSync(path) === true) {
    return path;
  } else {
    fs.copyFileSync('templates/app.template.ts', 'src/app.ts');
    return 'src/app.ts';
  }
}

