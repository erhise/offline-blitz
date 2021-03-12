process.on('message', (code) => {
  try {
    eval(code);
  } catch (executionError) {
    if (process.send !== undefined) {
      process.send(executionError.toString());
    }
  }
});
