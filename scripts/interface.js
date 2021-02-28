const blessed = require('blessed');
const contrib = require('blessed-contrib');
const util = require('util');

function buildUi(extras = {}) {
  screen = blessed.screen({
    title: 'Offline Blitz',
  });

  grid = new contrib.grid({
    rows: 36,
    cols: 12,
    screen: screen,
  });

  // Create menu
  menubar = blessed.listbar({
    parent: screen,
    keys: true,
    bottom: 0,
    left: 0,
    height: 1,
    style: {
      item: {
        fg: "yellow"
      },
      selected: {
        fg: "yellow"
      }
    },
    commands: buildMenuCommands(extras)
  });
  //
  //grid.set(row, col, rowSpan, colSpan, obj, opts)
  log = grid.set(0,0,35,12, contrib.log, {
    fg: 'green',
    selectedFg: 'green',
    label: 'Server log',
  });

  
  screen.render()
}

function buildMenuCommands(extras = {}) {
  let defaultCmds = {
    ' Exit': {
      keys: ['Q-q', 'Q', 'q', 'C-c', 'escape'],
      callback: () => process.exit(0)
    }
  };
  return {...defaultCmds, ...extras};
}

number = 0;
function logObject(object) {
  log.log(`${number++}: ${util.inspect(object, false, null, true)}`);
}

module.exports = {
  logObject,
  buildUi,
};
