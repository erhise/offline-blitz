import { Widgets } from 'blessed';

export const LOGO_OPTIONS: Widgets.TextOptions = {
  content: `offline-blitz v.${require('../package').version}`,
  bottom: 0,
  right: 2,
  height: 1,
  fg: '#FF7A00'
};

export const COMMAND_BAR_OPTIONS: Widgets.ListbarOptions = {
  keys: true,
  bottom: 0,
  left: 0,
  height: 1,
  width: '70%',
  items: [],
  style: {
    item: {
      fg: '#FF7A00'
    },
    selected: {
      fg: '#FF7A00'
    }
  },
  autoCommandKeys: true,
  commands: []
};

const LOG_OPTIONS: Widgets.LogOptions = {
  fg: 'normal',
  padding: {
    left: 2,
    top: 1,
    right: 2,
    bottom: 1
  },
  border: {
    type: 'line',
    fg: 23
  }
};

export const MAIN_LOG_OPTIONS: Widgets.LogOptions = {
  ...LOG_OPTIONS,
  label: 'Logging output',
  bottom: 1,
  right: 0,
  width: '100%'
};

export const ACTION_LOG_OPTIONS: Widgets.LogOptions= {
  ...LOG_OPTIONS,
  label: 'Action history',
  bottom: 1,
  left: 0,
  top: 12,
  width: '15%'
};

export const ACTION_LIST_OPTIONS: Widgets.ListTableOptions = {
  label: 'Actions',
  keys: true,
  vi: true,
  padding: { left: 1, right: 1 },
  style: {
    selected: {
      fg: 'black',
      bg: '#FF7A00'
    },
    item: {
      fg: 'normal',
    },
  },
  columnSpacing: 1,
  left: 0,
  height: 12,
  width: '15%',
  border: {
    type: 'line',
    fg: 23
  }
};

