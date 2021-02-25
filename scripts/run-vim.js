const { fileName } = require('./filename');
const editor = process.argv[2];
const path = fileName(process.argv[3]);

const child_process = require('child_process')

child_process.spawn(editor, ['-s', 'scripts/vim-sandbox.vim', path], {
  stdio: 'inherit'
});
