import arg from 'arg';
import { blitz } from './blitz';
import { resolvePath, fileName, extendWorkingDirectory } from './filename';

function getActionList(args: Array<string>) {
  return args.reduce<Array<string>>((actions, action) => {
    actions.push(...action.split(','));
    return actions;
  }, []);
}

const args = arg({
  '--no-gui': Boolean,
  '--action': [String],
  '--config': String,

  '-n': '--no-gui',
  '-a': '--action',
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

const options = {
  noGui: args['--no-gui'] === true,
  actions: args['--action'] !== undefined ? getActionList(args['--action']) : undefined
};

blitz(path, options);
