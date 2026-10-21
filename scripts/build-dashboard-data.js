const fs = require('node:fs');
const path = require('node:path');

const EVIDENCE_TITLE = 'API: requisições e respostas';
const reportFile = path.resolve('cypress', 'reports', 'html', 'index.json');
const dataDir = path.resolve('dashboard', 'data');
const storeFile = path.join(dataDir, 'results.json');

const collectTests = (suite, out) => {
  (suite.tests || []).forEach((t) => out.push(t));
  (suite.suites || []).forEach((s) => collectTests(s, out));
  return out;
};

const parseContext = (raw) => {
  if (!raw) return [];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
};

const toRecord = (test) => ({
  title: test.title,
  state: test.state,
  duration: test.duration,
  error: test.err && test.err.message ? test.err.message : null,
  evidence: (parseContext(test.context).find((c) => c && c.title === EVIDENCE_TITLE) || {}).value || null,
});

// Cada execução substitui só os specs que rodou; os demais mantêm o último resultado.
function build() {
  if (!fs.existsSync(reportFile)) {
    console.log('Dashboard: nenhum relatório encontrado em cypress/reports/html/index.json');
    return;
  }

  const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
  const store = fs.existsSync(storeFile) ? JSON.parse(fs.readFileSync(storeFile, 'utf8')) : {};
  const ranAt = (report.stats && report.stats.end) || new Date().toISOString();

  (report.results || []).forEach((result) => {
    if (!result.file) return;
    const tests = [];
    (result.suites || []).forEach((suite) => collectTests(suite, tests));
    (result.tests || []).forEach((t) => tests.push(t));
    store[result.file.replace(/\\/g, '/')] = { ranAt, tests: tests.map(toRecord) };
  });

  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(storeFile, JSON.stringify(store, null, 2));
  fs.writeFileSync(path.join(dataDir, 'results.js'), `window.__RESULTS__ = ${JSON.stringify(store)};\n`);
  console.log(`Dashboard: resultados de ${Object.keys(store).length} specs gravados em dashboard/data`);
}

module.exports = build;

if (require.main === module) build();
