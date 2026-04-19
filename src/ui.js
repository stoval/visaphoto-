import { PRESETS, GUIDE_SPECS, BG_COLORS, BG_OPTIONS, LANG_OPTIONS, KEY_BG, KEY_DONATION_PAYPAL, KEY_DONATION_LAST_PROMPT } from './data/presets.js';
import { S } from './state.js';
import {
  t,
  setLanguage,
  applyI18n,
  loadReleaseNotes,
  localizePreset,
  renderReleaseNotes,
  getCurrentLang,
  setI18nHooks
} from './i18n.js';
import { blobToImg, saveDraft, restoreDraft, setStorageHooks } from './storage.js';
import {
  updateOffscreen,
  requestDraw,
  generate,
  triggerUp,
  smartPrintDefaults,
  initEditorInteractions,
  setEditorHooks
} from './editor.js';
import {
  refreshExportMainText,
  initExportControls,
  syncExportFormatForPreset,
  syncPresetRestrictions,
  buildExportFilename,
  exportWithShareOrFallback,
  setExportHooks
} from './export.js';

const PUBLIC_DONATION_PAYPAL = 'paypal.me/LiMaAu';

function renderLanguageMenu() {
  const list = document.getElementById('langList');
  if (!list) return;
  const currentLang = getCurrentLang();
  list.innerHTML = LANG_OPTIONS.map(item => `
    <button class="lang-item${item.code === currentLang ? ' active' : ''}" type="button" data-lang="${item.code}">
      <span>${item.label}</span>
      <small>${item.short}</small>
    </button>
  `).join('');
  list.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
      closeLanguageMenu();
    });
  });
}

function openLanguageMenu() {
  document.getElementById('langModal')?.classList.remove('hidden');
  renderLanguageMenu();
}

function closeLanguageMenu() {
  document.getElementById('langModal')?.classList.add('hidden');
}

function openReleaseModal() {
  document.getElementById('releaseModal')?.classList.remove('hidden');
  renderReleaseNotes();
}

function closeReleaseModal() {
  document.getElementById('releaseModal')?.classList.add('hidden');
}

function getDonationPaypalValue() {
  return String(PUBLIC_DONATION_PAYPAL || localStorage.getItem(KEY_DONATION_PAYPAL) || '').trim();
}

async function loadDonationConfig() {
  if (PUBLIC_DONATION_PAYPAL) {
    localStorage.setItem(KEY_DONATION_PAYPAL, PUBLIC_DONATION_PAYPAL);
    return PUBLIC_DONATION_PAYPAL;
  }
  return String(localStorage.getItem(KEY_DONATION_PAYPAL) || '').trim();
}

function normalizeDonationLink(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^paypal\.me\//i.test(raw)) return `https://${raw}`;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
    return `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=${encodeURIComponent(raw)}`;
  }
  return `https://www.paypal.com/paypalme/${encodeURIComponent(raw.replace(/^@+/, ''))}`;
}

function refreshDonationSettingsUI() {}

function saveDonationSettings() {}

function editDonationSettings() {}

function clearDonationSettings() {}

function closeDonationModal() {
  document.getElementById('donationModal')?.classList.add('hidden');
}

let donationPromptTimer = null;

function openDonationModal() {
  const paypal = getDonationPaypalValue();
  if (!paypal) return false;
  const modal = document.getElementById('donationModal');
  const account = document.getElementById('donationAccount');
  const confirm = document.getElementById('donationConfirm');
  const normalized = normalizeDonationLink(paypal);
  const prefersPaypalMe = /paypal\.me\//i.test(normalized);
  if (account) {
    account.dataset.value = paypal;
    account.textContent = t('donationAccountLabel', normalized || paypal);
  }
  if (confirm) confirm.textContent = prefersPaypalMe ? t('donationConfirmPaypalMe') : t('donationConfirm');
  modal?.classList.remove('hidden');
  return true;
}

function scheduleDonationModal() {
  const paypal = getDonationPaypalValue();
  if (!paypal) return false;
  if (donationPromptTimer) window.clearTimeout(donationPromptTimer);
  donationPromptTimer = window.setTimeout(() => {
    donationPromptTimer = null;
    openDonationModal();
  }, 700);
  return true;
}

function openDonationLink() {
  const url = normalizeDonationLink(getDonationPaypalValue());
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
  closeDonationModal();
}

function refreshAfterExportActions() {
  [
    ['afterExportBox', 'afterExportFile'],
    ['afterExportBoxMobile', 'afterExportFileMobile']
  ].forEach(([boxId, labelId]) => {
    const box = document.getElementById(boxId);
    const label = document.getElementById(labelId);
    if (!box || !label) return;
    if (S.lastExportFilename) {
      box.classList.add('show');
      label.textContent = t('savedFileLabel', S.lastExportFilename);
    } else {
      box.classList.remove('show');
      label.textContent = '';
    }
  });
}

function syncBgSwatches(color) {
  document.querySelectorAll('.swatch').forEach(sw => {
    sw.classList.toggle('active', sw.dataset.hex === color);
  });
}

function syncBgControlState() {
  const locked = S.preset?.id === 'cn_pass' || S.preset?.id === 'cn_visa';
  document.querySelectorAll('.swatch').forEach(sw => {
    const isWhite = sw.dataset.hex === '#FFFFFF';
    sw.classList.toggle('disabled', locked && !isWhite);
  });
  const mobileEl = document.getElementById('mBg');
  if (mobileEl) {
    mobileEl.disabled = locked;
    mobileEl.style.opacity = locked ? '0.7' : '1';
  }
}

function syncBgSelects(color) {
  const bgKey = color === '#4A80C8' ? 'blue' : color === '#C83C3A' ? 'red' : color === '#FFFFFF' ? 'white' : '';
  const mobileEl = document.getElementById('mBg');
  const sharedEl = document.getElementById('bgSelect');
  if (mobileEl) {
    const mobileValues = Array.from(mobileEl.options).map(option => option.value);
    if (mobileValues.includes(color)) mobileEl.value = color;
    else if (bgKey && mobileValues.includes(bgKey)) mobileEl.value = bgKey;
  }
  if (sharedEl && bgKey) sharedEl.value = bgKey;
}

function applyBgColorSelection(color, options = {}) {
  const { persist = true } = options;
  if (S.preset?.id === 'cn_pass' || S.preset?.id === 'cn_visa') color = '#FFFFFF';
  S.bgColor = color;
  if (persist) {
    const bgKey = color === '#4A80C8' ? 'blue' : color === '#C83C3A' ? 'red' : 'white';
    localStorage.setItem(KEY_BG, bgKey);
  }
  syncBgSwatches(color);
  syncBgSelects(color);
  syncBgControlState();
  updateOffscreen();
  requestDraw();
  if (S.resultDataUrl) generate();
  saveDraft();
}

function initBgSelect() {
  const el = document.getElementById('bgSelect') || document.getElementById('mBg');
  if (!el) return;
  if (localStorage.getItem(KEY_BG) === null) localStorage.setItem(KEY_BG, 'white');
  if (el.options.length === 0) {
    el.innerHTML = BG_OPTIONS.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
  }
  el.value = localStorage.getItem(KEY_BG) || 'white';
  const initialHex = el.value === 'blue' ? '#4A80C8' : el.value === 'red' ? '#C83C3A' : '#FFFFFF';
  S.bgColor = initialHex;
  syncBgSwatches(initialHex);
  el.dataset.bgBound = '1';
  el.addEventListener('change', () => {
    const hex = el.value === 'blue' ? '#4A80C8' : el.value === 'red' ? '#C83C3A' : '#FFFFFF';
    applyBgColorSelection(hex);
  });
}

function ensureInitialDefaultsUI() {
  if (localStorage.getItem(KEY_BG) === null) localStorage.setItem(KEY_BG, 'white');
  S.bgColor = '#FFFFFF';
  syncBgSelects(S.bgColor);
  syncBgSwatches(S.bgColor);
}

function initMobileExportSync() {
  const kindEl = document.getElementById('exportKind');
  const fmtEl = document.getElementById('exportFormat');
  if (!kindEl || !fmtEl) return;

  kindEl.value = S.exportKind || 'single';
  fmtEl.value = S.exportFormat || 'png';
  document.getElementById('fmtPng').checked = (fmtEl.value === 'png');

  kindEl.addEventListener('change', (e) => {
    S.exportKind = e.target.value;
    refreshExportMainText();
    saveDraft();
  });
  fmtEl.addEventListener('change', (e) => {
    S.exportFormat = e.target.value;
    document.getElementById('fmtPng').checked = (S.exportFormat === 'png');
    refreshExportMainText();
    saveDraft();
  });
  refreshExportMainText();
}

function initMobilePresetSelect() {
  const sel = document.getElementById('mPreset');
  if (!sel) return;
  sel.innerHTML = PRESETS.map((p, i) => `<option value="${i}">${p.name} (${p.w}×${p.h}mm)</option>`).join('');
  sel.value = String(Math.max(0, PRESETS.findIndex(p => p.id === S.preset?.id)));
  sel.addEventListener('change', (e) => {
    const p = PRESETS[Number(e.target.value)];
    S.preset = p;
    syncExportFormatForPreset({ notify: true });
    syncPresetRestrictions({ notify: true });
    syncPresetUI();
    updateOffscreen();
    requestDraw();
    saveDraft();
  });
}

function initMobileBgSelect() {
  const sel = document.getElementById('mBg');
  if (!sel) return;
  if (sel.dataset.bgBound === '1') return;
  if (sel.options.length === 0) {
    sel.innerHTML = BG_COLORS.map(c => `<option value="${c.hex}">${c.lbl}</option>`).join('');
  }
  sel.addEventListener('change', (e) => {
    applyBgColorSelection(e.target.value, { persist: false });
  });
}

function syncPresetUI() {
  const presetSelect = document.getElementById('presetSelect');
  if (presetSelect) {
    presetSelect.value = String(Math.max(0, PRESETS.findIndex(p => p.id === S.preset?.id)));
  }
  const mPreset = document.getElementById('mPreset');
  if (mPreset) {
    mPreset.value = String(Math.max(0, PRESETS.findIndex(p => p.id === S.preset?.id)));
  }
  const guideSpec = GUIDE_SPECS[S.preset?.id];
  const guideLegend = document.getElementById('guideLegend');
  if (guideLegend) guideLegend.style.display = guideSpec ? '' : 'none';
  if (guideSpec) updateGuideLegend(S.preset);
  const dropHint = document.getElementById('dropHint');
  if (dropHint) {
    const isChina = S.preset?.id === 'cn_pass' || S.preset?.id === 'cn_visa';
    dropHint.textContent = isChina ? t('dropHintChina') : t('dropHint');
  }
  smartPrintDefaults(S.preset || PRESETS[0]);
}

function syncMobileUI() {
  syncPresetUI();
  syncBgSelects(S.bgColor);
  syncBgSwatches(S.bgColor);
  syncBgControlState();
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

function setStep(n) {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`st${i}`);
    if (!el) continue;
    el.className = `step-item${i < n ? ' done' : i === n ? ' active' : ''}`;
  }
}

let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => {
      if (!el.classList.contains('show')) el.textContent = '';
    }, 260);
  }, 3000);
}

function setLdr(show, txt = '') {
  const el = document.getElementById('ldr');
  if (!el) return;
  el.classList.toggle('show', show);
  if (txt) {
    const txtEl = document.getElementById('ldrTxt');
    if (txtEl) txtEl.textContent = txt;
  }
}

function updateGuideLegend(preset) {
  const legend = document.getElementById('guideLegend');
  if (!legend) return;
  const isChina = preset?.id === 'cn_pass' || preset?.id === 'cn_visa';
  const ovalLegend = isChina ? `${t('guideLegend6')} · ${t('chinaDoubleOvalGuide')}` : t('guideLegend6');
  legend.innerHTML = `
    <div class="gl-item"><div class="gl-dot" style="background:rgba(200,50,40,0.35)"></div><span>${t('guideLegend1')}</span></div>
    <div class="gl-item"><div class="gl-dot" style="background:rgba(200,160,20,0.4)"></div><span>${t('guideLegend2')}</span></div>
    <div class="gl-item"><div class="gl-dot" style="background:rgba(40,160,80,0.3)"></div><span>${t('guideLegend3')}</span></div>
    <div class="gl-item"><div class="gl-dot" style="border:1.5px solid rgba(40,160,80,0.8)"></div><span>${t('guideLegend4')}</span></div>
    <div class="gl-item"><div class="gl-dot" style="border:1.5px dashed rgba(200,160,20,0.8)"></div><span>${t('guideLegend5')}</span></div>
    <div class="gl-item"><div class="gl-dot" style="border:1.5px solid var(--gold);border-radius:50%"></div><span>${ovalLegend}</span></div>
    <div class="gl-item" style="color:var(--ink3);font-style:italic"><span>${t('guideLegend7')}</span></div>`;
}

function init() {
  const presetSelect = document.getElementById('presetSelect');
  if (presetSelect) {
    presetSelect.innerHTML = PRESETS.map((p, i) => {
      const localized = localizePreset(p);
      return `<option value="${i}">${localized.name} (${p.w}×${p.h}mm${localized.note ? ` · ${localized.note}` : ''})</option>`;
    }).join('');
    presetSelect.value = String(Math.max(0, PRESETS.findIndex(p => p.id === S.preset?.id)));
    presetSelect.addEventListener('change', (e) => {
      const p = PRESETS[Number(e.target.value)];
      if (!p) return;
      S.preset = p;
      if (p.defaultBg) S.bgColor = p.defaultBg;
      syncExportFormatForPreset({ notify: true });
      syncPresetRestrictions({ notify: true });
      syncPresetUI();
      syncMobileUI();
      drawEdit();
      if (S.resultDataUrl) generate();
    });
  }

  const strip = document.getElementById('bgStrip');
  BG_COLORS.forEach(c => {
    const sw = document.createElement('div');
    sw.className = `swatch${c.hex === S.bgColor ? ' active' : ''}`;
    sw.dataset.hex = c.hex;
    sw.style.background = c.hex;
    sw.title = c.lbl;
    sw.onclick = () => {
      S.bgColor = c.hex;
      document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      requestDraw();
      if (S.resultDataUrl) generate();
      syncMobileUI();
    };
    strip?.appendChild(sw);
  });

  const tsw = document.createElement('div');
  tsw.className = 'swatch checker';
  tsw.title = '透明';
  tsw.onclick = () => {
    S.bgColor = 'transparent';
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    tsw.classList.add('active');
    requestDraw();
    if (S.resultDataUrl) generate();
    syncMobileUI();
  };
  strip?.appendChild(tsw);

  const csw = document.createElement('div');
  csw.className = 'swatch custom-c';
  csw.title = '自定义';
  const ci = document.createElement('input');
  ci.type = 'color';
  ci.value = '#ffffff';
  ci.oninput = e => {
    S.bgColor = e.target.value;
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    csw.classList.add('active');
    requestDraw();
    if (S.resultDataUrl) generate();
    syncMobileUI();
  };
  csw.appendChild(ci);
  strip?.appendChild(csw);

  syncPresetUI();
  syncPresetRestrictions();

  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('themeTog').onclick = toggleTheme;

  initEditorInteractions();

  initMobilePresetSelect();
  initMobileBgSelect();
  initMobileExportSync();
  initBgSelect();
  ensureInitialDefaultsUI();
  refreshExportMainText();
  restoreDraft();
}

setI18nHooks({
  syncPresetUI,
  renderLanguageMenu,
  refreshExportMainText,
  refreshAfterExportActions
});

setStorageHooks({
  syncExportFormatForPreset,
  syncPresetRestrictions,
  syncPresetUI,
  syncMobileUI,
  updateOffscreen,
  requestDraw,
  toast,
  t
});

setEditorHooks({
  setStep,
  setLdr,
  toast,
  saveDraft,
  blobToImg,
  syncPresetRestrictions,
  syncPresetUI,
  exportWithShareOrFallback,
  buildExportFilename
});

setExportHooks({
  toast,
  refreshAfterExportActions,
  syncBgSelects,
  syncBgSwatches,
  syncBgControlState,
  maybePromptDonation: scheduleDonationModal
});

export function bootstrap() {
  init();
  document.addEventListener('DOMContentLoaded', async () => {
    await loadDonationConfig();
    refreshDonationSettingsUI();
    initExportControls();
    document.getElementById('heroUploadCta')?.addEventListener('click', triggerUp);
    document.getElementById('heroFormatsCta')?.addEventListener('click', () => {
      document.getElementById('startPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.getElementById('btnReupload')?.addEventListener('click', triggerUp);
    document.getElementById('releaseTog')?.addEventListener('click', openReleaseModal);
    document.getElementById('mReleaseTog')?.addEventListener('click', openReleaseModal);
    document.getElementById('langTog')?.addEventListener('click', openLanguageMenu);
    document.getElementById('mLangTog')?.addEventListener('click', openLanguageMenu);
    document.getElementById('langMenuClose')?.addEventListener('click', closeLanguageMenu);
    document.getElementById('releaseClose')?.addEventListener('click', closeReleaseModal);
    document.getElementById('donationLater')?.addEventListener('click', closeDonationModal);
    document.getElementById('donationConfirm')?.addEventListener('click', openDonationLink);
    document.getElementById('langModal')?.addEventListener('click', (e) => {
      if (e.target?.id === 'langModal') closeLanguageMenu();
    });
    document.getElementById('releaseModal')?.addEventListener('click', (e) => {
      if (e.target?.id === 'releaseModal') closeReleaseModal();
    });
    document.getElementById('donationModal')?.addEventListener('click', (e) => {
      if (e.target?.id === 'donationModal') closeDonationModal();
    });
    applyI18n();
    loadReleaseNotes();
  });
}
