import { readFileSync } from 'fs';
import { watch } from 'chokidar';
import { SandboxManager } from './sandbox-manager';
import { initUi } from './sandbox-ui';

export function blitz(filePath: string, { noGui, actions }) {
  // Set standard out to either terminal or ui output
  const { log, clearLog, uiEvent = undefined } =
    !noGui
    ? initUi(actions)
    : { log: process.stdout, clearLog: console.clear };

  // Instantiate sandbox manager and use it to run file.
  const sandboxMgr: SandboxManager = new SandboxManager(filePath, log, clearLog);

  // Watch file for changes and run it when changed.
  // @TODO: Watch imported files for changes as well.
  runSandbox(filePath, sandboxMgr);
  const watcher = watch(filePath).on('change', (changedPath) => {
    runSandbox(changedPath, sandboxMgr);
  });

  if (uiEvent !== undefined) {
    // Run action in sandbox on ui event
    uiEvent.on('action', (action) => sandboxMgr.runAction(action));
    // Restart sandbox on restart ui event.
    uiEvent.on('restart', () => runSandbox(filePath, sandboxMgr));
  }

  // Clean up the sandbox manager and watcher on exit.
  process.on('exit', () => {
    sandboxMgr.tearDown()
    watcher.close();
  });
}

function runSandbox(filePath: string, sandboxMgr: SandboxManager) {
  // Read typescript code from file.
  const code = readFileSync(filePath, 'utf-8');
  // Run code in sandbox.
  if (code !== null) {
    sandboxMgr.run(code);
  }
}

