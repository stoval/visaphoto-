import { PRESETS, BG_COLORS, BG_LABELS, KEY_LANG, LANG_OPTIONS, PRESET_LOCALES, RELEASE_FALLBACK } from './data/presets.js';
import { S, releaseState } from './state.js';

const hooks = {
  syncPresetUI: () => {},
  renderLanguageMenu: () => {},
  refreshExportMainText: () => {},
  refreshAfterExportActions: () => {}
};

function setI18nHooks(next = {}) {
  Object.assign(hooks, next);
}

const I18N = {
  zh: {
    appTitle: 'VisaPics',
    headerSub: '浏览器本地处理 · 隐私优先',
    metaTitle: 'VisaPics | 在浏览器中私密制作护照与签证照片',
    metaDescription: '直接在浏览器中制作护照、签证与证件照。可去除背景、选择标准尺寸，并快速导出可用图像，全程更私密。',
    heroEyebrow: '浏览器内私密证件照工具',
    heroTitle: '在浏览器中私密制作护照与签证照片',
    heroSubtitle: '选择证件类型，上传人像照片，去除背景，并在几分钟内导出可直接使用的证件照，无需把照片发送到远程服务器。',
    heroUploadCta: '上传照片',
    heroFormatsCta: '查看支持格式',
    heroTrustLine: '本地运行 · 照片保留在你的设备上',
    feature1Title: '本地处理',
    feature1Body: '编辑过程在浏览器内完成，照片在处理过程中保留在你的设备上。',
    feature2Title: '自动去除背景',
    feature2Body: '快速去除背景，并在导出前微调结果。',
    feature3Title: '内置常用规格',
    feature3Body: '可选择多国常见的护照、签证和证件照尺寸。',
    feature4Title: '灵活导出',
    feature4Body: '可下载单张照片或可打印的排版图，支持 JPG 和 PNG。',
    startHereLabel: '开始使用',
    startHereTitle: '先选择规格，再上传照片',
    startHereBody: '先为你的证件选择预设规格；如有需要也可以使用自定义尺寸。然后上传一张清晰的人像照片开始制作。',
    documentTypeLabel: '证件类型',
    documentTypeHint: '先选择护照、签证或证件照规格，再开始上传。',
    advancedOptionsLabel: '高级选项',
    advancedOptionsHint: '参考线、自定义尺寸、背景色与图像调整',
    dropSubTitle: '拖放照片到这里，或点击选择文件',
    howItWorksLabel: '使用流程',
    howItWorksTitle: '4 步生成合规照片',
    flow1Title: '上传照片',
    flow1Body: '从手机或电脑中选择一张清晰的人像照。',
    flow2Title: '去除背景',
    flow2Body: '自动去除背景，并按需要微调构图。',
    flow3Title: '选择尺寸和背景',
    flow3Body: '为你的证件选择所需规格与背景颜色。',
    flow4Title: '下载最终照片',
    flow4Body: '导出数字照片或可打印的排版图。',
    bestResultsLabel: '更好效果',
    bestResultsTitle: '让结果更干净的小提示',
    tip1: '使用正面人像照',
    tip2: '让面部光线尽量均匀',
    tip3: '避免强逆光',
    tip4: '尽量使用纯色背景',
    tip5: '头部和肩部周围保留足够空间',
    emptyMsgHtml: '上传人像照片后<br>处理结果会显示在这里',
    exportBoxTitle: '下载选项',
    keepTransparentLabel: '保持透明 (PNG)',
    sizeLimitLabel: '文件大小上限',
    sizeLimitHint: 'KB（0=不限）',
    sizeGuideHtml: '常见上限参考：<br>领事网上传 ≤ 120 KB<br>美签 DS-160 ≤ 240 KB<br>加拿大 IRCC ≤ 4000 KB',
    afterExportTitle: '下载后操作',
    btnShareExported: '↗ 分享已下载文件',
    btnLocateExported: '📁 查看保存位置',
    btnDlSingleJpg: '⬇ 下载 JPG 照片',
    btnDlSinglePng: '⬇ 下载 PNG 照片',
    btnDlPrint: '⬇ 下载排版图',
    btnCopyImg: '📋 复制图片',
    btnExportSingle: '下载',
    btnExportSheet: '下载排版',
    btnRemoveBgShort: '去背景',
    btnReuploadShort: '换照片',
    langButtonShort: '语言',
    themeToggleTitle: '切换主题',
    releaseToggleTitle: '版本信息',
    exportKindSingle: '单张照片',
    exportKindSheet: '排版图（6寸）',
    langMenuTitle: '选择语言',
    langMenuClose: '关闭',
    releaseTitle: '版本信息',
    releaseClose: '关闭',
    exportReportTitle: '下载确认',
    exportReportCancel: '返回继续调整',
    exportReportConfirm: '确认下载',
    exportReportSpec: '规格',
    exportReportFormat: '格式',
    exportReportSize: '体积',
    exportReportBackground: '背景',
    exportReportRecommendation: '建议',
    exportReportReady: '',
    exportReportAutoOptimized: '已自动优化',
    exportReportRecommendedRange: '推荐上传范围 40–120 KB',
    releaseEmpty: '暂无更新记录',
    releaseMeta: (version, updatedAt, build) => `版本 ${version}${build ? ` (${build})` : ''}${updatedAt ? ` · 更新于 ${updatedAt}` : ''}`,
    sectAi: 'AI 抠图',
    apiDescHtml: '免费账号每月可处理 50 张，无需付费。<br>没有 Key？直接跳过也可手动换背景色。',
    apiLinkText: '→ 免费注册获取 Key',
    apiPlaceholder: '粘贴你的 API Key...',
    apiSaveBtn: '保存',
    sectSpecs: '照片规格',
    officialSpecLink: '📚 中国海关/电子护照官方规格说明 (参考)',
    customSizeLabel: '自定义尺寸 (mm)',
    applyCustomBtn: '应用尺寸',
    sectGuides: '对齐参考',
    guideToggleLabel: '显示参考线',
    silToggleLabel: '显示人像轮廓 (Beta)',
    guideLegend1: '让头顶和下巴保持在红色区域外',
    guideLegend2: '头顶参考区（距上边 3–5mm）',
    guideLegend3: '下巴参考区（距下边 7–14mm）',
    guideLegend4: '脸宽参考线（最大 22mm）',
    guideLegend5: '鼻梁垂直中心线',
    guideLegend6: '人像轮廓（帮助头部与眼线对齐）',
    chinaDoubleOvalGuide: '双椭圆头部目标区',
    guideLegend7: '↑ 规格因所选证件而变化',
    sectBg: '背景颜色',

    sectClothes: '正装替换 (Beta)',
    stickerNoneTitle: '无',
    stickerMaleTitle: '男装',
    stickerFemaleTitle: '女装',
    stickerYLabel: '垂直位置',
    sectAdjust: '手动调整',
    brightLabel: '亮度',
    contrastLabel: '对比度',
    saturationLabel: '饱和度',
    resetAdjustBtn: '↺ 重置图像调整',
    step1Label: '上传照片',
    step2Label: '去背景',
    step3Label: '调整位置',
    step4Label: '下载',
    dropTitle: '上传一张人像照片',
    dropHint: 'JPG / PNG · 推荐人像模式拍摄 · 纯色背景 · 正面均匀光 · 避开逆光',
    dropHintChina: 'JPG / PNG · 推荐人像模式拍摄 · 纯色背景 · 正面均匀光 · 避开逆光',
    canvasHint: '拖动调整 · 滚轮/双指缩放 · 方向键微移 · Shift+方向键粗移',
    loaderText: '处理中...',
    btnReuploadFull: '↑ 重新上传',
    btnReset: '重置',
    btnToggleOriginal: '切换原图',
    btnRemoveBgFull: '✦ AI 抠图',
    btnGenerate: '✓ 准备下载',
    singlePreviewTitle: '照片预览',
    printBoxTitle: '排版预览',
    perRowLabel: '每行张数',
    rowCountLabel: '行数',
    cutLineLabel: '显示裁切线',
    sizePrevLabel: '预计大小',
    infoSpec: '规格',
    infoSize: '尺寸',
    infoPixels: '像素',
    infoDpi: '分辨率',
    infoFileSize: '文件大小',
    infoBg: '背景',
    infoCutout: '抠图',
    infoCutoutYes: '✓ AI 抠图',
    infoCutoutNo: '原图背景',
    exportPrefixSingle: '证件照',
    exportPrefixSheet: '排版图',
    loaderGenerating: '生成证件照…',
    generatedOk: '✓ 照片已可下载',
    generateFailed: msg => `生成失败: ${msg}`,
    privacyTitle: '🔒 关于隐私与免责',
    privacyBody1Html: '您选择的照片将在<strong>浏览器本地</strong>处理，不上传到任何服务器。',
    privacyBody2: '作为用户，您有责任自行核对生成的证件照是否符合相关官方最新要求，本程序作者不对使用结果承担任何责任。',
    privacyBody3: '网站不收集您的照片，也不收集任何分析或追踪数据。',
    privacyDecline: '[不同意，离开]',
    privacyAccept: '同意并继续',
    apiSaved: '✓ 已保存',
    apiCleared: '已清除',
    copiedOk: '✓ 已复制到剪贴板',
    copyFailed: '复制失败，请手动右键另存图片',
    resetValue: label => `已重置${label}`,
    draftCorruptCleared: '检测到旧草稿损坏，已自动清理',
    viewOriginal: '查看原图',
    viewCutout: '查看抠图',
    customPresetName: '自定义',
    confirmRemoveBg: '当前还未执行“AI 抠图”。直接导出可能因背景不纯导致审核失败。\n\n是否先执行抠图？',
    confirmSaveCutout: '抠图已完成。\n\n是否现在保存一张白底 JPG，方便后续分享、上传或备用？',
    confirmSaveChinaCutout: '已替换为白底背景。建议先保存这张白底图，方便后续网上申请护照/签证时上传或备用。',
    cutoutSaveTitle: '抠图已完成',
    cutoutSaveCancel: '取消',
    cutoutSaveConfirm: '保存',
    savedToGallery: '已保存到系统相册/图库',
    sharePrompt: '请在系统面板选择保存到相册/文件',
    downloadTriggered: '已触发下载',
    exportFailed: msg => `导出失败：${msg}`,
    noExportYet: '请先准备一份可下载结果',
    noPhotoYet: '请先上传一张人像照片',
    freeExportLimitReached: limit => `免费导出次数已用完（共 ${limit} 次）。购买后可解锁无限导出。`,
    freeExportsRemaining: remaining => `还可免费导出 ${remaining} 次`,
    freeExportsLastOne: '本次导出后，免费次数已用完',
    purchaseUnlockConfirm: price => `免费导出次数已用完。\n\n是否现在购买${price ? `（${price}）` : ''}以解锁无限导出？`,
    purchaseUnavailable: '当前网页版本不提供应用内购买。',
    purchasePending: '正在打开购买流程...',
    premiumUnlocked: '已解锁无限导出',
    purchaseFailed: msg => `购买失败：${msg}`,
    removeBgFailedRetry: '抠图失败，请检查图片质量或光线条件后重试',
    removeBgMissingModel: 'SelfieSegmentation 未加载，请检查本地 vendor 目录或脚本引入',
    removeBgLocalLoading: '本地 AI 离线抠图中 (MediaPipe)...',
    removeBgTimeout: 'MediaPipe 加载超时，请确认在 http/https 环境并尝试刷新',
    removeBgInvalidMask: 'AI 蒙版生成无效，可能是环境太暗或特征不明显',
    removeBgLocalOk: '本地抠图完成（离线模式）',
    unknownError: '未知错误',
    removeBgLocalFailed: msg => `本地抠图失败：${msg}`,
    chinaConsularJpegOnly: '中国护照/签证上传建议使用 JPEG，已自动切换为 JPG',
    chinaConsularMinPixels: '中国护照/签证照片原图不得小于 354×472 像素，请换更高分辨率照片',
    chinaConsularWhiteBgOnly: '中国护照/签证照片背景已锁定为白底',
    shareUnavailable: '当前设备不支持原文件分享，请到文件中发送',
    savedLocationTitle: '保存位置',
    savedLocationBody: path => `文件通常会保存到这里：\n${path}`,
    savedLocationBrowserBody: filename => `当前是浏览器下载。\n\n请到浏览器默认下载目录查看${filename ? `：\n${filename}` : '，或打开浏览器的下载列表。'}`,
    savedFileLabel: name => `最近导出：${name}`,
    donationTitle: '如果这个工具对你有帮助',
    donationBody: '喜欢这个工具的话，欢迎请我喝杯咖啡 ☕',
    donationAccountLabel: value => `PayPal：${value}`,
    donationLater: '下次再说',
    donationConfirm: '打开 PayPal',
    donationConfirmPaypalMe: '打开 PayPal'
  },
  en: {
    appTitle: 'VisaPics',
    headerSub: 'Private browser-based photo tool',
    metaTitle: 'VisaPics | Create Passport and Visa Photos Privately in Your Browser',
    metaDescription: 'Create passport, visa, and ID photos directly in your browser. Remove backgrounds, choose standard sizes, and export ready-to-use images quickly and privately.',
    heroEyebrow: 'Private browser-based photo tool',
    heroTitle: 'Create passport and visa photos privately in your browser',
    heroSubtitle: 'Choose a document type, upload a portrait, remove the background, and export a ready-to-use photo in minutes — without sending your image to a remote server.',
    heroUploadCta: 'Upload a Photo',
    heroFormatsCta: 'See Supported Formats',
    heroTrustLine: 'Runs locally · Your photo stays on your device',
    feature1Title: 'Private processing',
    feature1Body: 'Your photo is processed in your browser and stays on your device during editing.',
    feature2Title: 'Automatic background removal',
    feature2Body: 'Remove the background quickly and fine-tune the result before export.',
    feature3Title: 'Built-in photo formats',
    feature3Body: 'Choose from common passport, visa, and ID photo sizes for multiple countries.',
    feature4Title: 'Flexible export',
    feature4Body: 'Download a single photo or a print-ready sheet in JPG or PNG.',
    startHereLabel: 'Start here',
    startHereTitle: 'Choose a format and upload your photo',
    startHereBody: 'Pick a preset size for your document, or enter a custom size if needed. Then upload a clear portrait photo to begin.',
    documentTypeLabel: 'Document type',
    documentTypeHint: 'Choose a passport, visa, or ID photo format before you upload.',
    advancedOptionsLabel: 'Advanced options',
    advancedOptionsHint: 'Guides, custom size, background, and adjustments',
    dropSubTitle: 'Drag and drop an image here, or click to choose a file',
    howItWorksLabel: 'How it works',
    howItWorksTitle: 'Create a compliant photo in 4 steps',
    flow1Title: 'Upload a photo',
    flow1Body: 'Choose a clear portrait from your phone or computer.',
    flow2Title: 'Remove the background',
    flow2Body: 'Automatically remove the background and refine the framing if needed.',
    flow3Title: 'Choose size and background',
    flow3Body: 'Select the required format and background color for your document.',
    flow4Title: 'Download your final photo',
    flow4Body: 'Export a digital photo or a print-ready sheet.',
    bestResultsLabel: 'Best results',
    bestResultsTitle: 'Tips for a cleaner photo',
    tip1: 'Use a front-facing portrait',
    tip2: 'Keep lighting even across the face',
    tip3: 'Avoid strong backlight',
    tip4: 'Use a plain background if possible',
    tip5: 'Leave enough space around the head and shoulders',
    emptyMsgHtml: 'Your processed photo will appear here<br>after you upload a portrait',
    exportBoxTitle: 'Download options',
    keepTransparentLabel: 'Keep transparent (PNG)',
    sizeLimitLabel: 'Max file size',
    sizeLimitHint: 'KB (0 = unlimited)',
    sizeGuideHtml: 'Common limits:<br>Consular upload ≤ 120 KB<br>DS-160 ≤ 240 KB<br>Canada IRCC ≤ 4000 KB',
    afterExportTitle: 'After download',
    btnShareExported: '↗ Share downloaded file',
    btnLocateExported: '📁 Show saved file location',
    btnDlSingleJpg: '⬇ Download JPG photo',
    btnDlSinglePng: '⬇ Download PNG photo',
    btnDlPrint: '⬇ Download print sheet',
    btnCopyImg: '📋 Copy image',
    btnExportSingle: 'Download',
    btnExportSheet: 'Download Sheet',
    btnRemoveBgShort: 'Remove BG',
    btnReuploadShort: 'New Photo',
    langButtonShort: 'Lang',
    themeToggleTitle: 'Toggle theme',
    releaseToggleTitle: 'Version info',
    exportKindSingle: 'Single Photo',
    exportKindSheet: 'Print Sheet',
    langMenuTitle: 'Choose Language',
    langMenuClose: 'Close',
    releaseTitle: 'Version Info',
    releaseClose: 'Close',
    exportReportTitle: 'Download Check',
    exportReportCancel: 'Back to Adjust',
    exportReportConfirm: 'Confirm Download',
    exportReportSpec: 'Spec',
    exportReportFormat: 'Format',
    exportReportSize: 'File size',
    exportReportBackground: 'Background',
    exportReportRecommendation: 'Recommendation',
    exportReportReady: '',
    exportReportAutoOptimized: 'Auto-optimized',
    exportReportRecommendedRange: 'Recommended upload range 40-120 KB',
    releaseEmpty: 'No release notes yet.',
    releaseMeta: (version, updatedAt, build) => `Version ${version}${build ? ` (${build})` : ''}${updatedAt ? ` · Updated ${updatedAt}` : ''}`,
    sectAi: 'AI Cutout',
    apiDescHtml: 'A free account can process up to 50 images per month.<br>No key yet? You can skip it and still change the background manually.',
    apiLinkText: '→ Get a free API key',
    apiPlaceholder: 'Paste your API key...',
    apiSaveBtn: 'Save',
    sectSpecs: 'Photo Specs',
    officialSpecLink: '📚 China e-passport official spec reference',
    customSizeLabel: 'Custom size (mm)',
    applyCustomBtn: 'Apply size',
    sectGuides: 'Alignment guides',
    guideToggleLabel: 'Show guides',
    silToggleLabel: 'Show portrait outline (Beta)',
    guideLegend1: 'Keep the top of the head and chin outside the red area',
    guideLegend2: 'Top-of-head guide (3-5 mm from the top edge)',
    guideLegend3: 'Chin guide (7-14 mm from the bottom edge)',
    guideLegend4: 'Face width guide (up to 22 mm)',
    guideLegend5: 'Center line for the nose bridge',
    guideLegend6: 'Portrait outline for head and eye alignment',
    chinaDoubleOvalGuide: 'Dual-oval head target zone',
    guideLegend7: '↑ Guide changes with the selected document',
    sectBg: 'Background color',

    sectClothes: 'Outfit Replace (Beta)',
    stickerNoneTitle: 'None',
    stickerMaleTitle: 'Male outfit',
    stickerFemaleTitle: 'Female outfit',
    stickerYLabel: 'Vertical offset',
    sectAdjust: 'Manual adjustments',
    brightLabel: 'Brightness',
    contrastLabel: 'Contrast',
    saturationLabel: 'Saturation',
    resetAdjustBtn: '↺ Reset image adjustments',
    step1Label: 'Upload',
    step2Label: 'Remove Background',
    step3Label: 'Adjust',
    step4Label: 'Download',
    dropTitle: 'Upload a portrait photo',
    dropHint: 'JPG / PNG · Portrait mode recommended · Solid background · Even front lighting · Avoid backlight',
    dropHintChina: 'JPG / PNG · Portrait mode recommended · Solid background · Even front lighting · Avoid backlight',
    canvasHint: 'Drag to move · Wheel/pinch to zoom · Arrow keys for fine move · Shift+Arrow for coarse move',
    loaderText: 'Processing...',
    btnReuploadFull: '↑ Re-upload',
    btnReset: 'Reset',
    btnToggleOriginal: 'Toggle original',
    btnRemoveBgFull: '✦ AI Cutout',
    btnGenerate: '✓ Prepare Download',
    singlePreviewTitle: 'Photo Preview',
    printBoxTitle: 'Print Sheet Preview',
    perRowLabel: 'Photos per row',
    rowCountLabel: 'Rows',
    cutLineLabel: 'Show cut lines',
    sizePrevLabel: 'Estimated size',
    infoSpec: 'Spec',
    infoSize: 'Size',
    infoPixels: 'Pixels',
    infoDpi: 'Resolution',
    infoFileSize: 'File size',
    infoBg: 'Background',
    infoCutout: 'Cutout',
    infoCutoutYes: '✓ AI cutout',
    infoCutoutNo: 'Original background',
    exportPrefixSingle: 'visa_photo',
    exportPrefixSheet: 'print_sheet',
    loaderGenerating: 'Generating photo...',
    generatedOk: '✓ Photo ready to download',
    generateFailed: msg => `Generate failed: ${msg}`,
    privacyTitle: '🔒 Privacy & Disclaimer',
    privacyBody1Html: 'Your selected photo is processed <strong>locally in the browser</strong> and is not uploaded to any server.',
    privacyBody2: 'You are responsible for verifying that the generated photo meets the latest official requirements. The author is not liable for usage outcomes.',
    privacyBody3: 'The app does not collect your photos and does not collect analytics or tracking data.',
    privacyDecline: '[Decline and leave]',
    privacyAccept: 'Agree and continue',
    apiSaved: '✓ Saved',
    apiCleared: 'Cleared',
    copiedOk: '✓ Copied to clipboard',
    copyFailed: 'Copy failed. Please save the image manually.',
    resetValue: label => `${label} reset`,
    draftCorruptCleared: 'An old draft was corrupted and has been cleared automatically.',
    viewOriginal: 'View original',
    viewCutout: 'View cutout',
    customPresetName: 'Custom',
    confirmRemoveBg: 'AI background removal has not been run yet. Exporting now may fail background checks.\n\nDo you want to remove the background first?',
    confirmSaveCutout: 'Cutout is ready.\n\nDo you want to save a white-background JPG now for sharing, uploading, or backup?',
    confirmSaveChinaCutout: 'The background has been replaced with white and now matches China visa application requirements. Save this white-background photo now?',
    cutoutSaveTitle: 'Cutout Ready',
    cutoutSaveCancel: 'Cancel',
    cutoutSaveConfirm: 'Save',
    savedToGallery: 'Saved to the system gallery',
    sharePrompt: 'Choose Save to Photos/Files in the system sheet',
    downloadTriggered: 'Download started',
    exportFailed: msg => `Export failed: ${msg}`,
    noExportYet: 'Please prepare a download first',
    noPhotoYet: 'Please upload a portrait photo first',
    freeExportLimitReached: limit => `Your free exports are used up (${limit} total). Purchase is required to unlock unlimited exports.`,
    freeExportsRemaining: remaining => `${remaining} free export${remaining === 1 ? '' : 's'} remaining`,
    freeExportsLastOne: 'This export used your last free export',
    purchaseUnlockConfirm: price => `Your free exports are used up.\n\nBuy now${price ? ` (${price})` : ''} to unlock unlimited exports?`,
    purchaseUnavailable: 'In-app purchase is not available in the web version.',
    purchasePending: 'Opening purchase flow...',
    premiumUnlocked: 'Unlimited exports unlocked',
    purchaseFailed: msg => `Purchase failed: ${msg}`,
    removeBgFailedRetry: 'Cutout failed. Please check the photo quality or lighting and try again.',
    removeBgMissingModel: 'SelfieSegmentation is not loaded. Please check the local vendor files or script include.',
    removeBgLocalLoading: 'Running local AI cutout (MediaPipe)...',
    removeBgTimeout: 'MediaPipe loading timed out. Please use http/https and try refreshing.',
    removeBgInvalidMask: 'The AI mask is invalid. The scene may be too dark or facial features are unclear.',
    removeBgLocalOk: 'Local cutout completed (offline mode)',
    unknownError: 'Unknown error',
    removeBgLocalFailed: msg => `Local cutout failed: ${msg}`,
    chinaConsularJpegOnly: 'China passport/visa uploads should use JPEG. Switched to JPG automatically.',
    chinaConsularMinPixels: 'China passport/visa source photo must be at least 354×472 pixels. Please use a higher-resolution image.',
    chinaConsularWhiteBgOnly: 'China passport/visa background is locked to white.',
    shareUnavailable: 'Original-file sharing is not available on this device. Please send it from Files.',
    savedLocationTitle: 'Saved Location',
    savedLocationBody: path => `The file is usually saved here:\n${path}`,
    savedLocationBrowserBody: filename => `This file was downloaded by your browser.\n\nCheck your browser's default Downloads folder${filename ? `:\n${filename}` : ', or open the browser downloads list.'}`,
    savedFileLabel: name => `Last export: ${name}`,
    donationTitle: 'If this tool was helpful',
    donationBody: 'If you like this tool, you can buy me a coffee ☕',
    donationAccountLabel: value => `PayPal: ${value}`,
    donationLater: 'Maybe later',
    donationConfirm: 'Open PayPal',
    donationConfirmPaypalMe: 'Open PayPal'
  },
  'zh-TW': {
    appTitle: '證件照製作',
    headerSub: '本機處理 · 不上傳隱私資料',
    emptyMsgHtml: '上傳並處理照片後<br>預覽會顯示在這裡',
    exportBoxTitle: '匯出',
    keepTransparentLabel: '保持透明 (PNG)',
    sizeLimitLabel: '檔案大小上限',
    sizeLimitHint: 'KB（0=不限）',
    sizeGuideHtml: '常見上限參考：<br>領事網站上傳 ≤ 120 KB<br>美簽 DS-160 ≤ 240 KB<br>加拿大 IRCC ≤ 4000 KB',
    afterExportTitle: '匯出後操作',
    btnShareExported: '↗ 分享生成檔案',
    btnLocateExported: '📁 查看保存位置',
    btnDlSingleJpg: '⬇ 下載單張 JPG',
    btnDlSinglePng: '⬇ 下載單張 PNG',
    btnDlPrint: '⬇ 下載排版圖',
    btnCopyImg: '📋 複製圖片',
    btnExportSingle: '匯出',
    btnExportSheet: '匯出排版',
    btnRemoveBgShort: '去背',
    btnReuploadShort: '換圖',
    langButtonShort: '語言',
    themeToggleTitle: '切換主題',
    releaseToggleTitle: '版本資訊',
    exportKindSingle: '單張照片',
    exportKindSheet: '排版圖（6 吋）',
    langMenuTitle: '選擇語言',
    langMenuClose: '關閉',
    releaseTitle: '版本資訊',
    releaseClose: '關閉',
    exportReportTitle: '匯出確認',
    exportReportCancel: '返回繼續調整',
    exportReportConfirm: '確認保存',
    exportReportSpec: '規格',
    exportReportFormat: '格式',
    exportReportSize: '大小',
    exportReportBackground: '背景',
    exportReportRecommendation: '建議',
    exportReportReady: '',
    exportReportAutoOptimized: '已自動優化',
    exportReportRecommendedRange: '建議上傳範圍 40–120 KB',
    releaseEmpty: '暫無更新記錄',
    releaseMeta: (version, updatedAt, build) => `版本 ${version}${build ? ` (${build})` : ''}${updatedAt ? ` · 更新於 ${updatedAt}` : ''}`,
    sectAi: 'AI 去背',
    apiDescHtml: '免費帳號每月可處理 50 張，無需付費。<br>沒有 Key？可先跳過，之後仍可手動更換背景色。',
    apiLinkText: '→ 免費註冊取得 Key',
    apiPlaceholder: '貼上你的 API Key...',
    apiSaveBtn: '保存',
    sectSpecs: '證件照規格',
    officialSpecLink: '📚 中國海關/電子護照官方規格說明 (參考)',
    customSizeLabel: '自訂尺寸 (mm)',
    applyCustomBtn: '套用自訂尺寸',
    sectGuides: '參考線',
    guideToggleLabel: '顯示參考線',
    silToggleLabel: '顯示對齊剪影 (Beta)',
    guideLegend1: '禁區（頭頂/下巴不可進入紅色區）',
    guideLegend2: '頭頂目標區（距上邊 3–5mm）',
    guideLegend3: '下巴目標區（距底邊 7–14mm）',
    guideLegend4: '臉寬外邊界（最大 22mm）',
    guideLegend5: '垂直中心線（HH 線，對齊鼻樑）',
    guideLegend6: '人像剪影（對齊頭頂與眼睛基準）',
    chinaDoubleOvalGuide: '雙橢圓頭部目標區',
    guideLegend7: '↑ 規格會隨所選證件而變化',
    sectBg: '背景顏色',

    sectClothes: '正裝替換 (Beta)',
    stickerNoneTitle: '無',
    stickerMaleTitle: '男裝',
    stickerFemaleTitle: '女裝',
    stickerYLabel: '垂直位置',
    sectAdjust: '影像調整',
    brightLabel: '亮度',
    contrastLabel: '對比度',
    saturationLabel: '飽和度',
    resetAdjustBtn: '↺ 重設調整',
    step1Label: '上傳照片',
    step2Label: 'AI 去背',
    step3Label: '調整位置',
    step4Label: '生成匯出',
    dropTitle: '點擊或拖曳以上傳照片',
    dropHint: 'JPG / PNG · 建議使用人像模式拍攝 · 純色背景 · 正面光線均勻 · 避開逆光',
    dropHintChina: 'JPG / PNG · 建議使用人像模式拍攝 · 純色背景 · 正面光線均勻 · 避開逆光',
    canvasHint: '拖曳調整 · 滾輪/雙指縮放 · 方向鍵微移 · Shift+方向鍵粗移',
    loaderText: '處理中...',
    btnReuploadFull: '↑ 重新上傳',
    btnReset: '重設',
    btnToggleOriginal: '切換原圖',
    btnRemoveBgFull: '✦ AI 去背',
    btnGenerate: '✓ 生成',
    singlePreviewTitle: '單張預覽',
    printBoxTitle: '列印排版 (6 吋紙)',
    perRowLabel: '每行張數',
    rowCountLabel: '行數',
    cutLineLabel: '顯示裁切線',
    sizePrevLabel: '預計大小',
    infoSpec: '規格',
    infoSize: '尺寸',
    infoPixels: '像素',
    infoDpi: '解析度',
    infoFileSize: '檔案大小',
    infoBg: '背景',
    infoCutout: '去背',
    infoCutoutYes: '✓ AI 去背',
    infoCutoutNo: '原圖背景',
    exportPrefixSingle: '證件照',
    exportPrefixSheet: '排版圖',
    loaderGenerating: '生成證件照中…',
    generatedOk: '✓ 證件照已生成',
    generateFailed: msg => `生成失敗: ${msg}`,
    privacyTitle: '🔒 關於隱私與免責',
    privacyBody1Html: '您選擇的照片將在<strong>瀏覽器本機</strong>處理，不會上傳到任何伺服器。',
    privacyBody2: '作為使用者，您有責任自行核對產生的證件照是否符合最新官方要求，作者不對使用結果承擔責任。',
    privacyBody3: '網站不收集您的照片，也不收集任何分析或追蹤資料。',
    privacyDecline: '[不同意，離開]',
    privacyAccept: '同意並繼續',
    apiSaved: '✓ 已保存',
    apiCleared: '已清除',
    copiedOk: '✓ 已複製到剪貼簿',
    copyFailed: '複製失敗，請手動另存圖片。',
    resetValue: label => `已重設${label}`,
    draftCorruptCleared: '偵測到舊草稿損壞，已自動清理。',
    viewOriginal: '查看原圖',
    viewCutout: '查看去背圖',
    customPresetName: '自訂',
    confirmRemoveBg: '目前尚未執行「AI 去背」。直接匯出可能因背景不純而導致審核失敗。\n\n是否先執行去背？',
    confirmSaveCutout: '去背已完成。\n\n是否現在保存一張白底 JPG，方便後續分享、上傳或備用？',
    confirmSaveChinaCutout: '已替換為白底背景，符合中國護照/簽證申請要求。是否保存這張白底圖？',
    cutoutSaveTitle: '去背已完成',
    cutoutSaveCancel: '取消',
    cutoutSaveConfirm: '保存',
    savedToGallery: '已保存到系統相簿/圖庫',
    sharePrompt: '請在系統面板中選擇保存到相簿/檔案',
    downloadTriggered: '已觸發下載',
    exportFailed: msg => `匯出失敗：${msg}`,
    noExportYet: '請先匯出一張圖片',
    noPhotoYet: '請先上傳照片',
    freeExportLimitReached: limit => `免費匯出次數已用完（共 ${limit} 次）。購買後可解鎖無限匯出。`,
    freeExportsRemaining: remaining => `還可免費匯出 ${remaining} 次`,
    freeExportsLastOne: '本次匯出後，免費次數已用完',
    purchaseUnlockConfirm: price => `免費匯出次數已用完。\n\n是否現在購買${price ? `（${price}）` : ''}以解鎖無限匯出？`,
    purchaseUnavailable: '目前網頁版不提供應用內購買。',
    purchasePending: '正在開啟購買流程...',
    premiumUnlocked: '已解鎖無限匯出',
    purchaseFailed: msg => `購買失敗：${msg}`,
    removeBgFailedRetry: '去背失敗，請檢查照片品質或光線後再試一次。',
    removeBgMissingModel: 'SelfieSegmentation 尚未載入，請檢查本機 vendor 目錄或腳本引入。',
    removeBgLocalLoading: '正在執行本機 AI 離線去背 (MediaPipe)...',
    removeBgTimeout: 'MediaPipe 載入逾時，請確認使用 http/https 環境並嘗試重新整理。',
    removeBgInvalidMask: 'AI 蒙版無效，可能是環境太暗或五官特徵不夠明顯。',
    removeBgLocalOk: '本機去背完成（離線模式）',
    unknownError: '未知錯誤',
    removeBgLocalFailed: msg => `本機去背失敗：${msg}`,
    chinaConsularJpegOnly: '中國護照/簽證上傳建議使用 JPEG，已自動切換為 JPG',
    chinaConsularMinPixels: '中國護照/簽證照片原圖不得小於 354×472 像素，請改用更高解析度照片',
    chinaConsularWhiteBgOnly: '中國護照/簽證照片背景已鎖定為白底',
    shareUnavailable: '目前裝置不支援原始檔分享，請改由檔案管理傳送。',
    savedLocationTitle: '保存位置',
    savedLocationBody: path => `檔案通常保存在：\n${path}`,
    savedLocationBrowserBody: filename => `目前是瀏覽器下載。\n\n請到瀏覽器預設下載資料夾查看${filename ? `：\n${filename}` : '，或開啟瀏覽器下載清單。'}`,
    savedFileLabel: name => `最近匯出：${name}`,
    donationTitle: '如果這個工具對你有幫助',
    donationBody: '喜歡這個工具的話，歡迎請我喝杯咖啡 ☕',
    donationAccountLabel: value => `PayPal：${value}`,
    donationLater: '下次再說',
    donationConfirm: '開啟 PayPal',
    donationConfirmPaypalMe: '開啟 PayPal'
  },
  ja: {
    appTitle: '証明写真メーカー',
    headerSub: '端末内で処理 · 写真はアップロードされません',
    emptyMsgHtml: '写真をアップロードして処理すると<br>ここにプレビューが表示されます',
    exportBoxTitle: '書き出し',
    keepTransparentLabel: '透明を保持 (PNG)',
    sizeLimitLabel: '最大ファイルサイズ',
    sizeLimitHint: 'KB（0 = 無制限）',
    sizeGuideHtml: 'よくある上限：<br>領事サイト ≤ 120 KB<br>米国 DS-160 ≤ 240 KB<br>カナダ IRCC ≤ 4000 KB',
    afterExportTitle: '書き出し後',
    btnShareExported: '↗ 生成ファイルを共有',
    btnLocateExported: '📁 保存場所を見る',
    btnDlSingleJpg: '⬇ JPG を保存',
    btnDlSinglePng: '⬇ PNG を保存',
    btnDlPrint: '⬇ 印刷シートを保存',
    btnCopyImg: '📋 画像をコピー',
    btnExportSingle: '書き出し',
    btnExportSheet: 'シート書き出し',
    btnRemoveBgShort: '切り抜き',
    btnReuploadShort: '再選択',
    langButtonShort: '言語',
    themeToggleTitle: 'テーマ切替',
    releaseToggleTitle: 'バージョン情報',
    exportKindSingle: '単写真',
    exportKindSheet: '印刷シート',
    langMenuTitle: '言語を選択',
    langMenuClose: '閉じる',
    releaseTitle: 'バージョン情報',
    releaseClose: '閉じる',
    exportReportTitle: '書き出し確認',
    exportReportCancel: '戻って調整する',
    exportReportConfirm: '保存する',
    exportReportSpec: '規格',
    exportReportFormat: '形式',
    exportReportSize: 'サイズ',
    exportReportBackground: '背景',
    exportReportRecommendation: '案内',
    exportReportReady: '',
    exportReportAutoOptimized: '自動最適化済み',
    exportReportRecommendedRange: '推奨アップロード範囲 40–120 KB',
    releaseEmpty: '更新履歴はまだありません。',
    releaseMeta: (version, updatedAt, build) => `Version ${version}${build ? ` (${build})` : ''}${updatedAt ? ` · 更新 ${updatedAt}` : ''}`,
    sectAi: 'AI 切り抜き',
    apiDescHtml: '無料アカウントでは毎月 50 枚まで処理できます。<br>Key がなくてもスキップして背景色を手動で変更できます。',
    apiLinkText: '→ 無料で API Key を取得',
    apiPlaceholder: 'API Key を貼り付け...',
    apiSaveBtn: '保存',
    sectSpecs: '写真仕様',
    officialSpecLink: '📚 中国電子パスポート公式仕様（参考）',
    customSizeLabel: 'カスタムサイズ (mm)',
    applyCustomBtn: 'カスタム適用',
    sectGuides: 'ガイド',
    guideToggleLabel: 'ガイドを表示',
    silToggleLabel: 'シルエットを表示 (Beta)',
    guideLegend1: '禁止ゾーン（頭頂/あごが赤色に入らない）',
    guideLegend2: '頭頂の目標ゾーン（上辺から 3–5mm）',
    guideLegend3: 'あごの目標ゾーン（下辺から 7–14mm）',
    guideLegend4: '顔幅の外枠（最大 22mm）',
    guideLegend5: '垂直中心線（HH ライン、鼻筋を合わせる）',
    guideLegend6: '人物シルエット（頭頂と目線基準を合わせる）',
    chinaDoubleOvalGuide: '二重楕円の頭部目標ゾーン',
    guideLegend7: '↑ 選択した証明書に応じて変わります',
    sectBg: '背景色',

    sectClothes: '服装置換 (Beta)',
    stickerNoneTitle: 'なし',
    stickerMaleTitle: '男性服',
    stickerFemaleTitle: '女性服',
    stickerYLabel: '縦位置',
    sectAdjust: '画像調整',
    brightLabel: '明るさ',
    contrastLabel: 'コントラスト',
    saturationLabel: '彩度',
    resetAdjustBtn: '↺ 調整をリセット',
    step1Label: 'アップロード',
    step2Label: '切り抜き',
    step3Label: '位置調整',
    step4Label: '書き出し',
    dropTitle: 'タップまたはドラッグして写真をアップロード',
    dropHint: 'JPG / PNG · ポートレートモード推奨 · 単色背景 · 正面から均一な光 · 逆光を避ける',
    dropHintChina: 'JPG / PNG · ポートレートモード推奨 · 単色背景 · 正面から均一な光 · 逆光を避ける',
    canvasHint: 'ドラッグで移動 · ホイール/ピンチで拡大縮小 · 矢印キーで微調整 · Shift+矢印で大きく移動',
    loaderText: '処理中...',
    btnReuploadFull: '↑ 再アップロード',
    btnReset: 'リセット',
    btnToggleOriginal: '元画像に切替',
    btnRemoveBgFull: '✦ AI 切り抜き',
    btnGenerate: '✓ 生成',
    singlePreviewTitle: '単写真プレビュー',
    printBoxTitle: '印刷レイアウト (6インチ)',
    perRowLabel: '1 行あたり',
    rowCountLabel: '行数',
    cutLineLabel: '裁断線を表示',
    sizePrevLabel: '推定サイズ',
    infoSpec: '仕様',
    infoSize: 'サイズ',
    infoPixels: 'ピクセル',
    infoDpi: '解像度',
    infoFileSize: 'ファイルサイズ',
    infoBg: '背景',
    infoCutout: '切り抜き',
    infoCutoutYes: '✓ AI 切り抜き',
    infoCutoutNo: '元画像背景',
    exportPrefixSingle: 'shomei_photo',
    exportPrefixSheet: 'print_sheet',
    loaderGenerating: '証明写真を生成中…',
    generatedOk: '✓ 証明写真を生成しました',
    generateFailed: msg => `生成失敗: ${msg}`,
    privacyTitle: '🔒 プライバシーと免責事項',
    privacyBody1Html: '選択した写真は<strong>ブラウザ内でローカル処理</strong>され、どのサーバーにもアップロードされません。',
    privacyBody2: '生成された証明写真が最新の公式要件を満たすかどうかはご自身で確認してください。作者は利用結果に責任を負いません。',
    privacyBody3: 'アプリは写真を収集せず、分析データやトラッキングデータも収集しません。',
    privacyDecline: '[同意せず終了]',
    privacyAccept: '同意して続行',
    apiSaved: '✓ 保存済み',
    apiCleared: 'クリアしました',
    copiedOk: '✓ クリップボードにコピーしました',
    copyFailed: 'コピーに失敗しました。画像を手動で保存してください。',
    resetValue: label => `${label} をリセットしました`,
    draftCorruptCleared: '古い下書きが壊れていたため自動で削除しました。',
    viewOriginal: '元画像を見る',
    viewCutout: '切り抜きを見る',
    customPresetName: 'カスタム',
    confirmRemoveBg: 'まだ「AI 背景除去」を実行していません。このまま書き出すと背景審査に落ちる可能性があります。\n\n先に背景を削除しますか？',
    confirmSaveCutout: '背景除去が完了しました。\n\n共有・アップロード・予備用に、白背景 JPG を今保存しますか？',
    confirmSaveChinaCutout: '白背景に置き換えられ、中国ビザ申請要件に合っています。この白背景画像を保存しますか？',
    cutoutSaveTitle: '切り抜き完了',
    cutoutSaveCancel: 'キャンセル',
    cutoutSaveConfirm: '保存',
    savedToGallery: 'システムのギャラリーに保存しました',
    sharePrompt: 'システム共有で写真またはファイルへ保存を選んでください',
    downloadTriggered: 'ダウンロードを開始しました',
    exportFailed: msg => `書き出し失敗: ${msg}`,
    noExportYet: '先に画像を書き出してください',
    noPhotoYet: '先に写真をアップロードしてください',
    freeExportLimitReached: limit => `無料書き出し回数を使い切りました（合計 ${limit} 回）。無制限にするには購入が必要です。`,
    freeExportsRemaining: remaining => `無料書き出しはあと ${remaining} 回です`,
    freeExportsLastOne: '今回で無料書き出しを使い切りました',
    purchaseUnlockConfirm: price => `無料書き出し回数を使い切りました。\n\n${price ? `${price} で` : ''}今すぐ購入して無制限にしますか？`,
    purchaseUnavailable: 'Web 版ではアプリ内課金を利用できません。',
    purchasePending: '購入フローを開いています...',
    premiumUnlocked: '無制限書き出しを解放しました',
    purchaseFailed: msg => `購入に失敗しました: ${msg}`,
    removeBgFailedRetry: '切り抜きに失敗しました。写真の品質や明るさを確認して再試行してください。',
    removeBgMissingModel: 'SelfieSegmentation が読み込まれていません。ローカル vendor ディレクトリまたはスクリプト読み込みを確認してください。',
    removeBgLocalLoading: 'ローカル AI 切り抜きを実行中 (MediaPipe)...',
    removeBgTimeout: 'MediaPipe の読み込みがタイムアウトしました。http/https 環境で再読み込みしてください。',
    removeBgInvalidMask: 'AI マスクが無効です。暗すぎるか、顔の特徴がはっきりしていない可能性があります。',
    removeBgLocalOk: 'ローカル切り抜きが完了しました（オフラインモード）',
    unknownError: '不明なエラー',
    removeBgLocalFailed: msg => `ローカル切り抜きに失敗しました: ${msg}`,
    chinaConsularJpegOnly: '中国パスポート/ビザは JPEG 推奨のため、自動的に JPG へ切り替えました。',
    chinaConsularMinPixels: '中国パスポート/ビザ用の元画像は 354×472 ピクセル以上が必要です。より高解像度の写真を使用してください。',
    chinaConsularWhiteBgOnly: '中国パスポート/ビザの背景は白背景に固定されています。',
    shareUnavailable: 'この端末では元ファイル共有を利用できません。ファイルアプリから送信してください。',
    savedLocationTitle: '保存場所',
    savedLocationBody: path => `通常は次に保存されます:\n${path}`,
    savedLocationBrowserBody: filename => `これはブラウザからダウンロードされました。\n\nブラウザ既定のダウンロード先を確認してください${filename ? `:\n${filename}` : '。またはダウンロード一覧を開いてください。'}`,
    savedFileLabel: name => `最近の書き出し: ${name}`,
    donationTitle: 'このツールが役に立ったら',
    donationBody: '気に入っていただけたら、コーヒーをごちそうしてもらえるとうれしいです ☕',
    donationAccountLabel: value => `PayPal: ${value}`,
    donationLater: 'また今度',
    donationConfirm: 'PayPal を開く',
    donationConfirmPaypalMe: 'PayPal を開く'
  },
  ko: {
    appTitle: '증명사진 만들기',
    headerSub: '기기 내 처리 · 사진은 업로드되지 않습니다',
    emptyMsgHtml: '사진을 업로드하고 처리하면<br>여기에 미리보기가 표시됩니다',
    exportBoxTitle: '내보내기',
    keepTransparentLabel: '투명 유지 (PNG)',
    sizeLimitLabel: '최대 파일 크기',
    sizeLimitHint: 'KB (0 = 제한 없음)',
    sizeGuideHtml: '자주 쓰는 제한:<br>영사 업로드 ≤ 120 KB<br>미국 DS-160 ≤ 240 KB<br>캐나다 IRCC ≤ 4000 KB',
    afterExportTitle: '내보낸 후',
    btnShareExported: '↗ 생성 파일 공유',
    btnLocateExported: '📁 저장 위치 보기',
    btnDlSingleJpg: '⬇ JPG 저장',
    btnDlSinglePng: '⬇ PNG 저장',
    btnDlPrint: '⬇ 인쇄 시트 저장',
    btnCopyImg: '📋 이미지 복사',
    btnExportSingle: '내보내기',
    btnExportSheet: '시트 내보내기',
    btnRemoveBgShort: '누끼',
    btnReuploadShort: '다시 선택',
    langButtonShort: '언어',
    themeToggleTitle: '테마 전환',
    releaseToggleTitle: '버전 정보',
    exportKindSingle: '단일 사진',
    exportKindSheet: '인쇄 시트',
    langMenuTitle: '언어 선택',
    langMenuClose: '닫기',
    releaseTitle: '버전 정보',
    releaseClose: '닫기',
    exportReportTitle: '내보내기 확인',
    exportReportCancel: '돌아가서 계속 조정',
    exportReportConfirm: '저장 확인',
    exportReportSpec: '규격',
    exportReportFormat: '형식',
    exportReportSize: '크기',
    exportReportBackground: '배경',
    exportReportRecommendation: '안내',
    exportReportReady: '',
    exportReportAutoOptimized: '자동 최적화됨',
    exportReportRecommendedRange: '권장 업로드 범위 40–120 KB',
    releaseEmpty: '업데이트 기록이 아직 없습니다.',
    releaseMeta: (version, updatedAt, build) => `버전 ${version}${build ? ` (${build})` : ''}${updatedAt ? ` · 업데이트 ${updatedAt}` : ''}`,
    sectAi: 'AI 누끼',
    apiDescHtml: '무료 계정은 매월 50장까지 처리할 수 있습니다.<br>Key가 없어도 건너뛰고 배경색을 수동으로 바꿀 수 있습니다.',
    apiLinkText: '→ 무료 API Key 받기',
    apiPlaceholder: 'API Key 붙여넣기...',
    apiSaveBtn: '저장',
    sectSpecs: '사진 규격',
    officialSpecLink: '📚 중국 전자여권 공식 규격 참고',
    customSizeLabel: '사용자 크기 (mm)',
    applyCustomBtn: '사용자 크기 적용',
    sectGuides: '가이드',
    guideToggleLabel: '가이드 표시',
    silToggleLabel: '실루엣 표시 (Beta)',
    guideLegend1: '금지 구역 (정수리/턱이 빨간 구역에 들어가면 안 됨)',
    guideLegend2: '정수리 목표 구역 (상단에서 3–5mm)',
    guideLegend3: '턱 목표 구역 (하단에서 7–14mm)',
    guideLegend4: '얼굴 너비 경계 (최대 22mm)',
    guideLegend5: '세로 중심선 (HH선, 코 중심 정렬)',
    guideLegend6: '인물 실루엣 (정수리와 눈 기준 정렬)',
    chinaDoubleOvalGuide: '이중 타원형 머리 목표 구역',
    guideLegend7: '↑ 선택한 문서에 따라 가이드가 바뀝니다',
    sectBg: '배경색',

    sectClothes: '정장 교체 (Beta)',
    stickerNoneTitle: '없음',
    stickerMaleTitle: '남성 정장',
    stickerFemaleTitle: '여성 정장',
    stickerYLabel: '세로 위치',
    sectAdjust: '이미지 조정',
    brightLabel: '밝기',
    contrastLabel: '대비',
    saturationLabel: '채도',
    resetAdjustBtn: '↺ 조정 초기화',
    step1Label: '업로드',
    step2Label: '누끼',
    step3Label: '위치 조정',
    step4Label: '내보내기',
    dropTitle: '탭하거나 드래그해서 사진 업로드',
    dropHint: 'JPG / PNG · 인물 모드 촬영 권장 · 단색 배경 · 정면의 고른 조명 · 역광 피하기',
    dropHintChina: 'JPG / PNG · 인물 모드 촬영 권장 · 단색 배경 · 정면의 고른 조명 · 역광 피하기',
    canvasHint: '드래그로 이동 · 휠/핀치로 확대 · 방향키 미세 이동 · Shift+방향키 큰 이동',
    loaderText: '처리 중...',
    btnReuploadFull: '↑ 다시 업로드',
    btnReset: '초기화',
    btnToggleOriginal: '원본 전환',
    btnRemoveBgFull: '✦ AI 누끼',
    btnGenerate: '✓ 생성',
    singlePreviewTitle: '단일 미리보기',
    printBoxTitle: '인쇄 레이아웃 (6인치)',
    perRowLabel: '한 줄당 장수',
    rowCountLabel: '줄 수',
    cutLineLabel: '재단선 표시',
    sizePrevLabel: '예상 크기',
    infoSpec: '규격',
    infoSize: '크기',
    infoPixels: '픽셀',
    infoDpi: '해상도',
    infoFileSize: '파일 크기',
    infoBg: '배경',
    infoCutout: '누끼',
    infoCutoutYes: '✓ AI 누끼',
    infoCutoutNo: '원본 배경',
    exportPrefixSingle: 'photo_id',
    exportPrefixSheet: 'print_sheet',
    loaderGenerating: '증명사진 생성 중...',
    generatedOk: '✓ 증명사진이 생성되었습니다',
    generateFailed: msg => `생성 실패: ${msg}`,
    privacyTitle: '🔒 개인정보 및 면책',
    privacyBody1Html: '선택한 사진은 <strong>브라우저 내부에서 로컬 처리</strong>되며 어떤 서버에도 업로드되지 않습니다.',
    privacyBody2: '생성된 증명사진이 최신 공식 요구사항을 충족하는지 직접 확인해야 하며, 작성자는 사용 결과에 책임을 지지 않습니다.',
    privacyBody3: '앱은 사진을 수집하지 않으며 분석 또는 추적 데이터도 수집하지 않습니다.',
    privacyDecline: '[동의하지 않고 나가기]',
    privacyAccept: '동의하고 계속',
    apiSaved: '✓ 저장됨',
    apiCleared: '지워졌습니다',
    copiedOk: '✓ 클립보드에 복사했습니다',
    copyFailed: '복사에 실패했습니다. 이미지를 수동으로 저장해 주세요.',
    resetValue: label => `${label} 초기화됨`,
    draftCorruptCleared: '오래된 초안이 손상되어 자동으로 정리했습니다.',
    viewOriginal: '원본 보기',
    viewCutout: '누끼 보기',
    customPresetName: '사용자 설정',
    confirmRemoveBg: '아직 "AI 배경 제거"를 실행하지 않았습니다. 지금 내보내면 배경 검사에 실패할 수 있습니다.\n\n먼저 배경을 제거할까요?',
    confirmSaveCutout: '누끼가 완료되었습니다.\n\n공유, 업로드, 예비용으로 흰 배경 JPG를 지금 저장할까요?',
    confirmSaveChinaCutout: '배경이 흰색으로 바뀌어 중국 비자 신청 요건에 맞습니다. 이 흰 배경 사진을 저장할까요?',
    cutoutSaveTitle: '누끼 완료',
    cutoutSaveCancel: '취소',
    cutoutSaveConfirm: '저장',
    savedToGallery: '시스템 갤러리에 저장했습니다',
    sharePrompt: '시스템 공유 패널에서 사진 또는 파일 저장을 선택하세요',
    downloadTriggered: '다운로드를 시작했습니다',
    exportFailed: msg => `내보내기 실패: ${msg}`,
    noExportYet: '먼저 이미지를 내보내세요',
    noPhotoYet: '먼저 사진을 업로드하세요',
    freeExportLimitReached: limit => `무료 내보내기 횟수를 모두 사용했습니다 (총 ${limit}회). 무제한 내보내기는 구매 후 이용할 수 있습니다.`,
    freeExportsRemaining: remaining => `무료 내보내기 ${remaining}회 남음`,
    freeExportsLastOne: '이번 내보내기로 무료 횟수를 모두 사용했습니다',
    purchaseUnlockConfirm: price => `무료 내보내기 횟수를 모두 사용했습니다.\n\n${price ? `지금 ${price}에 ` : ''}구매하여 무제한 내보내기를 해제할까요?`,
    purchaseUnavailable: '웹 버전에서는 인앱 구매를 사용할 수 없습니다.',
    purchasePending: '구매 흐름을 여는 중...',
    premiumUnlocked: '무제한 내보내기가 해제되었습니다',
    purchaseFailed: msg => `구매 실패: ${msg}`,
    removeBgFailedRetry: '누끼 처리에 실패했습니다. 사진 품질이나 조명을 확인한 뒤 다시 시도해 주세요.',
    removeBgMissingModel: 'SelfieSegmentation 이 로드되지 않았습니다. 로컬 vendor 디렉터리나 스크립트 포함 여부를 확인해 주세요.',
    removeBgLocalLoading: '로컬 AI 누끼 처리 중 (MediaPipe)...',
    removeBgTimeout: 'MediaPipe 로딩 시간이 초과되었습니다. http/https 환경에서 새로고침 후 다시 시도해 주세요.',
    removeBgInvalidMask: 'AI 마스크가 유효하지 않습니다. 환경이 너무 어둡거나 얼굴 특징이 뚜렷하지 않을 수 있습니다.',
    removeBgLocalOk: '로컬 누끼가 완료되었습니다 (오프라인 모드)',
    unknownError: '알 수 없는 오류',
    removeBgLocalFailed: msg => `로컬 누끼 실패: ${msg}`,
    chinaConsularJpegOnly: '중국 여권/비자 업로드는 JPEG 권장이므로 JPG로 자동 전환했습니다.',
    chinaConsularMinPixels: '중국 여권/비자용 원본 사진은 최소 354×472 픽셀이어야 합니다. 더 높은 해상도의 사진을 사용해 주세요.',
    chinaConsularWhiteBgOnly: '중국 여권/비자 사진 배경은 흰색으로 고정됩니다.',
    shareUnavailable: '이 기기에서는 원본 파일 공유를 지원하지 않습니다. 파일 앱에서 전송해 주세요.',
    savedLocationTitle: '저장 위치',
    savedLocationBody: path => `파일은 보통 여기에 저장됩니다:\n${path}`,
    savedLocationBrowserBody: filename => `현재 브라우저 다운로드로 저장되었습니다.\n\n브라우저 기본 다운로드 폴더를 확인하세요${filename ? `:\n${filename}` : ', 또는 브라우저 다운로드 목록을 열어 보세요.'}`,
    savedFileLabel: name => `최근 내보내기: ${name}`,
    donationTitle: '이 도구가 도움이 되었다면',
    donationBody: '이 도구가 마음에 드셨다면 커피 한 잔 후원해 주세요 ☕',
    donationAccountLabel: value => `PayPal: ${value}`,
    donationLater: '다음에',
    donationConfirm: 'PayPal 열기',
    donationConfirmPaypalMe: 'PayPal 열기'
  }
};
let currentLang = localStorage.getItem(KEY_LANG) || 'zh';
function detectPreferredLanguage() {
  const saved = localStorage.getItem(KEY_LANG);
  if (saved && I18N[saved]) return saved;
  const raw = String(navigator.language || navigator.userLanguage || '').toLowerCase();
  if (raw.startsWith('zh-tw') || raw.startsWith('zh-hk') || raw.startsWith('zh-mo')) return 'zh-TW';
  if (raw.startsWith('zh')) return 'zh';
  if (raw.startsWith('ja')) return 'ja';
  if (raw.startsWith('ko')) return 'ko';
  if (raw.startsWith('en')) return 'en';
  return 'zh';
}
currentLang = detectPreferredLanguage();

function t(key, ...args) {
  const table = I18N[currentLang] || I18N.zh;
  const value = table[key] ?? I18N.en?.[key] ?? I18N.zh?.[key] ?? key;
  return typeof value === 'function' ? value(...args) : value;
}

function localizePreset(preset) {
  const table = PRESET_LOCALES[currentLang] || PRESET_LOCALES.zh;
  const fallback = PRESET_LOCALES.zh[preset.id] || [preset.name, preset.note || ''];
  const [name, note] = table[preset.id] || fallback;
  return { name, note };
}

function getLangShortLabel(lang = currentLang) {
  if (lang === 'zh') return '中';
  if (lang === 'en') return 'EN';
  if (lang === 'zh-TW') return '繁';
  if (lang === 'ja') return '日';
  if (lang === 'ko') return '한';
  return '中';
}

function refreshPresetLabels() {
  const presetSelect = document.getElementById('presetSelect');
  if (presetSelect) {
    const currentValue = presetSelect.value;
    presetSelect.innerHTML = PRESETS.map((p, i) => {
      const localized = localizePreset(p);
      return `<option value="${i}">${localized.name} (${p.w}×${p.h}mm${localized.note ? ` · ${localized.note}` : ''})</option>`;
    }).join('');
    presetSelect.value = currentValue || String(Math.max(0, PRESETS.findIndex(p => p.id === S.preset?.id)));
  }
  const mPreset = document.getElementById('mPreset');
  if (mPreset) {
    const currentValue = mPreset.value;
    mPreset.innerHTML = PRESETS.map((p, i) => {
      const localized = localizePreset(p);
      return `<option value="${i}">${localized.name} (${p.w}×${p.h}mm)</option>`;
    }).join('');
    mPreset.value = currentValue || String(Math.max(0, PRESETS.findIndex(p => p.id === S.preset?.id)));
  }
}

function refreshBgLabels() {
  const labels = BG_LABELS[currentLang] || BG_LABELS.zh;
  BG_COLORS.forEach(c => { c.lbl = labels[c.hex] || c.lbl; });
  document.querySelectorAll('.swatch[data-hex]').forEach(sw => {
    sw.title = labels[sw.dataset.hex] || sw.title;
  });
  document.querySelector('.swatch.checker')?.setAttribute('title', labels.transparent || 'Transparent');
  document.querySelector('.swatch.custom-c')?.setAttribute('title', labels.custom || 'Custom');
  const sel = document.getElementById('mBg');
  if (sel?.options?.length) {
    Array.from(sel.options).forEach(option => {
      option.textContent = labels[option.value] || option.textContent;
    });
  }
}

function refreshSizePreviewLabel() {
  const sizePrev = document.getElementById('sizePrev');
  if (!sizePrev) return;
  const match = sizePrev.textContent.match(/(\d+(\.\d+)?)\s*KB/i);
  const suffix = match ? `: ${match[1]} KB` : ': -- KB';
  sizePrev.textContent = `${t('sizePrevLabel')}${suffix}`;
}

function refreshReleaseToggleLabels() {
  const label = `v${releaseState.currentVersion || '1.0'}`;
  const desktop = document.getElementById('releaseTog');
  const mobile = document.getElementById('mReleaseTog');
  if (desktop) desktop.textContent = label;
  if (mobile) mobile.textContent = label;
}

function getReleaseNotesForCurrentLang(entry) {
  const notes = entry?.notes || {};
  return notes[currentLang] || notes.en || notes.zh || [];
}

function renderReleaseNotes() {
  const meta = document.getElementById('releaseMeta');
  const list = document.getElementById('releaseList');
  const empty = document.getElementById('releaseEmpty');
  if (!meta || !list || !empty) return;

  meta.textContent = t(
    'releaseMeta',
    releaseState.currentVersion || '1.0.0',
    releaseState.updatedAt || '',
    releaseState.currentBuild || ''
  );
  const items = Array.isArray(releaseState.releases) ? releaseState.releases : [];
  if (!items.length) {
    list.innerHTML = '';
    empty.textContent = t('releaseEmpty');
    empty.classList.remove('hidden');
    refreshReleaseToggleLabels();
    return;
  }

  empty.classList.add('hidden');
  list.innerHTML = items.map(entry => {
    const notes = getReleaseNotesForCurrentLang(entry);
    const noteHtml = notes.map(item => `<li>${item}</li>`).join('');
    return `
      <div class="release-item">
        <h3>${entry.version || ''}</h3>
        <time>${entry.date || ''}</time>
        <ul>${noteHtml}</ul>
      </div>
    `;
  }).join('');
  refreshReleaseToggleLabels();
}

async function loadReleaseNotes() {
  const configured = String(window.VISAPICS_RELEASES_URL || '').trim();
  const candidates = [
    ...(configured ? [configured] : []),
    'releases.json',
    './releases.json',
    '/releases.json'
  ];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const data = await res.json();
      releaseState.currentVersion = data.currentVersion || RELEASE_FALLBACK.currentVersion;
      releaseState.currentBuild = data.currentBuild || RELEASE_FALLBACK.currentBuild;
      releaseState.updatedAt = data.updatedAt || RELEASE_FALLBACK.updatedAt;
      releaseState.releases = Array.isArray(data.releases) ? data.releases : [];
      renderReleaseNotes();
      return;
    } catch (e) {
      console.warn('loadReleaseNotes failed:', url, e);
    }
  }
  renderReleaseNotes();
}

function applyI18n() {
  document.documentElement.lang = currentLang;
  const textMap = {
    appTitle: 'appTitle',
    headerSub: 'headerSub',
    heroEyebrow: 'heroEyebrow',
    heroTitle: 'heroTitle',
    heroSubtitle: 'heroSubtitle',
    heroUploadCta: 'heroUploadCta',
    heroFormatsCta: 'heroFormatsCta',
    heroTrustLine: 'heroTrustLine',
    feature1Title: 'feature1Title',
    feature1Body: 'feature1Body',
    feature2Title: 'feature2Title',
    feature2Body: 'feature2Body',
    feature3Title: 'feature3Title',
    feature3Body: 'feature3Body',
    feature4Title: 'feature4Title',
    feature4Body: 'feature4Body',
    startHereLabel: 'startHereLabel',
    startHereTitle: 'startHereTitle',
    startHereBody: 'startHereBody',
    documentTypeLabel: 'documentTypeLabel',
    documentTypeHint: 'documentTypeHint',
    advancedOptionsLabel: 'advancedOptionsLabel',
    advancedOptionsHint: 'advancedOptionsHint',
    exportBoxTitle: 'exportBoxTitle',
    keepTransparentLabel: 'keepTransparentLabel',
    sizeLimitLabel: 'sizeLimitLabel',
    sizeLimitHint: 'sizeLimitHint',
    afterExportTitle: 'afterExportTitle',
    afterExportTitleMobile: 'afterExportTitle',
    btnShareExported: 'btnShareExported',
    btnLocateExported: 'btnLocateExported',
    btnShareExportedMobile: 'btnShareExported',
    btnLocateExportedMobile: 'btnLocateExported',
    btnDlPrint: 'btnDlPrint',
    btnCopyImg: 'btnCopyImg',
    sectAi: 'sectAi',
    sectSpecs: 'sectSpecs',
    customSizeLabel: 'customSizeLabel',
    applyCustomBtn: 'applyCustomBtn',
    sectGuides: 'sectGuides',
    guideToggleLabel: 'guideToggleLabel',
    silToggleLabel: 'silToggleLabel',
    guideLegend1: 'guideLegend1',
    guideLegend2: 'guideLegend2',
    guideLegend3: 'guideLegend3',
    guideLegend4: 'guideLegend4',
    guideLegend5: 'guideLegend5',
    guideLegend6: 'guideLegend6',
    guideLegend7: 'guideLegend7',
    sectBg: 'sectBg',
    sectSupport: 'sectSupport',
    donationSettingsTitle: 'donationSettingsTitle',
    donationSettingsHint: 'donationSettingsHint',
    donationSettingsSave: 'donationSettingsSave',
    sectClothes: 'sectClothes',
    stickerYLabel: 'stickerYLabel',
    sectAdjust: 'sectAdjust',
    brightLabel: 'brightLabel',
    contrastLabel: 'contrastLabel',
    saturationLabel: 'saturationLabel',
    resetAdjustBtn: 'resetAdjustBtn',
    mBtnRmBg: 'btnRemoveBgShort',
    btnReupload: 'btnReuploadShort',
    mLangTog: 'langButtonShort',
    exportKindSingle: 'exportKindSingle',
    exportKindSheet: 'exportKindSheet',
    langMenuTitle: 'langMenuTitle',
    langMenuClose: 'langMenuClose',
    releaseTitle: 'releaseTitle',
    releaseClose: 'releaseClose',
    step1Label: 'step1Label',
    step2Label: 'step2Label',
    step3Label: 'step3Label',
    step4Label: 'step4Label',
    dropTitle: 'dropTitle',
    dropSubTitle: 'dropSubTitle',
    dropHint: 'dropHint',
    howItWorksLabel: 'howItWorksLabel',
    howItWorksTitle: 'howItWorksTitle',
    flow1Title: 'flow1Title',
    flow1Body: 'flow1Body',
    flow2Title: 'flow2Title',
    flow2Body: 'flow2Body',
    flow3Title: 'flow3Title',
    flow3Body: 'flow3Body',
    flow4Title: 'flow4Title',
    flow4Body: 'flow4Body',
    bestResultsLabel: 'bestResultsLabel',
    bestResultsTitle: 'bestResultsTitle',
    tip1: 'tip1',
    tip2: 'tip2',
    tip3: 'tip3',
    tip4: 'tip4',
    tip5: 'tip5',
    canvasHint: 'canvasHint',
    ldrTxt: 'loaderText',
    btnReuploadFull: 'btnReuploadFull',
    btnRst: 'btnReset',
    btnToggle: 'btnToggleOriginal',
    btnRmBg: 'btnRemoveBgFull',
    btnGen: 'btnGenerate',
    singlePreviewTitle: 'singlePreviewTitle',
    printBoxTitle: 'printBoxTitle',
    perRowLabel: 'perRowLabel',
    rowCountLabel: 'rowCountLabel',
    cutLineLabel: 'cutLineLabel',
    privacyTitle: 'privacyTitle',
    privacyDecline: 'privacyDecline',
    privacyAccept: 'privacyAccept',
    donationTitle: 'donationTitle',
    donationBody: 'donationBody',
    donationLater: 'donationLater',
    donationConfirm: 'donationConfirm'
  };
  Object.entries(textMap).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key);
  });
  const emptyMsgText = document.getElementById('emptyMsgText');
  if (emptyMsgText) emptyMsgText.innerHTML = t('emptyMsgHtml');
  document.title = t('metaTitle');
  const description = t('metaDescription');
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', description);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', t('metaTitle'));
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute('content', description);
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', t('metaTitle'));
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) twitterDescription.setAttribute('content', description);
  const privacyBody1 = document.getElementById('privacyBody1');
  if (privacyBody1) privacyBody1.innerHTML = t('privacyBody1Html');
  const privacyBody2 = document.getElementById('privacyBody2');
  if (privacyBody2) privacyBody2.textContent = t('privacyBody2');
  const privacyBody3 = document.getElementById('privacyBody3');
  if (privacyBody3) privacyBody3.textContent = t('privacyBody3');
  const donationInput = document.getElementById('donationPaypalInput');
  if (donationInput) donationInput.placeholder = t('donationSettingsPlaceholder');
  const donationAccount = document.getElementById('donationAccount');
  if (donationAccount?.dataset.value) donationAccount.textContent = t('donationAccountLabel', donationAccount.dataset.value);
  const sizeGuide = document.getElementById('sizeGuide');
  if (sizeGuide) sizeGuide.innerHTML = t('sizeGuideHtml');
  const btnDlSingle = document.getElementById('btnDlSingle');
  if (btnDlSingle) btnDlSingle.textContent = document.getElementById('fmtPng')?.checked ? t('btnDlSinglePng') : t('btnDlSingleJpg');
  const themeTog = document.getElementById('themeTog');
  if (themeTog) {
    themeTog.setAttribute('title', t('themeToggleTitle'));
    themeTog.setAttribute('aria-label', t('themeToggleTitle'));
  }
  const releaseTog = document.getElementById('releaseTog');
  if (releaseTog) {
    releaseTog.setAttribute('title', t('releaseToggleTitle'));
    releaseTog.setAttribute('aria-label', t('releaseToggleTitle'));
  }
  const mReleaseTog = document.getElementById('mReleaseTog');
  if (mReleaseTog) {
    mReleaseTog.setAttribute('title', t('releaseToggleTitle'));
    mReleaseTog.setAttribute('aria-label', t('releaseToggleTitle'));
  }
  const exportReportTitle = document.getElementById('exportReportTitle');
  if (exportReportTitle) exportReportTitle.textContent = t('exportReportTitle');
  const exportReportCancel = document.getElementById('exportReportCancel');
  if (exportReportCancel) exportReportCancel.textContent = t('exportReportCancel');
  const exportReportConfirm = document.getElementById('exportReportConfirm');
  if (exportReportConfirm) exportReportConfirm.textContent = t('exportReportConfirm');
  const cutoutSaveTitle = document.getElementById('cutoutSaveTitle');
  if (cutoutSaveTitle) cutoutSaveTitle.textContent = t('cutoutSaveTitle');
  const cutoutSaveBody = document.getElementById('cutoutSaveBody');
  if (cutoutSaveBody) cutoutSaveBody.textContent = t('confirmSaveChinaCutout');
  const cutoutSaveCancel = document.getElementById('cutoutSaveCancel');
  if (cutoutSaveCancel) cutoutSaveCancel.textContent = t('cutoutSaveCancel');
  const cutoutSaveConfirm = document.getElementById('cutoutSaveConfirm');
  if (cutoutSaveConfirm) cutoutSaveConfirm.textContent = t('cutoutSaveConfirm');
  const mBtnRmBg = document.getElementById('mBtnRmBg');
  if (mBtnRmBg) {
    mBtnRmBg.setAttribute('title', t('btnRemoveBgShort'));
    mBtnRmBg.setAttribute('aria-label', t('btnRemoveBgShort'));
  }
  const btnReupload = document.getElementById('btnReupload');
  if (btnReupload) {
    btnReupload.setAttribute('title', t('btnReuploadShort'));
    btnReupload.setAttribute('aria-label', t('btnReuploadShort'));
  }
  const mLangTog = document.getElementById('mLangTog');
  if (mLangTog) {
    mLangTog.setAttribute('title', t('langMenuTitle'));
    mLangTog.setAttribute('aria-label', t('langMenuTitle'));
  }
  const mLangTogText = document.getElementById('mLangTogText');
  if (mLangTogText) {
    mLangTogText.textContent = getLangShortLabel();
  }
  const langTog = document.getElementById('langTog');
  if (langTog) {
    langTog.setAttribute('title', t('langMenuTitle'));
    langTog.setAttribute('aria-label', t('langMenuTitle'));
  }
  refreshPresetLabels();
  hooks.syncPresetUI();
  refreshBgLabels();
  refreshSizePreviewLabel();
  renderReleaseNotes();
  hooks.renderLanguageMenu();
  hooks.refreshExportMainText();
  hooks.refreshAfterExportActions();
}

function setLanguage(lang) {
  if (!I18N[lang]) return;
  currentLang = lang;
  localStorage.setItem(KEY_LANG, currentLang);
  applyI18n();
}


function getCurrentLang() {
  return currentLang;
}

export {
  I18N,
  t,
  setLanguage,
  applyI18n,
  detectPreferredLanguage,
  localizePreset,
  refreshPresetLabels,
  refreshBgLabels,
  refreshSizePreviewLabel,
  refreshReleaseToggleLabels,
  getReleaseNotesForCurrentLang,
  renderReleaseNotes,
  loadReleaseNotes,
  getCurrentLang,
  setI18nHooks
};
