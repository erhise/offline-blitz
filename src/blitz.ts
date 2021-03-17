import { readFileSync } from 'fs';
import { watch } from 'chokidar';
import { SandboxManager } from './sandbox-manager';
import { buildUi, clearUi } from './interface';

export function blitz(filePath: string, disableUi: boolean = false) {
  // Set standard out to either terminal or ui output
  const log = disableUi ? process.stdout : buildUi();
  const clearLog = disableUi ? console.clear : clearUi;

  // Instantiate sandbox manager and use it to run file.
  const sandboxMgr: SandboxManager = new SandboxManager(filePath, log, clearLog);

  // Watch file for changes and run it when changed.
  // @TODO: Watch imported files for changes as well.
  runSandbox(filePath, sandboxMgr);
  const watcher = watch(filePath).on('change', (changedPath) => {
    runSandbox(changedPath, sandboxMgr);
  });

  // Clean up the sandbox manager and wather on exit.
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

