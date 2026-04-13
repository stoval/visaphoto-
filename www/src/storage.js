import { PRESETS } from './data/presets.js';
import { S } from './state.js';

const storageHooks = {
  syncExportFormatForPreset: () => {},
  syncPresetRestrictions: () => {},
  syncPresetUI: () => {},
  syncMobileUI: () => {},
  updateOffscreen: () => {},
  requestDraw: () => {},
  toast: () => {},
  t: (key, ...args) => {
    if (args.length) return `${key}: ${args.join(', ')}`;
    return key;
  }
};

function setStorageHooks(next = {}) {
  Object.assign(storageHooks, next);
}

function openDB() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = indexedDB.open('VisaPhotoDB', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('drafts', { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function imgToBlob(img) {
  return new Promise(resolve => {
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    c.toBlob(resolve, 'image/png');
  });
}

function blobToImg(blob) {
  return new Promise((resolve, reject) => {
    if (!blob || !blob.size) return reject(new Error('blobToImg: empty blob'));
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

async function saveDraft() {
  if (!S.origImg) return;
  try {
    const db = await openDB();
    const tx = db.transaction('drafts', 'readwrite');
    const store = tx.objectStore('drafts');
    const draft = {
      id: 'last',
      presetId: S.preset.id,
      bgColor: S.bgColor,
      bright: S.bright,
      contrast: S.contrast,
      sat: S.sat,
      tx: S.tx,
      ty: S.ty,
      scale: S.scale,
      rotate: S.rotate,
      useNoBg: S.useNoBg,
      origBlob: await imgToBlob(S.origImg),
      noBgBlob: S.noBgImg ? await imgToBlob(S.noBgImg) : null
    };
    store.put(draft);
    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('IndexedDB tx error'));
      tx.onabort = () => reject(tx.error || new Error('IndexedDB tx aborted'));
    });
  } catch (e) {
    localStorage.setItem('vpDraftMeta', JSON.stringify({
      presetId: S.preset.id,
      bgColor: S.bgColor,
      bright: S.bright,
      contrast: S.contrast,
      sat: S.sat,
      tx: S.tx,
      ty: S.ty,
      scale: S.scale,
      rotate: S.rotate,
      useNoBg: S.useNoBg
    }));
  }
}

function applyDraftMeta(d) {
  if (!d) return;
  const presetId = d.presetId === 'cn_visa' ? 'cn_pass' : d.presetId;
  S.preset = PRESETS.find(p => p.id === presetId) || S.preset || PRESETS[0];
  S.bgColor = d.bgColor || S.bgColor || '#FFFFFF';
  S.bright = d.bright ?? S.bright ?? 100;
  S.contrast = d.contrast ?? S.contrast ?? 100;
  S.sat = d.sat ?? S.sat ?? 100;
  S.tx = d.tx ?? S.tx ?? 0;
  S.ty = d.ty ?? S.ty ?? 0;
  S.scale = d.scale ?? S.scale ?? 1;
  S.rotate = d.rotate ?? S.rotate ?? 0;
  S.useNoBg = !!d.useNoBg;
  storageHooks.syncExportFormatForPreset();
  storageHooks.syncPresetRestrictions();
  storageHooks.syncPresetUI();
}

async function restoreDraft() {
  try {
    let draft = null;

    try {
      const db = await openDB();
      draft = await new Promise((resolve, reject) => {
        const tx = db.transaction('drafts', 'readonly');
        const store = tx.objectStore('drafts');
        const req = store.get('last');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('[restoreDraft] IndexedDB unavailable, fallback to localStorage meta', e);
    }

    if (!draft) {
      const meta = localStorage.getItem('vpDraftMeta');
      if (meta) {
        try {
          applyDraftMeta(JSON.parse(meta));
          storageHooks.requestDraw();
        } catch (_) {
          // ignore corrupt local meta
        }
      }
      return;
    }

    applyDraftMeta(draft);

    let hadCorruptBlob = false;

    if (draft.origBlob && draft.origBlob.size > 0) {
      try {
        S.origImg = await blobToImg(draft.origBlob);
      } catch (e) {
        hadCorruptBlob = true;
        S.origImg = null;
        console.warn('[restoreDraft] origBlob invalid, ignored', e);
      }
    } else {
      S.origImg = null;
    }

    if (draft.noBgBlob && draft.noBgBlob.size > 0) {
      try {
        S.noBgImg = await blobToImg(draft.noBgBlob);
      } catch (e) {
        hadCorruptBlob = true;
        S.noBgImg = null;
        console.warn('[restoreDraft] noBgBlob invalid, ignored', e);
      }
    } else {
      S.noBgImg = null;
    }

    if (!S.noBgImg) S.useNoBg = false;

    if (hadCorruptBlob) {
      try {
        const db = await openDB();
        const tx = db.transaction('drafts', 'readwrite');
        tx.objectStore('drafts').delete('last');
      } catch (_) {
        // ignore cleanup failure
      }
      storageHooks.toast(storageHooks.t('draftCorruptCleared'));
    }

    const btnToggle = document.getElementById('btnToggle');
    if (btnToggle) {
      if (S.noBgImg) {
        btnToggle.style.display = 'inline-flex';
        btnToggle.textContent = S.useNoBg ? storageHooks.t('viewOriginal') : storageHooks.t('viewCutout');
      } else {
        btnToggle.style.display = 'none';
      }
    }

    if (S.origImg || S.noBgImg) storageHooks.updateOffscreen();
    storageHooks.requestDraw();
  } catch (e) {
    console.error('Failed to restore draft:', e);

    try {
      const meta = localStorage.getItem('vpDraftMeta');
      if (meta) {
        applyDraftMeta(JSON.parse(meta));
      }
    } catch (_) {
      // ignore fallback failure
    }

    storageHooks.requestDraw();
    storageHooks.syncMobileUI();
  }
}

export {
  openDB,
  imgToBlob,
  blobToImg,
  saveDraft,
  restoreDraft,
  applyDraftMeta,
  setStorageHooks
};
