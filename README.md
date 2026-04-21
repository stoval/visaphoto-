# visapics.app

Public web and PWA source for [visapics.app](https://visapics.app).

## What this repo contains

- The landing page at [index.html](D:/dev/visaphoto/index.html)
- The browser app entry at [app/index.html](D:/dev/visaphoto/app/index.html)
- Shared app code in [src](D:/dev/visaphoto/src)
- Styles in [styles](D:/dev/visaphoto/styles)
- Offline/PWA assets such as [sw.js](D:/dev/visaphoto/sw.js), [app/sw.js](D:/dev/visaphoto/app/sw.js), and [manifest.json](D:/dev/visaphoto/manifest.json)

This repository is intended to stay focused on the browser-based product and GitHub Pages deployment for `visapics.app`.

## Android app repository

The native Android project now lives separately at:

- [VisaPics-Android](https://github.com/stoval/VisaPics-Android)

## Custom domain

GitHub Pages custom domain is configured through:

- [CNAME](D:/dev/visaphoto/CNAME)
- [.nojekyll](D:/dev/visaphoto/.nojekyll)

Current domain:

```text
visapics.app
```

## Local preview

Run:

```bash
npm run preview
```

Default preview URL:

```text
http://127.0.0.1:4173
```

## Syncing web assets into the Android app

To copy the `/app/` shell and its required shared assets into the standalone Android repository, run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/sync-android-web-assets.ps1
```

Default target:

```text
D:\dev\VisaPics-Android\app\src\main\assets\public
```

Key routes:

```text
/      landing page
/app/  web app
```

## Deploy notes

- GitHub Pages should point to this repository root
- In GitHub Pages settings, set the custom domain to `visapics.app`
- After DNS is live, enable `Enforce HTTPS`

## Publishing hygiene

The repo intentionally ignores local maintenance artifacts such as:

- WordPress migration backups
- live HTML snapshots
- temporary planning files
- local redesign reference images

These are excluded through [.gitignore](D:/dev/visaphoto/.gitignore) so the Pages branch stays focused on the site itself.
