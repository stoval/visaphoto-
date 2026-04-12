import { PRESETS, GUIDE_SPECS, BG_LABELS, mm2px } from './data/presets.js';
import { S, isChinaConsularPreset, hasChinaConsularMinPixels } from './state.js';
import { t, localizePreset, getCurrentLang } from './i18n.js';

const editorHooks = {
  setStep: () => {},
  setLdr: () => {},
  toast: () => {},
  saveDraft: () => {},
  blobToImg: async () => { throw new Error('blobToImg hook not set'); },
  syncPresetRestrictions: () => {},
  syncPresetUI: () => {},
  exportWithShareOrFallback: async () => {},
  buildExportFilename: () => ''
};

function setEditorHooks(next = {}) {
  Object.assign(editorHooks, next);
}

function onFile(e){
  const file = e?.target?.files?.[0];
  if(!file) return;
  if (typeof handleFile === 'function') return handleFile(file);
  if (typeof loadFile === 'function') return loadFile(file);
  console.error('onFile: no handler (handleFile/loadFile) found');
}


function downscaleIfNeeded(img, maxDim) {
  return new Promise(res => {
    if (img.width <= maxDim && img.height <= maxDim) return res(img);
    const scale = Math.min(maxDim / img.width, maxDim / img.height);
    const canvas = document.createElement('canvas');
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const newImg = new Image();
    newImg.onload = () => res(newImg);
    newImg.src = canvas.toDataURL('image/jpeg', 0.9);
  });
}


function loadFile(file) {
  if (file.size > 15 * 1024 * 1024) { editorHooks.toast('⚠️ 图片过大（>' + Math.round(file.size/1024/1024) + 'MB），自动降采样处理...'); }
  if (!localStorage.getItem('privacyOk')) {
    S._pendingFile = file;
    document.getElementById('privacyModal').classList.remove('hidden');
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = async () => {
      const processedImg = await downscaleIfNeeded(img, 4096);
      if (isChinaConsularPreset(S.preset) && !hasChinaConsularMinPixels(processedImg)) {
        editorHooks.toast(t('chinaConsularMinPixels'));
        return;
      }
      S.origImg=processedImg; S.noBgImg=null; S.useNoBg=false; S.resultDataUrl=null;
      S.userAdjusted = false;
      resetPos(processedImg);
      document.getElementById('dz').style.display='none';
      document.getElementById('stage').classList.add('show');
      document.getElementById('btnRst').disabled=false;
      document.getElementById('btnRmBg').disabled=false;
      document.getElementById('btnGen').disabled=false;
      document.getElementById('btnToggle').style.display='none';
      document.getElementById('emptyMsg').style.display='none';
      editorHooks.setStep(3);
      updateOffscreen();
      requestDraw();
      editorHooks.saveDraft();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}


function onPDown(e) {
  if(!S.origImg) return;
  if(e.pointerType === 'mouse' && e.button !== 0) return;
  const cv = document.getElementById('editCanvas');
  cv.setPointerCapture(e.pointerId);
  S.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (S.activePointers.size === 1) {
    S.gesture.mode = 'pan';
    S.lastX = e.clientX; S.lastY = e.clientY;
    S.dragMoved = false;
    S.isDragging = true;
  } else if (S.activePointers.size >= 2) {
    beginPinch();
  }
}


function onPMove(e) {
  if(!S.activePointers.has(e.pointerId)) return;
  S.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (S.gesture.mode === 'pan' && S.activePointers.size === 1) {
    const dx = e.clientX - S.lastX;
    const dy = e.clientY - S.lastY;
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      S.dragMoved = true; S.userAdjusted = true;
      const cv = document.getElementById('editCanvas');
      const r = cv.getBoundingClientRect();
      const sx = cv.width/r.width, sy = cv.height/r.height;
      S.tx += dx * sx; S.ty += dy * sy;
      S.lastX = e.clientX; S.lastY = e.clientY;
      requestDraw();
    }
  } else if (S.activePointers.size >= 2) {
    if (S.gesture.mode !== 'pinch') beginPinch();
    const pts = Array.from(S.activePointers.values());
    const p1 = pts[0], p2 = pts[1];
    const curDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
    const curCenter = { x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2 };
    
    const k = curDist / S.gesture.startDist;
    const newScale = Math.max(0.05, Math.min(20, S.gesture.startScale * k));
    const ratio = newScale / S.gesture.startScale;
    
    const cv = document.getElementById('editCanvas');
    const r = cv.getBoundingClientRect();
    const cx = curCenter.x - r.left, cy = curCenter.y - r.top;
    const c0x = S.gesture.center0.x - r.left, c0y = S.gesture.center0.y - r.top;

    S.scale = newScale;
    S.tx = cx - (c0x - S.gesture.startTx) * ratio;
    S.ty = cy - (c0y - S.gesture.startTy) * ratio;
    S.dragMoved = true; S.userAdjusted = true;
    requestDraw();
  }
}


function onPUp(e) {
  if (S.activePointers.has(e.pointerId)) {
    S.activePointers.delete(e.pointerId);
  }
  if (S.activePointers.size === 0) {
    if (S.isDragging && S.dragMoved) editorHooks.saveDraft();
    S.isDragging = false; S.dragMoved = false;
    S.gesture.mode = 'none';
  } else if (S.activePointers.size === 1) {
    const p = S.activePointers.values().next().value;
    S.gesture.mode = 'pan';
    S.lastX = p.x; S.lastY = p.y;
  } else {
    beginPinch();
  }
}


function beginPinch() {
  const pts = Array.from(S.activePointers.values());
  if (pts.length < 2) return;
  S.gesture.mode = 'pinch';
  S.gesture.startDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
  S.gesture.startScale = S.scale;
  S.gesture.startTx = S.tx;
  S.gesture.startTy = S.ty;
  S.gesture.center0 = { x: (pts[0].x+pts[1].x)/2, y: (pts[0].y+pts[1].y)/2 };
}


function resetPos(imgSrc) {
  const src = imgSrc || (S.useNoBg ? S.noBgImg : S.origImg);
  if (!src) return;
  const cv = document.getElementById('editCanvas');
  const {w:pw,h:ph} = S.preset;
  const asp = pw/ph;
  let fw=cv.width, fh=cv.width/asp;
  if(fh>cv.height){fh=cv.height;fw=cv.height*asp;}
  const ox=(cv.width-fw)/2, oy=(cv.height-fh)/2;
  S.scale = Math.max(fw/src.width, fh/src.height) * 1.05;
  S.tx = ox + (fw - src.width*S.scale)/2;
  S.ty = oy + (fh - src.height*S.scale)/2;
  S.rotate = 0;
  const rotEl = document.getElementById('rotLbl'); if(rotEl) rotEl.textContent='0°';
  updateOffscreen();
  requestDraw();
  editorHooks.saveDraft();
}

function onDs(e) {
  if(!S.origImg) return;
  // 仅响应左键或触摸
  if (e.button !== undefined && e.button !== 0) return;
  
  S.isDragging=true; S.dragMoved=false;
  S.lastX=e.clientX; S.lastY=e.clientY;
  S.tx0=S.tx; S.ty0=S.ty; 
  S.userAdjusted = true;
}

function onDm(e) {
  if(!S.isDragging) return;
  const dx = e.clientX - S.lastX;
  const dy = e.clientY - S.lastY;
  
  if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
    S.dragMoved = true;
    const r=document.getElementById('editCanvas').getBoundingClientRect();
    const sx=document.getElementById('editCanvas').width/r.width, sy=document.getElementById('editCanvas').height/r.height;
    S.tx += dx * sx;
    S.ty += dy * sy;
    S.lastX = e.clientX;
    S.lastY = e.clientY;
    requestDraw();
  }
}


function onAdj() {
  S.bright=+document.getElementById('rB').value;
  S.contrast=+document.getElementById('rC').value;
  S.sat=+document.getElementById('rS').value;
  document.getElementById('vB').textContent=S.bright;
  document.getElementById('vC').textContent=S.contrast;
  document.getElementById('vS').textContent=S.sat;
  updateOffscreen();
  requestDraw();
  editorHooks.saveDraft();
}

function resetAdj() {
  S.bright=100; S.contrast=100; S.sat=100;
  document.getElementById('rB').value=100;
  document.getElementById('rC').value=100;
  document.getElementById('rS').value=100;
  document.getElementById('vB').textContent=100;
  document.getElementById('vC').textContent=100;
  document.getElementById('vS').textContent=100;
  updateOffscreen();
  requestDraw();
  editorHooks.saveDraft();
}

function updateOffscreen() {
  const img = S.useNoBg ? S.noBgImg : S.origImg;
  if (!img) return;
  const oc = S.offCanvas;
  oc.width = img.width; oc.height = img.height;
  const ctx = oc.getContext('2d');
  ctx.clearRect(0, 0, oc.width, oc.height);
  ctx.filter = getFilter();
  ctx.drawImage(img, 0, 0);
  ctx.filter = 'none';
  
  // Debounced size preview
  clearTimeout(S.sizeDebounce);
  S.sizeDebounce = setTimeout(estimateSize, 500);
}


function requestDraw() {
  if (S.frameId) cancelAnimationFrame(S.frameId);
  S.userAdjusted = true;
  S.frameId = requestAnimationFrame(() => {
    drawEdit();
    S.frameId = null;
  });
}


function estimateSize() {
  if (!S.origImg) return;
  const c = renderSingleCanvas();
  const format = document.getElementById('fmtPng').checked ? 'image/png' : 'image/jpeg';
  const quality = format === 'image/jpeg' ? 0.95 : 1.0;
  const maxKB = parseInt(document.getElementById('maxKB')?.value, 10) || 0;
  c.toBlob(blob => {
    if (blob) {
      let sizeKB = Math.round(blob.size / 1024);
      if (maxKB > 0 && format === 'image/jpeg') {
        sizeKB = Math.min(sizeKB, maxKB);
      }
      document.getElementById('sizePrev').innerText = `${t('sizePrevLabel')}: ~${sizeKB} KB`;
    }
  }, format, quality);
}

function acceptPrivacy() {
  localStorage.setItem('privacyOk', '1');
  document.getElementById('privacyModal')?.classList.add('hidden');
  if (S._pendingFile) {
    const f = S._pendingFile;
    S._pendingFile = null;
    loadFile(f);
  }
}

function resetVal(type) {
  const idMap = { B: 'rB', C: 'rC', S: 'rS' };
  const input = document.getElementById(idMap[type]);
  if (!input) return;
  input.value = 100;
  S.userAdjusted = true;
  onAdj();
  editorHooks.toast(
    t(
      'resetValue',
      t(type === 'B' ? 'brightLabel' : type === 'C' ? 'contrastLabel' : 'saturationLabel')
    )
  );
}

function triggerUp() {
  const fileInput = document.getElementById('fi');
  if (!fileInput) return;
  fileInput.value = '';
  fileInput.click();
}

function initEditorInteractions() {
  const cv = document.getElementById('editCanvas');
  if (!cv) return;

  cv.style.touchAction = 'none';
  cv.addEventListener('pointerdown', onPDown);
  cv.addEventListener('pointermove', onPMove);
  window.addEventListener('pointerup', onPUp);
  window.addEventListener('pointercancel', onPUp);

  cv.addEventListener('wheel', e => {
    e.preventDefault();
    S.lastWheelAt = Date.now();
    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    const newScale = Math.max(0.05, Math.min(20, S.scale * factor));
    const r = cv.getBoundingClientRect();
    const cx = e.clientX - r.left;
    const cy = e.clientY - r.top;
    const k = newScale / S.scale;
    S.tx = cx - (cx - S.tx) * k;
    S.ty = cy - (cy - S.ty) * k;
    S.scale = newScale;
    S.userAdjusted = true;
    requestDraw();
  }, { passive: false });

  window.addEventListener('keydown', e => {
    if (!S.origImg) return;
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') { e.preventDefault(); adjMove(-step, 0); }
    if (e.key === 'ArrowRight') { e.preventDefault(); adjMove(step, 0); }
    if (e.key === 'ArrowUp') { e.preventDefault(); adjMove(0, -step); }
    if (e.key === 'ArrowDown') { e.preventDefault(); adjMove(0, step); }
    if (e.key === '+' || e.key === '=') { e.preventDefault(); adjScale(1); }
    if (e.key === '-') { e.preventDefault(); adjScale(-1); }
    if (e.key === ',' || e.key === '<') { e.preventDefault(); adjRotate(-1); }
    if (e.key === '.' || e.key === '>') { e.preventDefault(); adjRotate(1); }
  });

  const dz = document.getElementById('dz');
  if (!dz) return;
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
  dz.addEventListener('drop', e => {
    e.preventDefault();
    dz.classList.remove('drag-over');
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  });
}


function renderSingleCanvas() {
  const p = S.preset;
  const outW = mm2px(p.w, p.dpi || 300);
  const outH = mm2px(p.h, p.dpi || 300);
  const out = document.createElement('canvas');
  out.width = outW;
  out.height = outH;
  const ctx = out.getContext('2d');

  // background
  if (S.bgColor && S.bgColor !== 'transparent') {
    ctx.fillStyle = S.bgColor;
    ctx.fillRect(0, 0, outW, outH);
  } else {
    ctx.clearRect(0, 0, outW, outH);
  }

  const src = (S.offCanvas && S.offCanvas.width) ? S.offCanvas : (S.useNoBg ? S.noBgImg : S.origImg);
  if (!src) return out;

  const editCv = document.getElementById('editCanvas');
  const kx = outW / editCv.width;
  const ky = outH / editCv.height;

  ctx.save();
  ctx.translate(S.tx * kx, S.ty * ky);
  ctx.translate((src.width * S.scale * kx) / 2, (src.height * S.scale * ky) / 2);
  ctx.rotate((S.rotate || 0) * Math.PI / 180);
  ctx.translate(-(src.width * S.scale * kx) / 2, -(src.height * S.scale * ky) / 2);
  ctx.drawImage(src, 0, 0, src.width * S.scale * kx, src.height * S.scale * ky);
  ctx.restore();

  return out;
}

function getFilter() {
  const p=[];
  if(S.bright!==100) p.push(`brightness(${S.bright}%)`);
  if(S.contrast!==100) p.push(`contrast(${S.contrast}%)`);
  if(S.sat!==100) p.push(`saturate(${S.sat}%)`);
  return p.join(' ')||'none';
}

function applyCustom() {
  const w=Math.max(10,parseInt(document.getElementById('csW').value)||35);
  const h=Math.max(10,parseInt(document.getElementById('csH').value)||45);
  S.preset={id:'custom',name:t('customPresetName'),w,h,dpi:300};
  editorHooks.syncPresetRestrictions();
  editorHooks.syncPresetUI();
  resetPos(); drawEdit(); if(S.resultDataUrl) generate();
  editorHooks.saveDraft();
}


function drawEdit() {
  const src = S.useNoBg ? S.noBgImg : S.origImg;
  if (!src) return;
  const cv = document.getElementById('editCanvas');
  const ctx = cv.getContext('2d');
  const W=cv.width, H=cv.height;
  const {w:pw,h:ph}=S.preset;
  const asp=pw/ph;
  let fw=W, fh=W/asp; if(fh>H){fh=H;fw=H*asp;}
  const ox=(W-fw)/2, oy=(H-fh)/2;

  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='rgba(245,243,239,0.8)';
  ctx.fillRect(0,0,W,H);

  ctx.save();
  ctx.beginPath(); ctx.rect(ox,oy,fw,fh); ctx.clip();
  // Background
  if (S.bgColor==='transparent') {
    const s=10;
    for(let r=0;r*s<fh;r++) for(let c=0;c*s<fw;c++){ctx.fillStyle=(r+c)%2===0?'#ccc':'#eee';ctx.fillRect(ox+c*s,oy+r*s,s,s);}
  } else {
    ctx.fillStyle=S.bgColor; ctx.fillRect(ox,oy,fw,fh);
  }
  // Draw image with rotation (using Offscreen Canvas for performance)
  ctx.save();
  const drawSrc = S.offCanvas.width ? S.offCanvas : src;
  const imgCX=S.tx+src.width*S.scale/2, imgCY=S.ty+src.height*S.scale/2;
  const targetW = src.width*S.scale, targetH = src.height*S.scale;
  ctx.translate(imgCX,imgCY); ctx.rotate(S.rotate*Math.PI/180);
  ctx.drawImage(drawSrc,-targetW/2,-targetH/2,targetW,targetH);
  
  ctx.restore();
  ctx.restore();

  // Guide overlay
  if (S.showGuides) drawGuides(ctx, ox, oy, fw, fh);
  if (S.showSil) drawSilhouette(ctx, ox, oy, fw, fh);

  // Frame
  ctx.strokeStyle='#b8882a'; ctx.lineWidth=1.5;
  ctx.strokeRect(ox+.75,oy+.75,fw-1.5,fh-1.5);
  const tk=10; ctx.strokeStyle='#d4a84a'; ctx.lineWidth=2;
  [[ox,oy,1,1],[ox+fw,oy,-1,1],[ox,oy+fh,1,-1],[ox+fw,oy+fh,-1,-1]].forEach(([cx,cy,sx,sy])=>{
    ctx.beginPath(); ctx.moveTo(cx+sx*tk,cy); ctx.lineTo(cx,cy); ctx.lineTo(cx,cy+sy*tk); ctx.stroke();
  });
}


function drawGuides(ctx, ox, oy, fw, fh) {
  const gs = GUIDE_SPECS[S.preset.id];
  const pw=S.preset.w, ph=S.preset.h;
  const mX=mm=>fw*mm/pw, mY=mm=>fh*mm/ph;

  ctx.save();
  ctx.beginPath(); ctx.rect(ox,oy,fw,fh); ctx.clip();

  if (gs) {
    // Top forbidden zone (head must NOT be above this)
    ctx.fillStyle='rgba(200,50,40,0.15)';
    ctx.fillRect(ox, oy, fw, mY(gs.topForbidden));
    // Top target zone (head top should land here, 3–5mm from top)
    ctx.fillStyle='rgba(200,160,20,0.13)';
    ctx.fillRect(ox, oy+mY(gs.topForbidden), fw, mY(gs.topTarget - gs.topForbidden));
    // Bottom forbidden zone (chin must be > chinForbidden mm from bottom)
    ctx.fillStyle='rgba(200,50,40,0.15)';
    ctx.fillRect(ox, oy+fh-mY(gs.chinForbidden), fw, mY(gs.chinForbidden));
    // Chin target zone (chin should be in chinMin..chinMax from bottom)
    ctx.fillStyle='rgba(40,160,80,0.11)';
    ctx.fillRect(ox, oy+fh-mY(gs.chinMax), fw, mY(gs.chinMax - gs.chinMin));

    // Horizontal guide lines
    ctx.lineWidth=1;
    const hLine=(y,color,dash)=>{ ctx.strokeStyle=color; ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(ox,y); ctx.lineTo(ox+fw,y); ctx.stroke(); ctx.setLineDash([]); };
    hLine(oy+mY(gs.topForbidden),   'rgba(200,50,40,0.75)',  [4,3]);
    hLine(oy+mY(gs.topTarget),      'rgba(200,160,20,0.85)', [4,3]);
    hLine(oy+fh-mY(gs.chinMax),     'rgba(40,160,80,0.85)',  [4,3]);
    hLine(oy+fh-mY(gs.chinMin),     'rgba(40,160,80,0.85)',  [4,3]);
    hLine(oy+fh-mY(gs.chinForbidden),'rgba(200,50,40,0.75)', [4,3]);

    // Vertical face-width lines
    const vLine=(x,color,lw,dash)=>{ ctx.strokeStyle=color; ctx.lineWidth=lw; ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x,oy); ctx.lineTo(x,oy+fh); ctx.stroke(); ctx.setLineDash([]); };
    const oL=mX((pw-gs.faceMax)/2), oR=mX((pw+gs.faceMax)/2);
    const iL=mX((pw-gs.faceMin)/2), iR=mX((pw+gs.faceMin)/2);
    vLine(ox+oL,'rgba(40,160,80,0.9)',1.5,[5,3]);
    vLine(ox+oR,'rgba(40,160,80,0.9)',1.5,[5,3]);
    vLine(ox+iL,'rgba(40,160,80,0.35)',1,[5,3]);
    vLine(ox+iR,'rgba(40,160,80,0.35)',1,[5,3]);

    // Labels
    ctx.font='bold 9px monospace'; ctx.textAlign='right';
    const lbl=(txt,y,col)=>{ ctx.fillStyle=col; ctx.fillText(txt,ox+fw-3,y+4); };
    lbl(`≤${gs.topForbidden}mm`,    oy+mY(gs.topForbidden/2),                              'rgba(200,50,40,0.9)');
    lbl('头顶',                      oy+mY(gs.topForbidden+(gs.topTarget-gs.topForbidden)/2), 'rgba(180,130,10,0.95)');
    lbl('下巴',                      oy+fh-mY(gs.chinMin+(gs.chinMax-gs.chinMin)/2),          'rgba(30,130,60,0.95)');
    lbl(`≥${gs.chinForbidden}mm`,   oy+fh-mY(gs.chinForbidden/2),                            'rgba(200,50,40,0.9)');
  }

  // Center line HH
  ctx.strokeStyle='rgba(200,160,20,0.7)'; ctx.lineWidth=1; ctx.setLineDash([7,4]);
  ctx.beginPath(); ctx.moveTo(ox+fw/2,oy); ctx.lineTo(ox+fw/2,oy+fh); ctx.stroke();
  ctx.setLineDash([]);

  if (gs) {
    ctx.font='bold 9px monospace'; ctx.textAlign='center';
    ctx.fillStyle='rgba(180,130,10,0.85)';
    ctx.fillText('HH',ox+fw/2,oy+10);
  }
  ctx.restore();
}


function drawSilhouette(ctx, ox, oy, fw, fh) {
  const pw=S.preset.w, ph=S.preset.h;
  const mX=mm=>fw*mm/pw, mY=mm=>fh*mm/ph;
  const gs = GUIDE_SPECS[S.preset.id];
  
  ctx.save();
  ctx.beginPath(); ctx.rect(ox,oy,fw,fh); ctx.clip();
  ctx.strokeStyle='rgba(184, 136, 42, 0.7)';
  ctx.lineWidth=2;

  const cx=ox+fw/2;
  if (gs && isChinaConsularPreset(S.preset)) {
    const outerHeadW = mX(gs.faceMax + 6);
    const outerHeadH = mY(gs.headMax + 5);
    const innerHeadW = mX(gs.faceMin + 6);
    const innerHeadH = mY(gs.headMin + 3);
    const outerTop = oy + mY(gs.topForbidden);
    const innerTop = oy + mY(gs.topTarget);
    const outerCy = outerTop + outerHeadH / 2;
    const innerCy = innerTop + innerHeadH / 2;

    ctx.fillStyle='rgba(212,168,74,0.05)';
    ctx.beginPath();
    ctx.ellipse(cx, outerCy, outerHeadW/2, outerHeadH/2, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle='rgba(184,136,42,0.78)';
    ctx.beginPath();
    ctx.ellipse(cx, outerCy, outerHeadW/2, outerHeadH/2, 0, 0, Math.PI*2);
    ctx.stroke();

    ctx.setLineDash([5,4]);
    ctx.strokeStyle='rgba(212,168,74,0.92)';
    ctx.beginPath();
    ctx.ellipse(cx, innerCy, innerHeadW/2, innerHeadH/2, 0, 0, Math.PI*2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.lineWidth=1;
    ctx.setLineDash([6,4]);
    ctx.beginPath(); ctx.moveTo(cx, outerCy-outerHeadH/2); ctx.lineTo(cx, outerCy+outerHeadH/2); ctx.stroke();
    const eyeLineY = oy + mY(gs.topTarget + (gs.headMin * 0.55));
    ctx.beginPath(); ctx.moveTo(cx-innerHeadW/2, eyeLineY); ctx.lineTo(cx+innerHeadW/2, eyeLineY); ctx.stroke();
    ctx.setLineDash([]);
  } else {
    const headW=mX(pw*0.6); 
    const headH=mY(ph*0.75);
    const topBuffer=mY(5);
    const cy=oy + topBuffer + headH/2; 

    ctx.beginPath();
    ctx.ellipse(cx, cy, headW/2, headH/2, 0, 0, Math.PI*2);
    ctx.stroke();

    ctx.lineWidth=1;
    ctx.setLineDash([6,4]);
    ctx.beginPath(); ctx.moveTo(ox, cy); ctx.lineTo(ox+fw, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy-headH/2); ctx.lineTo(cx, cy+headH/2); ctx.stroke();
    ctx.setLineDash([]);
  }
  
  ctx.restore();
}


function smartAlign() {
  if (!S.noBgImg) return;
  const img = S.noBgImg;
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0,0,c.width,c.height).data;
  
  let minX=c.width, maxX=0, minY=c.height, maxY=0;
  for (let y=0; y<c.height; y++) {
    for (let x=0; x<c.width; x++) {
      if (data[(y*c.width+x)*4+3] > 10) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX <= minX) return;
  
  const faceW = maxX - minX;
  const faceH = maxY - minY;
  const cv = document.getElementById('editCanvas');
  const {w:pw,h:ph} = S.preset;
  const gs = GUIDE_SPECS[S.preset.id];
  const asp = pw/ph;
  let fw=cv.width, fh=cv.width/asp; if(fh>cv.height){fh=cv.height;fw=cv.height*asp;}
  const ox=(cv.width-fw)/2, oy=(cv.height-fh)/2;
  const mX = mm => fw * mm / pw;
  const mY = mm => fh * mm / ph;

  if (gs && isChinaConsularPreset(S.preset)) {
    const headScanBottom = Math.min(c.height - 1, Math.round(minY + faceH * 0.58));
    let headMinX = c.width, headMaxX = 0;
    for (let y = minY; y <= headScanBottom; y++) {
      for (let x = 0; x < c.width; x++) {
        if (data[(y * c.width + x) * 4 + 3] > 10) {
          if (x < headMinX) headMinX = x;
          if (x > headMaxX) headMaxX = x;
        }
      }
    }

    const headW = headMaxX > headMinX ? (headMaxX - headMinX) : faceW;
    const targetHeadH = mY((gs.headMin + gs.headMax) / 2);
    const targetHeadW = mX((gs.faceMin + gs.faceMax) / 2);
    const scaleByHeight = targetHeadH / faceH;
    const scaleByWidth = targetHeadW / headW;

    S.scale = Math.min(scaleByHeight, scaleByWidth);
    S.tx = ox + (fw / 2) - ((headMinX + headW / 2) * S.scale);
    S.ty = oy + mY((gs.topForbidden + gs.topTarget) / 2) - (minY * S.scale);
    S.rotate = 0;
    const rotEl = document.getElementById('rotLbl'); if(rotEl) rotEl.textContent='0°';
    return;
  }
  
  // Align head (top 20% to bottom 85% approx)
  const targetH = fh * 0.75;
  S.scale = targetH / faceH;
  // Center horizontally
  S.tx = ox + (fw/2) - (minX + faceW/2) * S.scale;
  // Align top
  S.ty = oy + mY(5) - (minY) * S.scale;
  S.rotate = 0;
  const rotEl = document.getElementById('rotLbl'); if(rotEl) rotEl.textContent='0°';
}



async function doRemoveBg() {
  if (!S.origImg) { editorHooks.toast(t('noPhotoYet')); return; }
  
  // 1) 备份当前构图状态
  const keep = {
    tx: S.tx, ty: S.ty, scale: S.scale, rotate: S.rotate,
    bright: S.bright, contrast: S.contrast, sat: S.sat
  };

  // 1.1) 优先本地抠图
  const localSuccess = await doLocalRemoveBg(keep);
  if (localSuccess) return;

  editorHooks.toast(t('removeBgFailedRetry'));
}


async function doLocalRemoveBg(keepOverride) {
  if (typeof SelfieSegmentation === 'undefined') {
    editorHooks.toast(t('removeBgMissingModel'));
    return false;
  }
  
  // 备份构图（如果不是从 doRemoveBg 传进来的话）
  const keep = keepOverride || {
    tx: S.tx, ty: S.ty, scale: S.scale, rotate: S.rotate,
    bright: S.bright, contrast: S.contrast, sat: S.sat
  };

  editorHooks.setLdr(true, t('removeBgLocalLoading'));
  editorHooks.setStep(2);

  try {
    const MP_BASE = '/vendor/mediapipe/selfie_segmentation/'; 
    const selfie = new SelfieSegmentation({
      locateFile: file => {
        const u = MP_BASE + file;
        console.log('[MediaPipe locateFile]', file, '=>', u);
        return u;
      }
    });

    selfie.setOptions({ modelSelection: 1 });

    const result = await new Promise((resolve, reject) => {
      let done = false; 
      const timer = setTimeout(() => {
        if (!done) {
          done = true;
          reject(new Error(t('removeBgTimeout')));
        }
      }, 20000);

      selfie.onResults(res => {
        if (!done) {
          done = true;
          clearTimeout(timer);
          resolve(res);
        }
      });

      selfie.send({ image: S.origImg }).catch(err => {
        if (!done) {
          done = true;
          clearTimeout(timer);
          reject(err);
        }
      });
    });

    if (!result || !result.segmentationMask || maskLooksInvalid(result.segmentationMask)) {
      throw new Error(t('removeBgInvalidMask'));
    }

    const { width:w, height:h } = S.origImg;
    const c = document.createElement('canvas'); c.width=w; c.height=h;
    const ctx = c.getContext('2d');
    const refinedMask = result.segmentationMask;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(S.origImg, 0, 0, w, h);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(refinedMask, 0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';

    const outBlob = await canvasToBlob(c, 'image/png', 1);
    const outImg = await editorHooks.blobToImg(outBlob);

    S.noBgImg = outImg;
    S.useNoBg = true;
    
    // 恢复状态
    S.tx=keep.tx; S.ty=keep.ty; S.scale=keep.scale; S.rotate=keep.rotate;
    S.bright=keep.bright; S.contrast=keep.contrast; S.sat=keep.sat;

    if (!S.userAdjusted) {
      try { smartAlign(); } catch (e) {}
    }

    editorHooks.setStep(3);
    document.getElementById('btnToggle').style.display = 'inline-flex';
    document.getElementById('btnToggle').textContent = t('viewOriginal');
    editorHooks.toast(t('removeBgLocalOk'));
    updateOffscreen(); requestDraw(); editorHooks.saveDraft();
    void offerSaveFullCutout();
    return true;
  } catch (e) {
    console.warn('[Local Removal Failed]', e);
    editorHooks.toast(t('removeBgLocalFailed', e.message || t('unknownError')));
    return false;
  } finally {
    editorHooks.setLdr(false);
  }
}


function canvasToBlob(cv, type='image/png', quality=1) {
  return new Promise(resolve => cv.toBlob(resolve, type, quality));
}

function confirmCutoutSave() {
  return new Promise(resolve => {
    const modal = document.getElementById('cutoutSaveModal');
    const body = document.getElementById('cutoutSaveBody');
    const btnCancel = document.getElementById('cutoutSaveCancel');
    const btnConfirm = document.getElementById('cutoutSaveConfirm');
    if (!modal || !body || !btnCancel || !btnConfirm) {
      resolve(window.confirm(isChinaConsularPreset() ? t('confirmSaveChinaCutout') : t('confirmSaveCutout')));
      return;
    }

    body.textContent = isChinaConsularPreset() ? t('confirmSaveChinaCutout') : t('confirmSaveCutout');
    modal.classList.remove('hidden');

    const cleanup = (result) => {
      modal.classList.add('hidden');
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


async function offerSaveFullCutout() {
  if (!S.noBgImg) return;
  const shouldSave = await confirmCutoutSave();
  if (!shouldSave) return;

  const canvas = document.createElement('canvas');
  canvas.width = S.noBgImg.naturalWidth || S.noBgImg.width;
  canvas.height = S.noBgImg.naturalHeight || S.noBgImg.height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(S.noBgImg, 0, 0, canvas.width, canvas.height);

  const ext = 'jpg';
  const mime = 'image/jpeg';
  const quality = 0.95;
  const blob = await canvasToBlob(canvas, mime, quality);
  const localizedPreset = localizePreset(S.preset);
  const filename = editorHooks.buildExportFilename({
    kind: 'single',
    presetName: isChinaConsularPreset() ? `${localizedPreset.name}_application_photo` : `${localizedPreset.name}_white_bg_photo`,
    sizeText: `${canvas.width}x${canvas.height}px`,
    ext
  });
  await editorHooks.exportWithShareOrFallback(blob, filename, { countQuota: false, promptDonation: false });
}


function toggleNoBg() {
  if (!S.noBgImg) return;
  S.useNoBg = !S.useNoBg;
  requestDraw();
  editorHooks.saveDraft();
}


function generate() {
  if (S.origImg && !S.noBgImg) {
    const shouldRemoveBgFirst = window.confirm(t('confirmRemoveBg'));
    if (shouldRemoveBgFirst) {
      return doRemoveBg();
    }
    return Promise.resolve(null);
  }
  const src = S.useNoBg ? S.noBgImg : S.origImg;
  if (!src) return;
  editorHooks.setLdr(true, t('loaderGenerating')); editorHooks.setStep(4);

  return new Promise((resolve, reject) => {
    setTimeout(async ()=>{
    try {
      const {w:pw,h:ph,dpi}=S.preset;
      const oW=mm2px(pw,dpi), oH=mm2px(ph,dpi);
      const off=document.createElement('canvas'); off.width=oW; off.height=oH;
      const octx=off.getContext('2d');

      // BG
      if(S.bgColor==='transparent'){
        octx.clearRect(0,0,oW,oH);
      } else {
        octx.fillStyle=S.bgColor; octx.fillRect(0,0,oW,oH);
      }

      const cv=document.getElementById('editCanvas');
      const CW=cv.width,CH=cv.height, asp=pw/ph;
      let fw=CW,fh=CW/asp; if(fh>CH){fh=CH;fw=CH*asp;}
      const ox=(CW-fw)/2,oy=(CH-fh)/2;
      const sc=oW/fw;

      octx.save();
      const imgCX=(S.tx-ox)*sc+src.width*S.scale*sc/2, imgCY=(S.ty-oy)*sc+src.height*S.scale*sc/2;
      const targetW = src.width*S.scale*sc, targetH = src.height*S.scale*sc;
      octx.translate(imgCX,imgCY); octx.rotate(S.rotate*Math.PI/180);
      octx.filter=getFilter();
      octx.drawImage(src,-targetW/2,-targetH/2,targetW,targetH);
      octx.filter='none';

      octx.restore();

      const format = document.getElementById('fmtPng').checked ? 'image/png' : 'image/jpeg';
      const maxKB=parseInt(document.getElementById('maxKB').value)||0;
      
      let finalData = '';
      if(maxKB > 0 && format === 'image/jpeg') {
        let q=0.95, data=off.toDataURL(format, q);
        let lo=0.1, hi=0.95;
        const getSz=d=>Math.round((d.split(',')[1]||'').length*0.75);
        if(getSz(data) > maxKB*1024) {
          for(let i=0; i<9; i++) {
            const mid=(lo+hi)/2; data=off.toDataURL(format, mid);
            if(getSz(data)<=maxKB*1024) lo=mid; else hi=mid;
          }
          data=off.toDataURL(format, lo);
        }
        finalData = data;
      } else {
        finalData = off.toDataURL(format, 0.95);
      }

      S.resultDataUrl = finalData;
      const fileSizeKB = Math.round((S.resultDataUrl.split(',')[1]||'').length * 0.75 / 1024);
      const lang = getCurrentLang();
      const bgLabels = BG_LABELS[lang] || BG_LABELS.zh;
      const bgDisplay = S.bgColor === 'transparent' ? (bgLabels.transparent || 'Transparent') : (bgLabels[S.bgColor] || (S.bgColor || '#FFFFFF').toUpperCase());
      const localizedPreset = localizePreset(S.preset);
      
      document.getElementById('resultPrev').src = S.resultDataUrl;
      document.getElementById('infoTbl').innerHTML = `
        <tr><td>${t('infoSpec')}</td><td>${localizedPreset.name}</td></tr>
        <tr><td>${t('infoSize')}</td><td>${pw}×${ph} mm</td></tr>
        <tr><td>${t('infoPixels')}</td><td>${oW}×${oH} px</td></tr>
        <tr><td>${t('infoDpi')}</td><td>${dpi} dpi</td></tr>
        <tr><td>${t('infoFileSize')}</td><td>${fileSizeKB} KB</td></tr>
        <tr><td>${t('infoBg')}</td><td>${bgDisplay}</td></tr>
        <tr><td>${t('infoCutout')}</td><td>${S.useNoBg ? t('infoCutoutYes') : t('infoCutoutNo')}</td></tr>`;
      
      document.getElementById('prevBox').classList.add('show');
      document.getElementById('printBox').classList.add('show');
      document.getElementById('dlBox').classList.add('show');
      document.getElementById('sizePrev').innerText = `${t('sizePrevLabel')}: ~${fileSizeKB} KB`;
      updatePrint();
      editorHooks.toast(t('generatedOk'));
      resolve(finalData);
    } catch(e) {
      console.error(e);
      editorHooks.toast(t('generateFailed', e.message));
      reject(e);
    } finally {
      editorHooks.setLdr(false);
    }
    }, 100);
  });
}


function smartPrintDefaults(preset) {
  const PAPER_W=152, PAPER_H=101, GAP=2;
  const cols = Math.min(6, Math.floor((PAPER_W+GAP)/(preset.w+GAP)));
  const rows = Math.min(5, Math.floor((PAPER_H+GAP)/(preset.h+GAP)));
  document.getElementById('rCol').value = Math.max(2,cols);
  document.getElementById('rRow').value = Math.max(1,rows);
  document.getElementById('vCol').textContent = Math.max(2,cols);
  document.getElementById('vRow').textContent = Math.max(1,rows);
}

function updatePrint() {
  if (!S.resultDataUrl) return;
  const cols=+document.getElementById('rCol').value;
  const rows=+document.getElementById('rRow').value;
  const cut=document.getElementById('cutChk').checked;
  document.getElementById('vCol').textContent=cols;
  document.getElementById('vRow').textContent=rows;

  const {w:pw,h:ph}=S.preset;
  const sc=(200-8)/152; // 6-inch paper preview
  const tw=Math.round(pw*sc), th=Math.round(ph*sc), gap=Math.round(2*sc);

  const wrap=document.getElementById('printWrap'); wrap.innerHTML='';
  const grid=document.createElement('div'); grid.className='print-grid'; grid.style.gap=gap+'px';
  for(let r=0;r<rows;r++){
    const row=document.createElement('div'); row.className='print-row-g'; row.style.gap=gap+'px';
    for(let c=0;c<cols;c++){
      const img=document.createElement('img'); img.src=S.resultDataUrl;
      img.className='print-thumb-img'; img.width=tw; img.height=th;
      img.style.border=cut?'1px dashed #bbb':'none';
      row.appendChild(img);
    }
    grid.appendChild(row);
  }
  wrap.appendChild(grid);
}


function adjScale(d){ 
  S.scale=Math.max(0.05,Math.min(20,S.scale*(d>0?1.04:1/1.04))); 
  S.userAdjusted = true;
  drawEdit(); 
}

function adjRotate(d){
  S.rotate=(S.rotate+d+360)%360;
  S.userAdjusted = true;
  const el=document.getElementById('rotLbl');
  if(el) el.textContent = S.rotate===0 ? '0°' : S.rotate+'°';
  drawEdit();
}

function adjMove(dx,dy){ 
  S.tx+=dx; S.ty+=dy; 
  S.userAdjusted = true;
  drawEdit(); 
}


function maskLooksInvalid(mask) {
  const t = document.createElement('canvas');
  const tw = 64, th = 64;
  t.width = tw; t.height = th;
  const tctx = t.getContext('2d');
  tctx.drawImage(mask, 0, 0, tw, th);
  const data = tctx.getImageData(0, 0, tw, th).data;
  let bright = 0;
  for (let i = 0; i < data.length; i += 4) bright += data[i]; 
  const avg = bright / (data.length / 4);
  return avg > 250 || avg < 5;
}



export {
  triggerUp,
  initEditorInteractions,
  onFile,
  downscaleIfNeeded,
  loadFile,
  onPDown,
  onPMove,
  onPUp,
  beginPinch,
  resetPos,
  onDs,
  onDm,
  onAdj,
  acceptPrivacy,
  resetVal,
  resetAdj,
  updateOffscreen,
  requestDraw,
  estimateSize,
  renderSingleCanvas,
  getFilter,
  applyCustom,
  drawEdit,
  drawGuides,
  drawSilhouette,
  smartAlign,
  doRemoveBg,
  doLocalRemoveBg,
  canvasToBlob,
  offerSaveFullCutout,
  toggleNoBg,
  generate,
  smartPrintDefaults,
  updatePrint,
  adjScale,
  adjRotate,
  adjMove,
  maskLooksInvalid,
  setEditorHooks
};
