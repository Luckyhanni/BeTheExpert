$ErrorActionPreference = 'Stop'

function Show-ToolStatus {
  param([string]$Name, [string]$Command, [string[]]$Arguments)

  $taskCommand = Get-Command $Command -ErrorAction SilentlyContinue
  if (-not $taskCommand) {
    Write-Host "[FEHLT] $Name" -ForegroundColor Yellow
    return
  }

  $taskVersion = & $Command @Arguments 2>&1 | Select-Object -First 1
  Write-Host "[OK]    $Name - $taskVersion" -ForegroundColor Green
}

Write-Host "Be the Expert - Windows-Check`n" -ForegroundColor Cyan
Show-ToolStatus -Name 'Node.js' -Command 'node' -Arguments @('--version')
Show-ToolStatus -Name 'npm' -Command 'npm' -Arguments @('--version')
Show-ToolStatus -Name 'Git' -Command 'git' -Arguments @('--version')
Show-ToolStatus -Name 'EAS CLI' -Command 'eas' -Arguments @('--version')
Show-ToolStatus -Name 'Android Debug Bridge' -Command 'adb' -Arguments @('--version')

$taskSdkPath = if ($env:ANDROID_HOME) {
  $env:ANDROID_HOME
} else {
  Join-Path $env:LOCALAPPDATA 'Android\Sdk'
}

if (Test-Path -LiteralPath $taskSdkPath) {
  Write-Host "[OK]    Android SDK - $taskSdkPath" -ForegroundColor Green
} else {
  Write-Host "[FEHLT] Android SDK - erwartet unter $taskSdkPath" -ForegroundColor Yellow
}

$taskDrive = Get-PSDrive -Name C
$taskFreeGb = [math]::Round($taskDrive.Free / 1GB, 1)
Write-Host "[INFO]  Freier Speicher C: $taskFreeGb GB"

if ($taskFreeGb -lt 25) {
  Write-Host '[HINWEIS] Vor Android Studio + Emulator besser mindestens 25-30 GB freimachen.' -ForegroundColor Yellow
}
