# Optional PowerShell wrapper — prefer npm from downloadertask/:
#   npm test
#   npm run test:repository
#
# Direct usage:
#   .\run.ps1
#   .\run.ps1 -InputsFile .\inputs.repository.json

param(
    [string]$InputsFile = (Join-Path $PSScriptRoot "inputs.container.json")
)

$ErrorActionPreference = "Stop"
$runJs = Join-Path $PSScriptRoot "run.js"
$inputsPath = if ([System.IO.Path]::IsPathRooted($InputsFile)) {
    $InputsFile
} else {
    Join-Path (Get-Location) $InputsFile
}

if (-not (Test-Path $inputsPath)) {
    $inputsPath = Join-Path $PSScriptRoot (Split-Path $InputsFile -Leaf)
}

node $runJs --inputs $inputsPath
