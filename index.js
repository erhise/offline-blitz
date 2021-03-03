const { ensureValidPath, fileName } = require('./scripts/filename');
const chokidar = require('chokidar');
const child_process = require('child_process');

const path = ensureValidPath(fileName(process.argv[2]));

let sandbox;

function startSandbox() {
  console.clear();
  console.log(new Date(), "sandbox starting");
  sandbox = child_process.spawn('ts-node', [path], {
    stdio: 'inherit'
  });
  sandbox.on('exit', (exitCode) => {
    if (exitCode === 130) {
      console.log(new Date(), "sandbox aborting");
      process.exit(0);
    }
  });
}

chokidar.watch(path).on('change', () => {
  sandbox.kill();
  startSandbox();
});

startSandbox();
