const { ensureValidPath, fileName } = require('./scripts/filename');
const { register } = require('ts-node');
const { watch } = require('chokidar');
const { readFileSync } = require('fs');
const { fork } = require('child_process');

const path = ensureValidPath(fileName(process.argv[2]));

const tsCompiler = register({
  scope: true,
  transpileOnly: true,
});

blitz(path, tsCompiler);

function blitz(filePath, compiler) {
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

function logger(...msg) {
  console.clear();
  console.log(new Date(), ...msg);
}

function runSandbox(filePath, compiler) {
  const code = compile(filePath, compiler);
  return code !== null ? newSandbox(code) : null;
}

function compile(filePath, { compile }) {
  const code = readFileSync(filePath, 'utf-8');
  try {
    return compile(code, filePath);
  } catch (compilationError)  {
    console.log('Compilation error:\n', compilationError);
  }
  return null;
}

function newSandbox(code) {
  const sandbox = fork('eval.js');
  sandbox.on('message', onExecutionError(sandbox));
  sandbox.on('exit', onSandboxAborted(sandbox));
  sandbox.send(code);
  return sandbox;
}

function onExecutionError(sandbox) {
  return (executionError) => {
    console.log('Execution error:\n', executionError);
    sandbox.kill();
  };
}

function onSandboxAborted(sandbox) {
  return (exitCode) => {
    if (exitCode === 130) {
      sandbox.kill();
      process.exit(0);
    }
  };
}

