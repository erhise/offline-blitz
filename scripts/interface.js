const blessed = require('blessed');
const contrib = require('blessed-contrib');
const util = require('util');

const DEFAULT_DATA = { actions: [], extras: {} };

function buildUi(data = {}) {
  screen = blessed.screen({
    title: 'Offline Blitz',
  });

  // Create grid
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
    commands: buildMenuCommands({
      ...DEFAULT_DATA.extras,
      ...data.extras
    }),
  });

  // Create list for actions
  actionList = grid.set(0, 0, 15, 4, blessed.list, {
    label: 'Actions',
    parent: screen,
    keys: true,
    vi: true,
    align: 'left',
    selectedFg: 'white',
    selectedBg: 'blue',
    //interactive: false,
    padding: { left: 1, right: 1 },
    style: {
      selected: {
        fg: "black",
        bg: "light-yellow"
      },
      item: {
        fg: 'light-blue',
      },
    },
    columnSpacing: 1,
  });

  // Create exeuction triggered log
  executionLog = grid.set(15, 0, 21, 4, contrib.log, {
    label: 'Execution triggered',
    parent: screen,
    fg: 'green',
    selectedBg: 'blue',
    padding: { left: 1, right: 1 },
  });

  actions = data.actions !== undefined ? data.actions : DEFAULT_DATA.actions;
  actionList.setItems(actions.map(action => action.title));

  //grid.set(row, col, rowSpan, colSpan, obj, opts)
  log = grid.set(0,4,35,8, contrib.log, {
    label: 'Logging output',
    parent: screen,
    fg: 'green',
    selectedFg: 'green',
  });

  // focus list directly
  actionList.focus();
  screen.render();
}

function buildMenuCommands(extras = {}) {
  let defaultCmds = {
    ' Exit': {
      keys: ['Q-q', 'Q', 'q', 'C-c', 'escape'],
      callback: () => process.exit(130),
    },
    ' Action': {
      keys: ['n', 'enter'],
      callback: () => {
        if (actions[actionList.selected] !== undefined) {
          actions[actionList.selected].callback();
          executionLog.log(`${actions[actionList.selected].title} was triggered`);
        }
      },
    },
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
