#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$ROOT_DIR/src"

echo "[import-hygiene] scanning imports..."

echo
echo "== Import graph snapshot =="
grep -R "^import " "$SRC_DIR" || true

echo
echo "== Hook registration points =="
grep -R "set[A-Za-z]*Hooks" "$SRC_DIR" || true

echo
echo "== Guardrail checks =="

fail=0

# 1) No domain module should import ui.js
for f in "$SRC_DIR"/editor.js "$SRC_DIR"/export.js "$SRC_DIR"/storage.js "$SRC_DIR"/i18n.js; do
  if grep -q "from './ui.js'" "$f"; then
    echo "[FAIL] $(basename "$f") must not import ui.js"
    fail=1
  fi
done

# 2) Break known risky cycle: editor.js <-> storage.js
if grep -q "from './storage.js'" "$SRC_DIR/editor.js"; then
  echo "[FAIL] editor.js must not import storage.js directly"
  fail=1
fi

if grep -q "from './editor.js'" "$SRC_DIR/storage.js"; then
  echo "[FAIL] storage.js must not import editor.js directly"
  fail=1
fi

# 3) data layer must not import anything
if grep -q "^import " "$SRC_DIR/data/presets.js"; then
  echo "[FAIL] data/presets.js must not import other modules"
  fail=1
fi

# 4) state layer should only import data/presets.js
if grep -q "^import " "$SRC_DIR/state.js"; then
  if grep -v "from './data/presets.js'" "$SRC_DIR/state.js" | grep -q "^import "; then
    echo "[FAIL] state.js should only import from data/presets.js"
    fail=1
  fi
fi

# 5) main.js should stay thin: no imports from data/storage/i18n directly
if grep -q "from './data/" "$SRC_DIR/main.js"; then
  echo "[FAIL] main.js should not import data modules directly"
  fail=1
fi
if grep -q "from './storage.js'" "$SRC_DIR/main.js"; then
  echo "[FAIL] main.js should not import storage.js directly"
  fail=1
fi
if grep -q "from './i18n.js'" "$SRC_DIR/main.js"; then
  echo "[FAIL] main.js should not import i18n.js directly"
  fail=1
fi

if [[ "$fail" -eq 0 ]]; then
  echo "[PASS] import hygiene checks passed"
  exit 0
fi

echo "[FAIL] import hygiene checks failed"
exit 1
