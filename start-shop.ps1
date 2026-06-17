# start-shop.ps1 — Windows PowerShell
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverProcess = $null
$clientProcess = $null

function Stop-Shop {
    Write-Host ""
    Write-Host "Stopping services..."
    if ($clientProcess -and !$clientProcess.HasExited) {
        Stop-Process -Id $clientProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Host "  Angular client stopped"
    }
    if ($serverProcess -and !$serverProcess.HasExited) {
        Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Host "  Express server stopped"
    }
}

try {
    Write-Host "=== Installing dependencies ==="
    Write-Host "  Server..."
    Push-Location "$root\sn-webshop-server"
    npm install --silent
    Pop-Location

    Write-Host "  Client..."
    Push-Location "$root\sn-webshop-client"
    npm install --silent
    Pop-Location

    Write-Host ""
    Write-Host "=== Starting services ==="

    $serverProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm run server:start" `
        -WorkingDirectory "$root\sn-webshop-server" -PassThru -NoNewWindow
    Write-Host "  Express server started (PID $($serverProcess.Id)) -> http://localhost:3000"

    $clientProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm run client:start" `
        -WorkingDirectory "$root\sn-webshop-client" -PassThru -NoNewWindow
    Write-Host "  Angular client started (PID $($clientProcess.Id)) -> http://localhost:4200"

    Write-Host ""
    Write-Host "Shop is running. Press Ctrl+C to stop."
    Write-Host ""

    # Wait until user presses Ctrl+C
    while ($true) {
        Start-Sleep -Seconds 1
        if ($serverProcess.HasExited -or $clientProcess.HasExited) {
            Write-Host "A service exited unexpectedly."
            break
        }
    }
}
finally {
    Stop-Shop
}
