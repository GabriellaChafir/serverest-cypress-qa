const { spawnSync } = require('node:child_process');
const path = require('node:path');
const openFile = require('./lib/open');

const cypress = spawnSync('npx', ['cypress', 'run', ...process.argv.slice(2)], { stdio: 'inherit', shell: true });

openFile(path.resolve('cypress', 'reports', 'html', 'index.html'));

process.exit(cypress.status ?? 1);
