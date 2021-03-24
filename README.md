<h1 align="center">
  <br>
  <img src="/img/offline-blitz.png" alt="offline-blitz">
  <br>
  offline-blitz
  <br>
</h1>

<h4 align="center">Sandboxing unplugged.</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#dependencies">Dependencies</a>
</p>

<!-- ![screenshot](/img/screen-rec.gif) -->

## Key Features

* Run sandbox tests

See [CHANGELOG](CHANGELOG.md) for latest features/fixes.

## How To Use
To run this application. From your command line:

```bash
# Install package globally
$ npm install -g offline-blitz

# Run sandbox
$ offline-blitz <filename>
```

### Options
* `-n, --no-gui` Run without gui, using only stdout.
* `-a, --action <action>` Specify one or more actions that should be callable from the sandbox environment. `<action>` should correspond with function names in the file being tested. Actions can be provided either one by one or using a comma separated list. Actions will be ignored when using the `-n` option.

### Examples

```bash
# This will make functions action1() and action2() callable at will from within the sandbox.
$ offline-blitz -a action1 -a action2 <filename>

# This is equavilent to the above example.
$ offline-blitz -a action1,action2 <filename>

# This will run offline-blitz without gui, using stdout. Any actions provided will be ignored.
$ offline-blitz -n <filename>
```

## Dependencies

* chokidar: watch files for changes
* ts-node: compile and run typescript code
* blessed: interactive ui
* arg: parse command line arguments

