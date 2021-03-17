import Module from 'module';
import { dirname } from 'path';
import { register, createRepl, ReplService } from 'ts-node';

function getRepl(filePath: string): ReplService {
  // Register a new tsNode compiler instance.
  const tsCompiler = register({
    scope: true,
    transpileOnly: true,
  });

  // @TODO: Review this part at some point. Mostly copied how ts-node does this.
  const module = new Module(filePath);
  module.filename = filePath;
  module.paths = (Module as any)._nodeModulePaths(filePath.substring(0, filePath.lastIndexOf('/')));
  (global as any).__filename = module.filename;
  (global as any).__dirname = dirname(module.filename);
  (global as any).exports = module.exports;
  (global as any).module = module;
  (global as any).require = module.require.bind(module);

  // Return a new repl service wherein the sandbox will live.
  return createRepl({ service: tsCompiler });
}

// Exit if called without a path.
if (process.argv[2] === undefined) {
  console.error('No file specified');
  process.exit(1);
}

const filePath = process.argv[2];

// Get a new repl instance.
const repl: ReplService = getRepl(filePath);

// Listen for code to run in sandbox.
process.on('message', ({ code }) => {
  if (code !== undefined) {
    try {
      // Run sandbox with provided code.
      console.log(new Date().toISOString(), "sandbox running");
      repl.evalCode(code);
    } catch (executionError) {
      // Catch any execution error and pass on to parent process.
      if (process.send !== undefined) {
        process.send(executionError.toString());
      }
    }
  }
});
