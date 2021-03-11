import { watch } from 'chokidar';
import { ChildProcess, fork } from 'child_process';
import { readFileSync } from 'fs';
import { register, Service } from 'ts-node';
import { resolvePath, fileName, extendWorkingDirectory } from './filename';

type TSCompiler = Service;

const path = resolvePath(
  extendWorkingDirectory(
    process.cwd(),
    fileName(process.argv[2])
  )
);

const tsCompiler = register({
  scope: true,
  transpileOnly: true,
});

blitz(path, tsCompiler);

function blitz(filePath: string, compiler: TSCompiler) {
  logger('sandbox starting', filePath);
  let sandbox = runSandbox(filePath, compiler);
  watch(filePath).on('change', (changedPath) => {
    logger('sandbox restarting', changedPath);
    if (sandbox !== null) {
      sandbox.kill();
    }
    sandbox = runSandbox(changedPath, compiler);
  });
}

function logger(...msg: string[]) {
  console.clear();
  console.log(new Date(), ...msg);
}

function runSandbox(filePath: string, compiler: TSCompiler) {
  const code = compile(filePath, compiler);
  return code !== null ? newSandbox(code) : null;
}

function compile(filePath: string, compiler: TSCompiler) {
  const code = readFileSync(filePath, 'utf-8');
  try {
    return compiler.compile(code, filePath);
  } catch (compilationError)  {
    console.log('Compilation error:\n', compilationError);
  }
  return null;
}

function newSandbox(code: string) {
  const sandbox = fork(__dirname + '/eval.js');
  sandbox.on('message', onExecutionError(sandbox));
  sandbox.on('exit', onSandboxAborted(sandbox));
  if (sandbox.send !== undefined) {
    sandbox.send(code);
  }
  return sandbox;
}

function onExecutionError(sandbox: ChildProcess) {
  return (executionError: Error) => {
    console.log('Execution error:\n', executionError);
    sandbox.kill();
  };
}

function onSandboxAborted(sandbox: ChildProcess) {
  return (exitCode: number) => {
    if (exitCode === 130) {
      sandbox.kill();
      process.exit(0);
    }
  };
}

