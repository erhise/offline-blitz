import { Writable } from 'stream';
import util from 'util';
import blessed from 'blessed';

const DEFAULT_DATA = { actions: [], extras: {} };
const interactive = false;
const screen = blessed.screen({
  title: 'Offline Blitz',
});

const log = getLog(screen);

export function buildUi(data: any = {}) {
  getExLog(screen);
  const actionList = getActionList(screen);
  let actions: Array<any> = [];

  if (interactive) {
    actions = data.actions !== undefined ? data.actions : DEFAULT_DATA.actions;
    if (actionList) {
      actionList.setItems(actions.map(action => actions !== null ? action.title : null));
      actionList.focus();
    }
  }

  blessed.text({
    parent: screen,
    content: '      _   _                                \n  _ _|_ _|_ | o ._   _    |_  | o _|_ _  \n (_) |   |  | | | | (/_   |_) | |  |_ /_ \n                                           ',
    top: 0,
    padding: 0,
    left: 0,
    width: 43,
    height: 4,
    fg: 'yellow',
    selectedFg: 'yellow'
  });

  // Create menu
  blessed.listbar({
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
    commands: [{'key': 'q', 'callback': () => process.exit(130) } ],
    items: [],
    autoCommandKeys: true
    //commands: buildMenuCommands({
    //  ...DEFAULT_DATA.extras,
    //  ...data.extras
    //}, actions, actionList, exLog),
  });

  // focus list directly
  screen.render();

  return uiLog;
}

function getActionList(screen: any) {
  return interactive ? blessed.list({
    label: 'Actions',
    parent: screen,
    keys: true,
    vi: true,
    padding: { left: 1, right: 1 },
    style: {
      selected: {
        fg: "black",
        bg: "light-yellow"
      },
      item: {
        fg: 'yellow',
      },
    },
    columnSpacing: 1,
    top: 4,
    left: 0,
    height: 12,
    width: '15%',
    border: {
      type: 'line',
      fg: 11
    }
  }) : null;
}

function getExLog(screen: any) {
  return interactive ? blessed.log({
    label: 'Execution',
    parent: screen,
    fg: 'yellow',
    selectedFg: 'yellow',
    padding: {
      left: 2,
      top: 1,
      right: 2,
      bottom: 1
    },
    border: {
      type: 'line',
      fg: 11
    },
    bottom: 1,
    left: 0,
    top: 16,
    width: '15%'
  }) : null;
}

function getLog(screen: any) {
  return blessed.log({
    label: 'Logging output',
    parent: screen,
    fg: 'light-yellow',
    selectedFg: 'yellow',
    padding: {
      left: 2,
      top: 1,
      right: 2,
      bottom: 1
    },
    border: {
      type: 'line',
      fg: 11
    },
    top: 4,
    bottom: 1,
    right: 0,
    width: interactive ? '85%' : '100%',
  });
}

function buildMenuCommands(extras: any = {}, actions: Array<any>, actionList: any, log: any, exLog: any) {
  let defaultCmds = {
    ' Clear': {
      keys: ['c'],
      callback: () => log.setContent('')
    },
    ' Exit': {
      keys: ['q', 'C-c', 'escape'],
      callback: () => process.exit(130),
    },
    ' Action': {
      keys: ['n', 'enter'],
      callback: () => {
        if (actions[actionList.selected] !== undefined) {
          actions[actionList.selected].callback();
          exLog.log(`${actions[actionList.selected].title} was triggered`);
        }
      },
    },
  };
  return {...defaultCmds, ...extras};
}

const uiLog: Writable = new Writable({ objectMode: true });
uiLog._write = (chunk, _, next) => {
  log.log(util.inspect(chunk.toString().trim()));
  next();
};
export function clearUi(): void {
  log.setContent('');
}
