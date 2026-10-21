const { spawnSync } = require('node:child_process');
const path = require('node:path');
const build = require('./build-dashboard-data');
const openFile = require('./lib/open');

const cypress = spawnSync('npx', ['cypress', 'run', ...process.argv.slice(2)], { stdio: 'inherit', shell: true });

build();
openFile(path.resolve('dashboard', 'index.html'));

process.exit(cypress.status ?? 1);
