# Module Import Graph and Boundaries

This document defines the ES module dependency graph and maintenance rules for the refactored app.

## Current Import Graph

```text
index.html
  -> src/main.js

src/main.js
  -> src/ui.js
  -> src/editor.js
  -> src/export.js
  -> src/state.js

src/ui.js
  -> src/data/presets.js
  -> src/state.js
  -> src/i18n.js
  -> src/storage.js
  -> src/editor.js
  -> src/export.js

src/export.js
  -> src/data/presets.js
  -> src/state.js
  -> src/i18n.js
  -> src/editor.js

src/editor.js
  -> src/data/presets.js
  -> src/state.js
  -> src/i18n.js

src/storage.js
  -> src/data/presets.js
  -> src/state.js

src/i18n.js
  -> src/data/presets.js
  -> src/state.js

src/state.js
  -> src/data/presets.js

src/data/presets.js
  -> (no imports)
```

## Layering Rules

Preferred layer order (low -> high):

1. `data` (constants/presets)
2. `state` (global state container and state helpers)
3. domain modules (`i18n`, `storage`, `editor`, `export`)
4. `ui` (page orchestration and UI wiring)
5. `main` (entry point and `window.*` bindings)

Rules:

- `data/*` imports nothing.
- `state.js` may import only from `data/*`.
- Domain modules should avoid importing from `ui.js`.
- `ui.js` is the composition root: hook wiring, event binding, bootstrapping.
- `main.js` should only initialize and expose compatibility handlers to `window`.

## Anti-Coupling Pattern (Hooks)

When module A needs behavior from module B and direct imports would create cycles, use hook injection:

- Module A exposes `setAHooks({ ... })`.
- `ui.js` injects concrete functions from module B at bootstrap.

Current examples:

- `setI18nHooks(...)` in `src/i18n.js`
- `setStorageHooks(...)` in `src/storage.js`
- `setEditorHooks(...)` in `src/editor.js`
- `setExportHooks(...)` in `src/export.js`

## PR Checklist (Import Hygiene)

Before merging, verify:

- No new direct imports from `editor.js` to `storage.js` or vice versa.
- No domain module imports from `ui.js`.
- New cross-domain needs use hooks instead of direct circular imports.
- `main.js` remains thin and does not absorb business logic.
- Added functions are placed by ownership:
  - image edit/rendering -> `editor.js`
  - export/share/filename/quota -> `export.js`
  - db/draft serialization -> `storage.js`
  - translation and language rendering -> `i18n.js`
  - modal/menu/theme/toast and orchestration -> `ui.js`

## Quick Local Verification Commands

Use these commands from repo root:

```bash
grep -R "^import " src
grep -R "set[A-Za-z]*Hooks" src
```

If you detect a cycle risk, move the dependency to a hook injected by `ui.js`.
