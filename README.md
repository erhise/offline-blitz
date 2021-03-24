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
  <a href="#how-to-use">How To Use</a>
</p>

<!-- ![screenshot](/img/screen-rec.gif) -->

## Key Features

* Run sandbox tests

See [CHANGELOG](CHANGELOG.md) for latest features/fixes.

## Dependencies (and why they are needed)

* chokidar: watch files for changes
* ts-node: compile and run typescript code
* blessed: interactive ui
* arg: parse command line arguments

## How To Use
To run this application. From your command line:

```bash
# Install package globally
$ npm install -g offline-blitz

# Run sandbox
$ offline-blitz <filename>
```
