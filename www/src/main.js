import { bootstrap } from './ui.js';
import { applyCustom, doRemoveBg, onFile, adjScale, adjRotate, adjMove, resetPos, resetAdj, onAdj, toggleNoBg, drawEdit, triggerUp, resetVal, acceptPrivacy } from './editor.js';
import { generate, dlSingle, dlPrint, copyToClipboard, shareLastExport, showSavedLocation } from './export.js';
import { updatePrint } from './editor.js';
import { S } from './state.js';

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (!/^https?:$/.test(window.location.protocol)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('SW register failed:', err);
    });
  });
}

window.applyCustom = applyCustom;
window.doRemoveBg = doRemoveBg;
window.triggerUp = triggerUp;
window.onFile = onFile;
window.adjScale = adjScale;
window.adjRotate = adjRotate;
window.adjMove = adjMove;
window.resetPos = resetPos;
window.resetAdj = resetAdj;
window.onAdj = onAdj;
window.generate = generate;
window.dlSingle = dlSingle;
window.dlPrint = dlPrint;
window.copyToClipboard = copyToClipboard;
window.toggleNoBg = toggleNoBg;
window.updatePrint = updatePrint;
window.resetVal = resetVal;
window.acceptPrivacy = acceptPrivacy;
window.shareLastExport = shareLastExport;
window.showSavedLocation = showSavedLocation;

window.drawEdit = drawEdit;
window.S = S;

bootstrap();
registerServiceWorker();
