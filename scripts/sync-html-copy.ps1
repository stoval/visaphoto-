$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$source = Join-Path $root 'index.html'
$target = Join-Path $root 'passport-photo-maker.html'
$wwwIndexTarget = Join-Path $root 'www\index.html'
$androidHtmlTarget = Join-Path $root 'android\app\src\main\assets\public\index.html'
$stylesSource = Join-Path $root 'styles'
$srcSource = Join-Path $root 'src'
$wwwStylesTarget = Join-Path $root 'www\styles'
$wwwSrcTarget = Join-Path $root 'www\src'
$androidStylesTarget = Join-Path $root 'android\app\src\main\assets\public\styles'
$androidSrcTarget = Join-Path $root 'android\app\src\main\assets\public\src'
$releaseSource = Join-Path $root 'www\releases.json'
$releaseTarget = Join-Path $root 'releases.json'
$androidReleaseTarget = Join-Path $root 'android\app\src\main\assets\public\releases.json'
$androidReleaseAssetTarget = Join-Path $root 'android\app\src\main\assets\releases.json'
$manifestSource = Join-Path $root 'manifest.json'
$wwwManifestTarget = Join-Path $root 'www\manifest.json'
$androidManifestTarget = Join-Path $root 'android\app\src\main\assets\public\manifest.json'
$swSource = Join-Path $root 'sw.js'
$wwwSwTarget = Join-Path $root 'www\sw.js'
$androidSwTarget = Join-Path $root 'android\app\src\main\assets\public\sw.js'
$donationConfigSource = Join-Path $root 'donation-config.json'
$wwwDonationConfigTarget = Join-Path $root 'www\donation-config.json'
$androidDonationConfigTarget = Join-Path $root 'android\app\src\main\assets\public\donation-config.json'
$buildGradle = Join-Path $root 'android\app\build.gradle'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$legacyRedirectHtml = @'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="0; url=./index.html">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>证件照制作</title>
<script>
window.location.replace('./index.html');
</script>
</head>
<body>
<p>正在跳转到新版入口… <a href="./index.html">如果没有自动跳转，请点击这里</a></p>
</body>
</html>
'@

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

New-Item -ItemType Directory -Path (Split-Path -Parent $androidHtmlTarget) -Force | Out-Null
Copy-Item -Path $source -Destination $wwwIndexTarget -Force
Copy-Item -Path $source -Destination $androidHtmlTarget -Force
[System.IO.File]::WriteAllText($target, $legacyRedirectHtml, $utf8NoBom)

if (Test-Path $stylesSource) {
    New-Item -ItemType Directory -Path $wwwStylesTarget -Force | Out-Null
    New-Item -ItemType Directory -Path $androidStylesTarget -Force | Out-Null
    Copy-Item -Path (Join-Path $stylesSource '*') -Destination $wwwStylesTarget -Recurse -Force
    Copy-Item -Path (Join-Path $stylesSource '*') -Destination $androidStylesTarget -Recurse -Force
}

if (Test-Path $srcSource) {
    New-Item -ItemType Directory -Path $wwwSrcTarget -Force | Out-Null
    New-Item -ItemType Directory -Path $androidSrcTarget -Force | Out-Null
    Copy-Item -Path (Join-Path $srcSource '*') -Destination $wwwSrcTarget -Recurse -Force
    Copy-Item -Path (Join-Path $srcSource '*') -Destination $androidSrcTarget -Recurse -Force
}

if (Test-Path $manifestSource) {
    Copy-Item -Path $manifestSource -Destination $wwwManifestTarget -Force
    Copy-Item -Path $manifestSource -Destination $androidManifestTarget -Force
}

if (Test-Path $swSource) {
    Copy-Item -Path $swSource -Destination $wwwSwTarget -Force
    Copy-Item -Path $swSource -Destination $androidSwTarget -Force
}

if (Test-Path $donationConfigSource) {
    Copy-Item -Path $donationConfigSource -Destination $wwwDonationConfigTarget -Force
    Copy-Item -Path $donationConfigSource -Destination $androidDonationConfigTarget -Force
}

if (Test-Path $releaseSource) {
    Copy-Item -Path $releaseSource -Destination $releaseTarget -Force
    Copy-Item -Path $releaseSource -Destination $androidReleaseTarget -Force
    Copy-Item -Path $releaseSource -Destination $androidReleaseAssetTarget -Force
}
Write-Host 'Synced modular web app entry, assets, and release metadata from canonical root sources'
