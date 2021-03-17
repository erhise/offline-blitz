import { fork, ChildProcess } from 'child_process';
import { Writable } from 'stream';

export class SandboxManager {
  private readySandbox: ChildProcess;
  private runningSandbox: ChildProcess | null = null;

  constructor(private filePath: string, private log: Writable, private clearLog: () => void) {
    // Instantiate a new sandbox for immediate use.
    this.readySandbox = this.newSandbox();
  }

  public run(code: string) {
    // Clear log from previous output
    this.clearLog();
    // Kill any previously running sandbox.
    if (this.runningSandbox !== null) {
      this.runningSandbox.stdout?.unpipe(this.log);
      this.runningSandbox.kill();
    }
    // Send code to be run to the ready sandbox and swap it to a newly created one.
    this.readySandbox.send!({ code });
    this.runningSandbox = this.readySandbox;
    this.readySandbox = this.newSandbox();
  }

  public runAction(action: string) {
    this.runningSandbox?.send({ action });
  }

  public tearDown(): void {
    // Kill all sandboxes.
    this.readySandbox.kill();
    if (this.runningSandbox !== null) {
      this.runningSandbox.kill();
    }
  }

  private newSandbox() {
    // Create a new child process where the sandbox will live.
    const sandbox = fork(__dirname + '/eval.js', [this.filePath], { stdio: 'pipe' });
    // Set up error and exit hooks.
    sandbox.on('message', this.onExecutionError(sandbox));
    sandbox.on('exit', this.onSandboxAborted);
    // Pipe outout from sandbox to stdout/gui
    sandbox.stdout?.pipe(this.log);
    return sandbox;
  }

  private onExecutionError(sandbox: ChildProcess) {
    // Display error and kill sandbox on execution error.
    return ({ executionError }) => {
      if (executionError !== undefined) {
        this.log.write('=============\n\nSandbox execution error:\n' + executionError);
        sandbox.kill();
      }
    };
  }

  private onSandboxAborted(exitCode: number) {
    // Teardown and exit on abort code.
    if (exitCode === 130) {
      this.tearDown();
      process.exit(0);
    }
  }
}

