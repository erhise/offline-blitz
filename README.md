<h1 align="center">
  <br>
  <img src="/img/offline-blitz.png" alt="offline-blitz">
  <br>
  offline-blitz
  <br>
</h1>

<h4 align="center">Sandboxing unplugged.</h4>

<p align="center">
  <a href="#how-to-use">How To Use</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#dependencies">Dependencies</a>
</p>

<!-- ![screenshot](/img/screen-rec.gif) -->

## How To Use
To run this application. From your command line:

```bash
# Install package globally
$ npm install -g offline-blitz

# Run sandbox
$ offline-blitz <filename>

# Use with vim
$ vim ...
```

### Options
* `-n, --no-gui` Run without gui, using only stdout.
* `-a, --action <action>` Specify one or more actions that should be callable from the sandbox environment. `<action>` should correspond with function names in the file being tested. Actions can be provided either one by one or using a comma separated list. Actions will be ignored when using the `-n` option.

## Key Features

* **Sandbox mode:** Run your local ts-files with watch mode
* **Local environment:** Enables to use locally installed packages
```typescript
// my-sandbox-repo/src/sum.ts
import { of } from 'rxjs'; // <-- resolved from locally installed package
import { reduce } from 'rxjs/operators';

const source = of(1000, 300, 30, 7);
const example = source.pipe(reduce((acc, val) => acc + val));
//output: sum: 1337'
example.subscribe(val => console.log('sum:', val));
```
* **Interactive mode => provide actions:** Use provided action to be triggered within interactive mode
```bash
# This will make functions action1() and action2() callable at will from within the sandbox.
$ offline-blitz -a action1 -a action2 <filename>

# This is equavilent to the above example.
$ offline-blitz -a action1,action2 <filename>
```
Short example
```typescript
// ordersum.ts
const price = 149;
let amount = 33;

function setRandomAmount() {
  amount = Math.round(Math.random() * 1000);
  console.log('Amount updated to', amount);
}

function calculateSum() {
  console.log('Total amount is:', price * amount);
}
```
```bash
# Run above example with
$ offline-blitz -a setRandomAmount,calculateSum ordersum.ts
```
* **Simple logging:** Possibility to keep it simple
```bash
# This will run offline-blitz without gui, using stdout. Any actions provided will be ignored.
$ offline-blitz -n <filename>
```
(See [CHANGELOG](CHANGELOG.md) for latest features/fixes)

## Roadmap
#### 0.2.0
* ~Enable interactive gui~
* ~Enable to use provided actions~
#### 0.3.0
* ...

## Dependencies
Stated goal is to keep dependencies as minimal as possible without reinventing the wheel twice.
* chokidar: watch files for changes
* ts-node: compile and run typescript code
* blessed: interactive ui
* arg: parse command line arguments

