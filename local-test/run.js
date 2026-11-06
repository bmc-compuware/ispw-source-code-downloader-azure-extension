#!/usr/bin/env node
/**
 * Local runner for downloadertask.
 * Usage (from downloadertask/):
 *   npm test
 *   npm run test:repository
 *   node ../local-test/run.js --inputs ../local-test/inputs.container.json
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const localTestDir = __dirname;
const taskDir = path.resolve(localTestDir, '..', 'downloadertask');
const downloadDir = path.join(localTestDir, 'download');
const agentTemp = path.join(localTestDir, '_agent', 'temp');
const agentWork = path.join(localTestDir, '_agent', 'work');

function parseArgs(argv) {
  let inputsFile = path.join(localTestDir, 'inputs.container.json');
  for (let i = 2; i < argv.length; i++) {
    if ((argv[i] === '--inputs' || argv[i] === '-i') && argv[i + 1]) {
      inputsFile = path.resolve(process.cwd(), argv[++i]);
    }
  }
  return { inputsFile };
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const { inputsFile } = parseArgs(process.argv);

  if (!fs.existsSync(inputsFile)) {
    console.error(`Inputs file not found: ${inputsFile}`);
    process.exit(1);
  }

  [downloadDir, agentTemp, agentWork].forEach(ensureDir);

  const inputs = JSON.parse(fs.readFileSync(inputsFile, 'utf8'));
  if (!inputs.sourceDownloadLocation) {
    inputs.sourceDownloadLocation = downloadDir;
  }

  const env = {
    ...process.env,
    AGENT_NAME: 'local-agent',
    AGENT_TEMPDIRECTORY: agentTemp,
    AGENT_WORKFOLDER: agentWork,
    BUILD_SOURCESDIRECTORY: localTestDir,
    SYSTEM_DEFAULTWORKINGDIRECTORY: localTestDir,
    AGENT_VERSION: '4.265.1',
  };

  for (const [key, value] of Object.entries(inputs)) {
    env[`INPUT_${key.toUpperCase()}`] = value == null ? '' : String(value);
  }

  console.log(`Node version: ${process.version}`);
  console.log(`Task dir: ${taskDir}`);
  console.log(`Inputs file: ${inputsFile}`);
  console.log(`Download location: ${env.INPUT_SOURCEDOWNLOADLOCATION}`);
  console.log(`downloadSourceType: ${env.INPUT_DOWNLOADSOURCETYPE}`);
  console.log('');

  const result = spawnSync(process.execPath, ['index.js'], {
    cwd: taskDir,
    env,
    stdio: 'inherit',
  });

  process.exit(result.status == null ? 1 : result.status);
}

main();
