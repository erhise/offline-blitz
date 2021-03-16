import arg from 'arg';
import { blitz } from './blitz';
import { resolvePath, fileName, extendWorkingDirectory } from './filename';

const args = arg({
  '--no-gui': Boolean,
  '--actions': String,
  '--config': String,

  '-n': '--no-gui',
  '-a': '--actions',
  '-c': '--config'
});

const path = resolvePath(
  extendWorkingDirectory(
    process.cwd(),
    fileName(process.argv[2])
  )
);

blitz(path);
