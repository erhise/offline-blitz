import { fork, ChildProcess } from 'child_process';

export class SandboxManager {
  private readySandbox: ChildProcess;
  private runningSandbox: ChildProcess | null = null;

  constructor(private filePath: string) {
    // Instantiate a new sandbox for immediate use.
    this.readySandbox = this.newSandbox();
  }

  public run(code: string) {
    // Kill any previously running sandbox.
    if (this.runningSandbox !== null) {
      this.runningSandbox.kill();
    }
    // Send code to be run to the ready sandbox and swap it to a newly created one.
    if (this.readySandbox.send !== undefined) {
      this.readySandbox.send({ code });
      this.runningSandbox = this.readySandbox;
      this.readySandbox = this.newSandbox();
    }
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
    const sandbox = fork(__dirname + '/eval.js', [this.filePath]);
    // Set up error and exit hooks.
    sandbox.on('message', this.onExecutionError(sandbox));
    sandbox.on('exit', this.onSandboxAborted);

    return sandbox;
  }

  private onExecutionError(sandbox: ChildProcess) {
    // Display error and kill sandbox on execution error.
    return (executionError: Error) => {
      console.log('Execution error:\n', executionError);
      sandbox.kill();
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

