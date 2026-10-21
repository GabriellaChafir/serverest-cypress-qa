const path = require('node:path');
const build = require('./build-dashboard-data');
const openFile = require('./lib/open');

build();
openFile(path.resolve('dashboard', 'index.html'));
