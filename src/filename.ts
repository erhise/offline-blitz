import fs from 'fs';

// TODO: this temporary defaults to examples folder test file
export function fileName(name: string = 'examples/test-file.ts') {
  return name;
}

export function extendWorkingDirectory(
  workingDirectory: string,
  fileName: string,
) {
  return `${workingDirectory}/${fileName}`;
}

// TODO: this method can be rewritten
// right now it throws error
export function resolvePath(path: string) {
  if (fs.existsSync(path) === true) {
    return path;
  } else {
    throw Error(`file with path ${path} does not exist`);
  }
}

