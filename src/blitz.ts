import Module from 'module';
import { dirname } from 'path';
import { register, createRepl, ReplService } from 'ts-node';
import { watch } from 'chokidar';
import { ChildProcess, fork } from 'child_process';
import { readFileSync } from 'fs';

//type TSCompiler = Service;

export function blitz(filePath: string) {
  logger('sandbox starting', filePath);

  const repl: ReplService = getRepl(filePath);

  let sandbox = runSandbox(filePath, repl);
  watch(filePath).on('change', (changedPath) => {
    logger('sandbox restarting', changedPath);
    if (sandbox !== null) {
      sandbox.kill();
    }
    sandbox = runSandbox(changedPath, repl);
  });
}

function getRepl(filePath: string): ReplService {
  const tsCompiler = register({
    scope: true,
    transpileOnly: true,
  });

  const module = new Module(filePath);
  module.filename = filePath;
  module.paths = (Module as any)._nodeModulePaths(filePath.substring(0, filePath.lastIndexOf('/')));

  (global as any).__filename = module.filename;
  (global as any).__dirname = dirname(module.filename);
  (global as any).exports = module.exports;
  (global as any).module = module;
  (global as any).require = module.require.bind(module);

  return createRepl({ service: tsCompiler });
}

function logger(...msg: string[]) {
  //console.clear();
  console.log(new Date(), ...msg);
}

function runSandbox(filePath: string, repl: ReplService) {
  const code = readFileSync(filePath, 'utf-8');
  //const code = compile(filePath, compiler);
  return code !== null ? newSandbox(code, repl) : null;
}
/*
function compile(filePath: string, repl: ReplService) {
  let code = readFileSync(filePath, 'utf-8');
  console.log(code);

  try {
    //compiler.evalCode(code);
    return compiler.compile(code, filePath);
  } catch (compilationError)  {
    console.log('Compilation error:\n', compilationError);
  }
  return null;
}
*/
function newSandbox(code: string, repl: ReplService) {
  const sandbox = fork(__dirname + '/eval.js');
  sandbox.on('message', onExecutionError(sandbox));
  sandbox.on('exit', onSandboxAborted(sandbox));
  repl.evalCode(code);
  //if (sandbox.send !== undefined) {
  //  sandbox.send({ code, repl });
  //}
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

