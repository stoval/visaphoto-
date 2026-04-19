import {
  PRESETS,
  BG_LABELS,
  mm2px,
  KEY_AUTO_UNIQUE,
  KEY_BG,
  KEY_DONATION_PAYPAL,
  KEY_DONATION_LAST_PROMPT
} from './data/presets.js';
import { S, isChinaConsularPreset, hasChinaConsularMinPixels, hasLoadedPhoto } from './state.js';
import { t, localizePreset, getCurrentLang } from './i18n.js';
import { generate, doRemoveBg, updatePrint } from './editor.js';

const exportHooks = {
  toast: () => {},
  refreshAfterExportActions: () => {},
  syncBgSelects: () => {},
  syncBgSwatches: () => {},
  syncBgControlState: () => {},
  maybePromptDonation: () => false
};

function setExportHooks(next = {}) {
  Object.assign(exportHooks, next);
}

function shouldPromptDonation() {
  const host = String(window.location?.hostname || '').toLowerCase();
  const protocol = String(window.location?.protocol || '').toLowerCase();
  if (protocol === 'file:' || host === 'localhost' || host === '127.0.0.1') {
    return true;
  }
  const lastPromptAt = Number(localStorage.getItem(KEY_DONATION_LAST_PROMPT) || '0');
  const cooldownMs = 24 * 60 * 60 * 1000;
  return !lastPromptAt || (Date.now() - lastPromptAt) > cooldownMs;
}

function maybePromptDonationAfterSuccess() {
  if (!shouldPromptDonation()) return;
  const paypal = String(localStorage.getItem(KEY_DONATION_PAYPAL) || '').trim();
  if (!paypal) return;
  const opened = !!exportHooks.maybePromptDonation();
  if (opened) {
    localStorage.setItem(KEY_DONATION_LAST_PROMPT, String(Date.now()));
  }
}

function getConsularExportSpecText() {
  const preset = S.preset || PRESETS[0];
  const pxW = mm2px(preset.w, preset.dpi || 300);
  const pxH = mm2px(preset.h, preset.dpi || 300);
  return `${localizePreset(preset).name} (${pxW}×${pxH} px)`;
}


function openChinaExportReport(report) {
  return new Promise(resolve => {
    const modal = document.getElementById('exportReportModal');
    const list = document.getElementById('exportReportList');
    const note = document.getElementById('exportReportNote');
    const preview = document.getElementById('exportReportPreview');
    const btnCancel = document.getElementById('exportReportCancel');
    const btnConfirm = document.getElementById('exportReportConfirm');
    if (!modal || !list || !note || !preview || !btnCancel || !btnConfirm) {
      resolve(window.confirm(t('exportReportReady')));
      return;
    }

    preview.src = report.previewUrl || '';
    preview.style.display = report.previewUrl ? '' : 'none';
    list.innerHTML = `
      <div class="report-row"><strong>${t('exportReportSpec')}</strong><span>${report.spec}</span></div>
      <div class="report-row"><strong>${t('exportReportFormat')}</strong><span>${report.format}</span></div>
      <div class="report-row"><strong>${t('exportReportSize')}</strong><span>${report.size}</span></div>
      <div class="report-row"><strong>${t('exportReportBackground')}</strong><span>${report.background}</span></div>
    `;
    note.textContent = report.note;
    modal.classList.remove('hidden');

    const cleanup = (result) => {
      modal.classList.add('hidden');
      if (report.previewUrl) {
        URL.revokeObjectURL(report.previewUrl);
        preview.removeAttribute('src');
      }
      btnCancel.removeEventListener('click', onCancel);
      btnConfirm.removeEventListener('click', onConfirm);
      modal.removeEventListener('click', onOverlay);
      resolve(result);
    };
    const onCancel = () => cleanup(false);
    const onConfirm = () => cleanup(true);
    const onOverlay = (e) => { if (e.target === modal) cleanup(false); };
    btnCancel.addEventListener('click', onCancel);
    btnConfirm.addEventListener('click', onConfirm);
    modal.addEventListener('click', onOverlay);
  });
}


async function confirmChinaConsularExport(blob, ext) {
  if (!isMobile() || !isChinaConsularPreset() || ext === 'png') return true;
  const sizeKB = Math.round(blob.size / 1024);
  const lang = getCurrentLang();
  const bgLabels = BG_LABELS[lang] || BG_LABELS.zh;
  const previewUrl = blob ? URL.createObjectURL(blob) : '';
  return await openChinaExportReport({
    spec: getConsularExportSpecText(),
    format: 'JPG · 300 dpi',
    size: `${sizeKB} KB · ${t('exportReportAutoOptimized')} · ${t('exportReportRecommendedRange')}`,
    background: bgLabels['#FFFFFF'] || 'White',
    note: t('exportReportReady'),
    previewUrl
  });
}

function getExportKind() {
  return document.getElementById('exportKind')?.value || 'single';
}

function getExportFormat() {
  return document.getElementById('exportFormat')?.value || 'jpg';
}

function syncExportFormatForPreset({ notify = false } = {}) {
  if (!isChinaConsularPreset()) return;
  const fmtEl = document.getElementById('exportFormat');
  const fmtPng = document.getElementById('fmtPng');
  const changed = getExportFormat() === 'png' || S.exportFormat === 'png';
  if (fmtEl) fmtEl.value = 'jpg';
  if (fmtPng) fmtPng.checked = false;
  S.exportFormat = 'jpg';
  refreshExportMainText();
  if (notify && changed) exportHooks.toast(t('chinaConsularJpegOnly'));
}

function syncPresetRestrictions({ notify = false } = {}) {
  if (isChinaConsularPreset()) {
    const bgChanged = S.bgColor !== '#FFFFFF';
    S.bgColor = '#FFFFFF';
    exportHooks.syncBgSelects(S.bgColor);
    exportHooks.syncBgSwatches(S.bgColor);
    if (notify && bgChanged) exportHooks.toast(t('chinaConsularWhiteBgOnly'));
  }
  exportHooks.syncBgControlState();
}

function enforceChinaConsularExportRules() {
  if (!isChinaConsularPreset()) return true;
  if (!hasChinaConsularMinPixels()) {
    exportHooks.toast(t('chinaConsularMinPixels'));
    return false;
  }
  const fmtEl = document.getElementById('exportFormat');
  if (fmtEl && getExportFormat() === 'png') syncExportFormatForPreset({ notify: true });
  return true;
}

function refreshExportMainText() {
  const kind = getExportKind();
  const btn = document.getElementById('btnExportMain');
  if (!btn) return;
  btn.textContent = kind === 'single' ? t('btnExportSingle') : t('btnExportSheet');
  const btnDlSingle = document.getElementById('btnDlSingle');
  if (btnDlSingle) btnDlSingle.textContent = getExportFormat().toUpperCase() === 'PNG' ? t('btnDlSinglePng') : t('btnDlSingleJpg');
}

function initExportControls() {
  document.getElementById('exportKind')?.addEventListener('change', refreshExportMainText);
  document.getElementById('exportFormat')?.addEventListener('change', refreshExportMainText);
  document.getElementById('btnExportMain')?.addEventListener('click', onExportMainClick);
}


function sanitizeName(input) {
  return String(input || '')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 50);
}

function pad2(n) { return String(n).padStart(2, '0'); }

function makeTimestamp() {
  const d = new Date();
  return `${d.getFullYear()}${pad2(d.getMonth()+1)}${pad2(d.getDate())}_${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`;
}

function rand4() { return Math.random().toString(36).slice(2, 6); }


function buildExportFilename({ kind, presetName, sizeText, ext }) {
  const autoUnique = (localStorage.getItem(KEY_AUTO_UNIQUE) ?? '1') === '1';
  const prefix = kind === 'sheet' ? t('exportPrefixSheet') : t('exportPrefixSingle');
  const safePreset = sanitizeName(presetName || localizePreset(PRESETS[0]).name);
  const safeSize = sanitizeName(sizeText || '33x48mm');
  const safeExt = (ext || 'jpg').toLowerCase() === 'png' ? 'png' : 'jpg';

  let name = `${prefix}_${safePreset}_${safeSize}`;
  if (autoUnique) name += `_${makeTimestamp()}_${rand4()}`;
  name += `.${safeExt}`;
  return name;
}

async function doExportMain() {
  if (!hasLoadedPhoto()) {
    exportHooks.toast(t('noPhotoYet'));
    return;
  }
  if (!enforceChinaConsularExportRules()) return;
  if (S.origImg && !S.noBgImg) {
    const shouldRemoveBgFirst = window.confirm(t('confirmRemoveBg'));
    if (shouldRemoveBgFirst) {
      await doRemoveBg();
    }
    return;
  }

  const kind = getExportKind();
  const ext = getExportFormat();
  S.exportKind = kind;
  S.exportFormat = ext;
  const p = S.preset;
  const localizedPreset = localizePreset(p);
  const filename = buildExportFilename({
    kind,
    presetName: localizedPreset.name,
    sizeText: `${p.w}x${p.h}mm`,
    ext
  });

  if (kind === 'single') {
    if (!S.resultDataUrl) await generate();
    await dlSingle(filename, ext);
  } else {
    if (!S.resultDataUrl) await generate();
    await dlPrint(filename, ext);
  }
}


function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isDesktopEnvironment() {
  if (typeof navigator.userAgentData?.mobile === 'boolean') {
    return navigator.userAgentData.mobile === false;
  }
  const ua = String(navigator.userAgent || '');
  return /Windows NT|Macintosh|X11|Linux x86_64|Win64|WOW64/i.test(ua);
}

function shouldUseWebShare() {
  if (isDesktopEnvironment()) return false;
  return isMobile();
}


async function copyToClipboard() {
  if (!S.resultDataUrl) return;
  try {
    const res = await fetch(S.resultDataUrl);
    const blob = await res.blob();
    const type = blob.type || 'image/png';
    await navigator.clipboard.write([new ClipboardItem({ [type]: blob })]);
    exportHooks.toast(t('copiedOk'));
  } catch(e) {
    exportHooks.toast(t('copyFailed'));
  }
}


async function exportWithShareOrFallback(blob, filename, options = {}) {
  const { promptDonation = true } = options;
  const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
  if (shouldUseWebShare() && navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: '证件照导出' });
      S.lastExportBlob = blob;
      S.lastExportFilename = filename;
      S.lastExportTarget = 'share-sheet';
      S.lastSavedLocation = '';
      exportHooks.refreshAfterExportActions();
      exportHooks.toast(t('sharePrompt'));
      if (promptDonation) maybePromptDonationAfterSuccess();
      return;
    } catch (e) {
      if (e.name !== 'AbortError') console.warn('share failed:', e);
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  S.lastExportBlob = blob;
  S.lastExportFilename = filename;
  S.lastExportTarget = 'browser-download';
  S.lastSavedLocation = '';
  exportHooks.refreshAfterExportActions();
  exportHooks.toast(t('downloadTriggered'));
  if (promptDonation) maybePromptDonationAfterSuccess();
}

async function blobToDataUrl(blob) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}


function getMinJpegSizeKBForPreset(preset) {
  const pid = preset?.id;
  if (pid === 'cn_pass' || pid === 'cn_visa') return 30;
  return 0;
}


async function ensureMinJpegBlobSize(blob, minKB) {
  if (!blob || !minKB || blob.size >= minKB * 1024) return blob;
  const padBytes = (minKB * 1024) - blob.size;
  if (padBytes <= 0) return blob;
  return new Blob([blob, new Uint8Array(padBytes)], { type: blob.type || 'image/jpeg' });
}

async function shareLastExport() {
  if (!S.lastExportBlob || !S.lastExportFilename) {
    exportHooks.toast(t('noExportYet'));
    return;
  }
  const file = new File([S.lastExportBlob], S.lastExportFilename, { type: S.lastExportBlob.type || 'image/png' });
  if (shouldUseWebShare() && navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: S.lastExportFilename });
      return;
    } catch (e) {
      if (e.name !== 'AbortError') console.warn('shareLastExport failed:', e);
      return;
    }
  }
  exportHooks.toast(t('shareUnavailable'));
}


function showSavedLocation() {
  const filename = S.lastExportFilename || '';
  window.alert(`${t('savedLocationTitle')}\n\n${t('savedLocationBrowserBody', filename)}`);
}


async function exportSingleBlob(ext = 'jpg') {
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
  const quality = ext === 'png' ? undefined : 0.95;
  const minJpegKB = ext === 'png' ? 0 : getMinJpegSizeKBForPreset(S?.preset);

  // 1) 优先用结果图
  if (S?.resultDataUrl) {
    // 用 canvas 重编码，确保格式/质量一致
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = S.resultDataUrl;
    });

    const c = document.createElement('canvas');
    c.width = img.naturalWidth || img.width;
    c.height = img.naturalHeight || img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise((resolve, reject) =>
      c.toBlob(b => b ? resolve(b) : reject(new Error('single toBlob failed')), mime, quality)
    );
    return await ensureMinJpegBlobSize(blob, minJpegKB);
  }

  // 2) 兜底：从编辑画布导出
  const ec = document.getElementById('editCanvas');
  if (ec && typeof ec.toBlob === 'function') {
    const blob = await new Promise((resolve, reject) =>
      ec.toBlob(b => b ? resolve(b) : reject(new Error('editCanvas toBlob failed')), mime, quality)
    );
    return await ensureMinJpegBlobSize(blob, minJpegKB);
  }

  throw new Error('请先上传并点击“生成”');
}


async function exportSheetBlob(ext = 'jpg') {
  const { w: pw, h: ph, dpi } = S?.preset || {};
  if (!pw || !ph || !dpi) throw new Error('规格参数缺失');

  const TW = mm2px(pw, dpi), TH = mm2px(ph, dpi);
  const PW = mm2px(152, dpi), PH = mm2px(102, dpi), GAP = mm2px(2, dpi);

  const colsEl = document.getElementById('rCol');
  const rowsEl = document.getElementById('rRow');
  const cutEl  = document.getElementById('cutChk');

  const cols = +(colsEl?.value) || 4;
  const rows = +(rowsEl?.value) || 2;
  const cut = !!(cutEl?.checked);

  const pc = document.createElement('canvas');
  pc.width = PW; pc.height = PH;
  const pctx = pc.getContext('2d');
  pctx.fillStyle = '#fff';
  pctx.fillRect(0, 0, PW, PH);

  const sx = Math.round((PW - (cols * TW + (cols - 1) * GAP)) / 2);
  const sy = Math.round((PH - (rows * TH + (rows - 1) * GAP)) / 2);

  // 用 single blob 做源，避免依赖 S.resultDataUrl 必须存在
  const baseBlob = await exportSingleBlob(ext);
  const baseUrl = URL.createObjectURL(baseBlob);

  const pi = new Image();
  await new Promise((resolve, reject) => {
    pi.onload = resolve;
    pi.onerror = reject;
    pi.src = baseUrl;
  });

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = sx + c * (TW + GAP);
      const y = sy + r * (TH + GAP);
      pctx.drawImage(pi, x, y, TW, TH);
      if (cut) {
        pctx.strokeStyle = '#aaa';
        pctx.lineWidth = 2;
        pctx.strokeRect(x, y, TW, TH);
      }
    }
  }

  URL.revokeObjectURL(baseUrl);

  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
  const quality = ext === 'png' ? undefined : 0.95;
  const blob = await new Promise((resolve, reject) =>
    pc.toBlob(b => b ? resolve(b) : reject(new Error('sheet toBlob failed')), mime, quality)
  );
  return await ensureMinJpegBlobSize(blob, ext === 'png' ? 0 : getMinJpegSizeKBForPreset(S?.preset));
}


async function dlSingle(filenameOverride, extOverride) {
  if (!hasLoadedPhoto()) {
    exportHooks.toast(t('noPhotoYet'));
    return;
  }
  if (!enforceChinaConsularExportRules()) return;
  const kind = 'single';
  const ext = extOverride || getExportFormat();
  const presetName = localizePreset(S?.preset || PRESETS[0]).name;
  const sizeText = (S?.preset?.w && S?.preset?.h) ? `${S.preset.w}x${S.preset.h}mm` : '33x48mm';
  const filename = filenameOverride || buildExportFilename({ kind, presetName, sizeText, ext });
  const blob = await exportSingleBlob(ext);
  if (!(await confirmChinaConsularExport(blob, ext))) return;
  await exportWithShareOrFallback(blob, filename);
}


async function dlPrint(filenameOverride, extOverride) {
  if (!hasLoadedPhoto()) {
    exportHooks.toast(t('noPhotoYet'));
    return;
  }
  if (!enforceChinaConsularExportRules()) return;
  const kind = 'sheet';
  const ext = extOverride || getExportFormat();
  const presetName = localizePreset(S?.preset || PRESETS[0]).name;
  const sizeText = (S?.preset?.w && S?.preset?.h) ? `${S.preset.w}x${S.preset.h}mm` : '33x48mm';
  const filename = filenameOverride || buildExportFilename({ kind, presetName, sizeText, ext });
  const blob = await exportSheetBlob(ext);
  await exportWithShareOrFallback(blob, filename);
}


async function exportSheet(cols, rows, cut, filename) {
  const colEl = document.getElementById('rCol');
  const rowEl = document.getElementById('rRow');
  const cutEl = document.getElementById('cutChk');
  if (colEl) colEl.value = String(cols);
  if (rowEl) rowEl.value = String(rows);
  if (cutEl) cutEl.checked = !!cut;
  updatePrint();
  await dlPrint(filename, getExportFormat());
}


async function onExportMainClick() {
  try {
    await doExportMain();
  } catch (err) {
    console.error(err);
    exportHooks.toast(t('exportFailed', err.message || err));
  }
}




export {
  generate,
  getExportKind,
  getExportFormat,
  syncExportFormatForPreset,
  syncPresetRestrictions,
  enforceChinaConsularExportRules,
  refreshExportMainText,
  initExportControls,
  sanitizeName,
  buildExportFilename,
  doExportMain,
  onExportMainClick,
  copyToClipboard,
  exportWithShareOrFallback,
  dlSingle,
  dlPrint,
  shareLastExport,
  showSavedLocation,
  exportSheet,
  setExportHooks
};
