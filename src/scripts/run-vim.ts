import { fileName } from './filename';
const editor = process.argv[2];
const path = fileName(process.argv[3]);

import child_process from 'child_process';

child_process.spawn(editor, ['-s', 'scripts/vim-sandbox.vim', path], {
  stdio: 'inherit'
});
