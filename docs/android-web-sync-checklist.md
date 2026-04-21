## Android Web Sync Checklist

Use this checklist when updating the web assets inside:

- `D:\dev\VisaPics-Android\app\src\main\assets\public`

The Android app should embed the **web app** version of VisaPics, not the public landing page.

### Do not copy

Do **not** copy the root landing-page files into Android just because they sit at the repo root:

- `index.html` at the repo root
- marketing-only landing-page sections
- `CNAME`
- `.nojekyll`
- GitHub Pages specific setup

Those belong to:

- `https://visapics.app/`

### Copy the web app shell

For Android, the main entry should come from:

- `app/index.html`

This file is the correct app entry for:

- `https://visapics.app/app/`

It should become the Android embedded entry page inside:

- `app/src/main/assets/public/index.html`

### Minimum files to sync from the web repo

Copy these from `D:\dev\visaphoto` into:

- `D:\dev\VisaPics-Android\app\src\main\assets\public`

#### Required

- `app/index.html` -> `index.html`
- `app/sw.js` -> `sw.js`
- `src/`
- `styles/`
- `vendor/`
- `assets/`
- `releases.json`
- `icon-192.png`
- `icon-512.png`

#### Usually keep in sync as well

- `manifest.json`

Only keep this if the Android web shell still references it and the app experience benefits from reusing the same metadata.

### Current mental model

Think of the project like this:

- `/` = public landing page
- `/app/` = actual VisaPics tool
- Android should embed `/app/`, not `/`

### Safe sync rule

If a file only exists to support GitHub Pages or the public marketing homepage, it usually does **not** belong in the Android assets folder.

If a file is needed for the actual editing flow, preview, cutout, export, or release info, it usually **does** belong in the Android assets folder.

### Suggested sync destination

After sync, the Android assets folder should look conceptually like this:

- `index.html`
- `sw.js`
- `src/...`
- `styles/...`
- `vendor/...`
- `assets/...`
- `releases.json`
- optional shared icons / manifest

### Current standard workflow

To avoid manual mistakes, use the dedicated sync script that now copies the Android-facing web app shell into:

- `D:\dev\VisaPics-Android\app\src\main\assets\public`

Run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/sync-android-web-assets.ps1
```

By default, the script syncs:

- `app/index.html`
- `app/sw.js`
- `src/`
- `styles/`
- `vendor/`
- `assets/`
- `releases.json`
- `icon-192.png`
- `icon-512.png`
- `manifest.json`

This keeps Android pointed at the `/app/` tool shell instead of the landing page by default.
