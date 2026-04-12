import { PRESETS, RELEASE_FALLBACK } from './data/presets.js';

const S = {
  preset: PRESETS[0],
  bgColor: '#FFFFFF',
  bright: 100,
  contrast: 100,
  sat: 100,
  origImg: null,
  noBgImg: null,
  useNoBg: false,
  tx: 0,
  ty: 0,
  scale: 1,
  rotate: 0,
  showGuides: true,
  showSil: true,
  dragging: false,
  dx0: 0,
  dy0: 0,
  tx0: 0,
  ty0: 0,
  pinchDist: 0,
  pinchScale: 1,
  resultDataUrl: null,
  offCanvas: document.createElement('canvas'),
  lastDrawTime: 0,
  frameId: null,
  userAdjusted: false,
  isDragging: false,
  dragMoved: false,
  lastX: 0,
  lastY: 0,
  lastWheelAt: 0,
  activePointers: new Map(),
  gesture: { mode: 'none', startDist: 1, startScale: 1, center0: { x: 0, y: 0 }, startTx: 0, startTy: 0 },
  exportFormat: 'png',
  exportKind: 'single',
  lastExportBlob: null,
  lastExportFilename: '',
  lastSavedLocation: '',
  lastExportTarget: '',
  premiumUnlocked: false,
  premiumPrice: ''
};

const releaseState = { ...RELEASE_FALLBACK };

function isChinaConsularPreset(preset = S.preset) {
  return preset?.id === 'cn_pass' || preset?.id === 'cn_visa';
}

function hasChinaConsularMinPixels(img = S.origImg) {
  const w = img?.naturalWidth || img?.width || 0;
  const h = img?.naturalHeight || img?.height || 0;
  return w >= 354 && h >= 472;
}

function hasLoadedPhoto() {
  return !!(S.origImg || S.noBgImg);
}

export { S, releaseState, isChinaConsularPreset, hasChinaConsularMinPixels, hasLoadedPhoto };
