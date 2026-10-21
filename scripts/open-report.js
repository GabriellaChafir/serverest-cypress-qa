const path = require('node:path');
const openFile = require('./lib/open');

openFile(path.resolve('cypress', 'reports', 'html', 'index.html'));
