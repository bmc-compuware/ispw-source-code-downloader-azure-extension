# Local testing — BMC AMI DevX Source Code Download

Run the Azure Pipelines task on your machine without a pipeline agent.

## Prerequisites

- Node.js `>= 24.22.1` (see `downloadertask/package.json` → `engines`)
- Network access to your CES host
- A CES token (for `authenticationType: TOKEN`)

## One-time setup

From `downloadertask/`:

```powershell
npm install
```

Copy the example input files and fill in real values (these files are gitignored — do not commit them):

```powershell
cd ..\local-test
Copy-Item inputs.container.json.example inputs.container.json
Copy-Item inputs.repository.json.example inputs.repository.json
```

Edit `inputs.container.json` / `inputs.repository.json`:

| Field | Notes |
|-------|--------|
| `cesUrl` | e.g. `http://host:48226` (TOKEN auth; avoid CERT locally) |
| `connectionId` | `host:port#codePage` e.g. `cw09.bmc.com:47624#1047` |
| `cesSecretToken` | CES secret token — keep out of git |
| `containerId` / `containerType` | Container download only |
| `stream` / `application` / `repositoryLevel` | Repository download only |
| `sourceDownloadLocation` | Leave empty to use `local-test/download` |

## Run

From `downloadertask/`:

```powershell
npm test                 # uses inputs.container.json
npm run test:container
npm run test:repository  # uses inputs.repository.json
```

Or:

```powershell
node ..\local-test\run.js --inputs ..\local-test\inputs.container.json
```

Downloaded source lands under `local-test/download/` by default.

## What is committed vs local-only

| Path | Commit? |
|------|---------|
| `run.js`, `run.ps1`, `HELP.md` | Yes |
| `*.json.example` | Yes (placeholders only) |
| `inputs.container.json`, `inputs.repository.json` | **No** (gitignored) |
| `download/`, `_agent/` | **No** (gitignored) |

## Auth note

Prefer `authenticationType: TOKEN` with an `http://` CES URL for local runs. CERT / Azure Key Vault needs a real Azure service connection and is not supported by this local runner.
