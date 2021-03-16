process.on('message', ({ code, repl }) => {
  try {
    repl.evalCode(code);
  } catch (executionError) {
    if (process.send !== undefined) {
      process.send(executionError.toString());
    }
  }
});
