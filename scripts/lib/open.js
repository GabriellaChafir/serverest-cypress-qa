const { spawnSync } = require('node:child_process');

module.exports = function openFile(file) {
  const opener = process.platform === 'win32' ? ['cmd', ['/c', 'start', '""', file]]
    : process.platform === 'darwin' ? ['open', [file]]
    : ['xdg-open', [file]];
  spawnSync(opener[0], opener[1], { stdio: 'ignore' });
};
