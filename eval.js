process.on('message', (code) => {
  try {
    eval(code);
  } catch (executionError) {
    process.send(executionError.toString());
  }
});
