const { ensureValidPath, fileName } = require('./scripts/filename');
const child_process = require('child_process');

const interactive = process.argv[2] === 'interactive';
const path = ensureValidPath(fileName(interactive ? process.argv[3] : process.argv[2]));

const FLAGS = ['--quiet', '--clear', '--exit-child', '--transpile-only'];

if (!interactive) {
    FLAGS.push('--respawn');
}

child_process.spawn('ts-node-dev', [...FLAGS, path], {
    stdio: 'inherit'
});
