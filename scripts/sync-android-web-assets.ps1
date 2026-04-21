param(
    [string]$Target = "D:\dev\VisaPics-Android\app\src\main\assets\public"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$targetRoot = [System.IO.Path]::GetFullPath($Target)

$itemsToSync = @(
    @{ Source = "app\index.html"; Destination = "index.html"; Type = "File" }
    @{ Source = "app\sw.js"; Destination = "sw.js"; Type = "File" }
    @{ Source = "src"; Destination = "src"; Type = "Directory" }
    @{ Source = "styles"; Destination = "styles"; Type = "Directory" }
    @{ Source = "vendor"; Destination = "vendor"; Type = "Directory" }
    @{ Source = "assets"; Destination = "assets"; Type = "Directory" }
    @{ Source = "releases.json"; Destination = "releases.json"; Type = "File" }
    @{ Source = "icon-192.png"; Destination = "icon-192.png"; Type = "File" }
    @{ Source = "icon-512.png"; Destination = "icon-512.png"; Type = "File" }
    @{ Source = "manifest.json"; Destination = "manifest.json"; Type = "File" }
)

if (-not (Test-Path -LiteralPath $targetRoot)) {
    New-Item -ItemType Directory -Path $targetRoot -Force | Out-Null
}

if ($targetRoot -notlike "*\app\src\main\assets\public") {
    throw "Refusing to sync to unexpected target: $targetRoot"
}

$managedDestinations = @()
foreach ($item in $itemsToSync) {
    $managedDestinations += $item.Destination
}

# Remove previously managed copies so deleted files do not linger.
foreach ($destination in $managedDestinations) {
    $targetPath = Join-Path $targetRoot $destination
    if (Test-Path -LiteralPath $targetPath) {
        Remove-Item -LiteralPath $targetPath -Recurse -Force
    }
}

foreach ($item in $itemsToSync) {
    $sourcePath = Join-Path $repoRoot $item.Source
    $destinationPath = Join-Path $targetRoot $item.Destination

    if (-not (Test-Path -LiteralPath $sourcePath)) {
        throw "Missing source path: $sourcePath"
    }

    if ($item.Type -eq "Directory") {
        Copy-Item -LiteralPath $sourcePath -Destination $destinationPath -Recurse -Force
    } else {
        $destinationDir = Split-Path -Parent $destinationPath
        if ($destinationDir -and -not (Test-Path -LiteralPath $destinationDir)) {
            New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
        }
        Copy-Item -LiteralPath $sourcePath -Destination $destinationPath -Force
    }
}

Write-Host "Synced VisaPics web assets to $targetRoot"
