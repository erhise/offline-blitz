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

if (args._[0] === undefined) {
  console.log("Usage: offline-blitz [<options>] <filename>");
  process.exit(1);
}
const path = resolvePath(
  extendWorkingDirectory(
    process.cwd(),
    fileName(args._[0])
  )
);

blitz(path, args['--no-gui']);
