import blessed from 'blessed';
import { EventEmitter } from 'events';
import { Writable } from 'stream';
import {
  LOGO_OPTIONS,
  COMMAND_BAR_OPTIONS,
  MAIN_LOG_OPTIONS,
  ACTION_LOG_OPTIONS,
  ACTION_LIST_OPTIONS
} from './ui-options';

interface Action {
  title: string;
  callback: () => boolean;
}

const DEFAULT_COMMANDS = {
  ' Exit': {
    keys: ['q', 'C-c', 'escape'],
    callback: () => process.exit(130),
  },
  ' Restart': {
    keys: ['r'],
    callback: () => uiEvent.emit('restart')
  },
  ' Clear': {
    keys: ['c'],
    callback: () => { log.setContent(''); if (actionLog !== null) actionLog.setContent(''); }
  },
};

const uiEvent = new EventEmitter();

const uiLog: Writable = new Writable({
  objectMode: true,
  write: (chunk, _, next) => {
    log.log(chunk.toString().trim());
    next();
  }
});

const screen = blessed.screen({
  title: 'Offline Blitz',
});
const log = blessed.log({ ...MAIN_LOG_OPTIONS, parent: screen });
let actionLog: blessed.Widgets.Log | null = null;
let actionList: blessed.Widgets.ListElement | null = null;
let sandboxActions: Array<Action> = [];

function clearUi(): void {
  log.setContent('');
  if (actionLog !== null) {
    actionLog.setContent('');
  }
}

function registerUiActions(actions: Array<string>) {
  if (actionLog === null && actionList === null) {
    log.width = '85%';
    actionLog = blessed.log({ ...ACTION_LOG_OPTIONS, parent: screen });
    actionList = blessed.list({ ...ACTION_LIST_OPTIONS, parent: screen });
    sandboxActions = actions.map(action => ({ title: action, callback: () => uiEvent.emit('action', action) }));
    /* @ts-ignore */
    actionList.setItems(actions);
    actionList.focus();
  }
}

function buildMenuCommands(actions: boolean) {
  return actions === true ? {
    ...DEFAULT_COMMANDS,
    ' Action': {
      keys: ['n', 'enter'],
      callback: () => {
        /* @ts-ignore */
        if (sandboxActions[actionList.selected] !== undefined) {
          /* @ts-ignore */
          sandboxActions[actionList.selected].callback();
          /* @ts-ignore */
          actionLog.log(sandboxActions[actionList.selected].title);
        }
      }
    }
  } : DEFAULT_COMMANDS;
}

export function initUi(actions?: Array<string>) {
  if (actions !== undefined) {
    registerUiActions(actions);
  }
  blessed.text({ ...LOGO_OPTIONS, parent: screen });
  /* @ts-ignore */
  blessed.listbar({ ...COMMAND_BAR_OPTIONS, parent: screen, commands: buildMenuCommands(actions !== undefined) });
  screen.render();

  return {
    log: uiLog,
    clearLog: clearUi,
    uiEvent
  };
}

