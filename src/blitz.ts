import { watch } from 'chokidar';
import { readFileSync } from 'fs';
import { SandboxManager } from './sandbox-manager';

export function blitz(filePath: string) {
  logger('sandbox starting', filePath);

  // Instantiate sandbox manager and use it to run file.
  const sandboxMgr: SandboxManager = new SandboxManager(filePath);
  runSandbox(filePath, sandboxMgr);

  // Watch file for changes and run it when change.
  // @TODO: Watch imported files for changes as well.
  const watcher = watch(filePath).on('change', (changedPath) => {
    logger('sandbox restarting', changedPath);
    runSandbox(changedPath, sandboxMgr);
  });

  // Clean up the sandbox manager and wather on exit.
  process.on('exit', () => {
    sandboxMgr.tearDown()
    watcher.close();
  });
}

function logger(...msg: string[]) {
  console.clear();
  console.log(new Date(), ...msg);
}

function runSandbox(filePath: string, sandboxMgr: SandboxManager) {
  // Read typescript code from file.
  const code = readFileSync(filePath, 'utf-8');
  // Run code in sandbox.
  if (code !== null) {
    sandboxMgr.run(code);
  }
}

