import { readFileSync } from 'fs';
import { watch } from 'chokidar';
import { register } from 'ts-node';
import { fork } from 'child_process';
import { ensureValidPath, fileName } from './scripts/filename';

const path = ensureValidPath(fileName(process.argv[2]));

const tsCompiler = register({
  scope: true,
  transpileOnly: true,
});

blitz(path, tsCompiler);

function blitz(filePath: any, compiler: any) {
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

function runSandbox(filePath: string, compiler: any) {
  const code = compile(filePath, compiler);
  return code !== null ? newSandbox(code) : null;
}

function compile(filePath: string, { compile }: any) {
  const code = readFileSync(filePath, 'utf-8');
  try {
    return compile(code, filePath);
  } catch (compilationError)  {
    console.log('Compilation error:\n', compilationError);
  }
  return null;
}

function newSandbox(code: any) {
  const sandbox = fork('lib/eval.js');
  sandbox.on('message', onExecutionError(sandbox));
  sandbox.on('exit', onSandboxAborted(sandbox));
  if (sandbox.send !== undefined) {
    sandbox.send(code);
  }
  return sandbox;
}

function onExecutionError(sandbox: any) {
  return (executionError: Error) => {
    console.log('Execution error:\n', executionError);
    sandbox.kill();
  };
}

function onSandboxAborted(sandbox: any) {
  return (exitCode: any) => {
    if (exitCode === 130) {
      sandbox.kill();
      process.exit(0);
    }
  };
}

