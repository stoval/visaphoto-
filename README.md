# visapics.app

Static site source for [visapics.app](https://visapics.app).

## What this repo contains

- The web app entry at [index.html](D:/dev/visaphoto/index.html)
- App code in [src](D:/dev/visaphoto/src)
- Styles in [styles](D:/dev/visaphoto/styles)
- Offline/PWA assets such as [sw.js](D:/dev/visaphoto/sw.js) and [manifest.json](D:/dev/visaphoto/manifest.json)

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
