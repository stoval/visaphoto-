$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$source = Join-Path $root 'www\index.html'
$target = Join-Path $root 'passport-photo-maker.html'
$androidHtmlTarget = Join-Path $root 'android\app\src\main\assets\public\index.html'
$releaseSource = Join-Path $root 'www\releases.json'
$releaseTarget = Join-Path $root 'releases.json'
$androidReleaseTarget = Join-Path $root 'android\app\src\main\assets\public\releases.json'
$androidReleaseAssetTarget = Join-Path $root 'android\app\src\main\assets\releases.json'
$buildGradle = Join-Path $root 'android\app\build.gradle'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

if ((Test-Path $buildGradle) -and (Test-Path $releaseSource)) {
    $gradleText = [System.IO.File]::ReadAllText($buildGradle, [System.Text.Encoding]::UTF8)
    $versionNameMatch = [regex]::Match($gradleText, 'versionName\s+"([^"]+)"')
    $versionCodeMatch = [regex]::Match($gradleText, 'versionCode\s+(\d+)')

    $releaseText = [System.IO.File]::ReadAllText($releaseSource, [System.Text.Encoding]::UTF8)
    $releaseJson = $releaseText | ConvertFrom-Json
    if ($versionNameMatch.Success) {
        $releaseJson.currentVersion = $versionNameMatch.Groups[1].Value
    }
    if ($versionCodeMatch.Success) {
        $releaseJson | Add-Member -NotePropertyName currentBuild -NotePropertyValue $versionCodeMatch.Groups[1].Value -Force
    }
    $releaseOut = $releaseJson | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText($releaseSource, $releaseOut, $utf8NoBom)
}

Copy-Item -Path $source -Destination $target -Force
Copy-Item -Path $source -Destination $androidHtmlTarget -Force
if (Test-Path $releaseSource) {
    Copy-Item -Path $releaseSource -Destination $releaseTarget -Force
    Copy-Item -Path $releaseSource -Destination $androidReleaseTarget -Force
    Copy-Item -Path $releaseSource -Destination $androidReleaseAssetTarget -Force
}
Write-Host 'Synced HTML and release metadata from canonical www sources'
