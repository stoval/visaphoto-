// ═══ DATA: Presets, Guide Specs, Background Colors, Constants ═══

export const PRESETS = [
  { id:'cn_pass',      name:'中国护照/签证',   w:33,   h:48,   dpi:300, defaultBg:'#FFFFFF', note:'白底' },
  { id:'cn_id',        name:'居民身份证',      w:26,   h:32,   dpi:300, defaultBg:'#FFFFFF', note:'白底' },
  { id:'cn_drv',       name:'驾驶证',          w:22,   h:32,   dpi:300, defaultBg:'#FFFFFF', note:'白底' },
  { id:'cn_ssc',       name:'社保卡',          w:26,   h:32,   dpi:300, defaultBg:'#FFFFFF', note:'白底' },
  { id:'cn_teacher',   name:'教师资格证',      w:25,   h:35,   dpi:300, defaultBg:'#FFFFFF', note:'1寸' },
  { id:'std_1inch',    name:'标准1寸',         w:25,   h:35,   dpi:300, defaultBg:'#FFFFFF', note:'通用' },
  { id:'std_2inch',    name:'标准2寸',         w:35,   h:49,   dpi:300, defaultBg:'#FFFFFF', note:'通用' },
  { id:'std_2inch_alt',name:'大2寸',           w:35,   h:53,   dpi:300, defaultBg:'#FFFFFF', note:'通用' },
  { id:'us_pass',      name:'美国护照',        w:50.8, h:50.8, dpi:300, defaultBg:'#FFFFFF', note:'2×2 in' },
  { id:'us_visa',      name:'美国签证',        w:50.8, h:50.8, dpi:300, defaultBg:'#FFFFFF', note:'2×2 in' },
  { id:'ca_pass',      name:'加拿大护照',      w:50,   h:70,   dpi:300, defaultBg:'#FFFFFF', note:'白底' },
  { id:'ca_visa',      name:'加拿大签证',      w:50,   h:70,   dpi:300, defaultBg:'#FFFFFF', note:'白底' },
  { id:'uk_visa',      name:'英国签证',        w:35,   h:45,   dpi:300, defaultBg:'#FFFFFF', note:'白底' },
  { id:'au_visa',      name:'澳大利亚签证',    w:35,   h:45,   dpi:300, defaultBg:'#FFFFFF', note:'白底' },
  { id:'jp_visa',      name:'日本签证',        w:45,   h:45,   dpi:300, defaultBg:'#FFFFFF', note:'白底' },
  { id:'eu_visa',      name:'申根签证',        w:35,   h:45,   dpi:300, defaultBg:'#FFFFFF', note:'白底' },
  { id:'th_visa',      name:'泰国签证（普通签）',  w:35,   h:45,   dpi:300, defaultBg:'#FFFFFF', note:'35×45mm · 白底' },
  { id:'th_visa_4060', name:'泰国签证（落地签）', w:40,   h:60,   dpi:300, defaultBg:'#FFFFFF', note:'40×60mm · 白底' },
  { id:'vn_visa',      name:'越南签证',        w:40,   h:60,   dpi:300, defaultBg:'#FFFFFF', note:'白底' },
];

export const GUIDE_SPECS = {
  cn_pass: { topForbidden:3, topTarget:5, chinMin:7, chinMax:14, chinForbidden:7, faceMin:15, faceMax:22, headMin:28, headMax:33 },
  cn_visa: { topForbidden:3, topTarget:5, chinMin:7, chinMax:14, chinForbidden:7, faceMin:15, faceMax:22, headMin:28, headMax:33 },
  us_pass: { topForbidden:3.2, topTarget:6.4, chinMin:6, chinMax:12, chinForbidden:6, faceMin:19, faceMax:35, headMin:25, headMax:35 },
  us_visa: { topForbidden:3.2, topTarget:6.4, chinMin:6, chinMax:12, chinForbidden:6, faceMin:19, faceMax:35, headMin:25, headMax:35 },
  ca_pass: { topForbidden:4,   topTarget:7,   chinMin:8, chinMax:16, chinForbidden:8, faceMin:18, faceMax:32, headMin:31, headMax:36 },
  ca_visa: { topForbidden:4,   topTarget:7,   chinMin:8, chinMax:16, chinForbidden:8, faceMin:18, faceMax:32, headMin:31, headMax:36 },
  uk_visa: { topForbidden:3,   topTarget:5,   chinMin:7, chinMax:13, chinForbidden:7, faceMin:15, faceMax:24, headMin:29, headMax:34 },
  au_visa: { topForbidden:3,   topTarget:5,   chinMin:7, chinMax:13, chinForbidden:7, faceMin:15, faceMax:24, headMin:32, headMax:36 },
  eu_visa: { topForbidden:3,   topTarget:5,   chinMin:7, chinMax:13, chinForbidden:7, faceMin:15, faceMax:24, headMin:29, headMax:34 },
  jp_visa: { topForbidden:3,   topTarget:5,   chinMin:6, chinMax:12, chinForbidden:6, faceMin:18, faceMax:28, headMin:25, headMax:30 },
  cn_id:   { topForbidden:2,   topTarget:4,   chinMin:5, chinMax:10, chinForbidden:5, faceMin:12, faceMax:18, headMin:20, headMax:26 },
  cn_drv:  { topForbidden:2,   topTarget:4,   chinMin:5, chinMax:10, chinForbidden:5, faceMin:10, faceMax:16, headMin:18, headMax:24 },
};

export const BG_COLORS = [
  { hex:'#FFFFFF', lbl:'白色' },
  { hex:'#4A80C8', lbl:'蓝色' },
  { hex:'#87CEEB', lbl:'浅蓝' },
  { hex:'#E0E0E0', lbl:'浅灰' },
  { hex:'#C83C3A', lbl:'红色' },
];

export const mm2px = (mm, dpi = 300) => Math.round(mm / 25.4 * dpi);

export const BG_OPTIONS = [
  { value: 'white', label: '白底' },
  { value: 'blue',  label: '蓝底' },
  { value: 'red',   label: '红底' }
];

export const RELEASE_FALLBACK = {
  currentVersion: '1.0.0',
  currentBuild: '1',
  updatedAt: '2026-03-30',
  releases: []
};

export const LANG_OPTIONS = [
  { code: 'zh',    label: '简体中文', short: '简中' },
  { code: 'en',    label: 'English',  short: 'EN' },
  { code: 'zh-TW', label: '繁體中文', short: '繁中' },
  { code: 'ja',    label: '日本語',   short: '日本語' },
  { code: 'ko',    label: '한국어',   short: '한국어' }
];

export const PRESET_LOCALES = {
  zh: {
    cn_pass: ['中国护照/签证', '白底'], cn_visa: ['中国护照/签证', '白底'], cn_id: ['居民身份证', '白底'], cn_drv: ['驾驶证', '白底'],
    cn_ssc: ['社保卡', '白底'], cn_teacher: ['教师资格证', '1寸'], std_1inch: ['标准1寸', '通用'], std_2inch: ['标准2寸', '通用'],
    std_2inch_alt: ['大2寸', '通用'], us_pass: ['美国护照', '2×2 in'], us_visa: ['美国签证', '2×2 in'], ca_pass: ['加拿大护照', '白底'],
    ca_visa: ['加拿大签证', '白底'], uk_visa: ['英国签证', '白底'], au_visa: ['澳大利亚签证', '白底'], jp_visa: ['日本签证', '白底'],
    eu_visa: ['申根签证', '白底'], th_visa: ['泰国签证（普通签）', '35×45mm · 白底'], th_visa_4060: ['泰国签证（落地签）', '40×60mm · 白底'], vn_visa: ['越南签证', '白底']
  },
  en: {
    cn_pass: ['China Passport/Visa', 'White'], cn_visa: ['China Passport/Visa', 'White'], cn_id: ['China ID Card', 'White'], cn_drv: ['Driver License', 'White'],
    cn_ssc: ['Social Security Card', 'White'], cn_teacher: ['Teacher Certificate', '1 inch'], std_1inch: ['Standard 1 inch', 'General'], std_2inch: ['Standard 2 inch', 'General'],
    std_2inch_alt: ['Large 2 inch', 'General'], us_pass: ['US Passport', '2×2 in'], us_visa: ['US Visa', '2×2 in'], ca_pass: ['Canada Passport', 'White'],
    ca_visa: ['Canada Visa', 'White'], uk_visa: ['UK Visa', 'White'], au_visa: ['Australia Visa', 'White'], jp_visa: ['Japan Visa', 'White'],
    eu_visa: ['Schengen Visa', 'White'], th_visa: ['Thailand Visa (Standard)', '35×45mm · White'], th_visa_4060: ['Thailand Visa (Visa on Arrival)', '40×60mm · White'], vn_visa: ['Vietnam Visa', 'White']
  },
  'zh-TW': {
    cn_pass: ['中國護照/簽證', '白底'], cn_visa: ['中國護照/簽證', '白底'], cn_id: ['居民身分證', '白底'], cn_drv: ['駕照', '白底'],
    cn_ssc: ['社保卡', '白底'], cn_teacher: ['教師資格證', '1 吋'], std_1inch: ['標準 1 吋', '通用'], std_2inch: ['標準 2 吋', '通用'],
    std_2inch_alt: ['大 2 吋', '通用'], us_pass: ['美國護照', '2×2 in'], us_visa: ['美國簽證', '2×2 in'], ca_pass: ['加拿大護照', '白底'],
    ca_visa: ['加拿大簽證', '白底'], uk_visa: ['英國簽證', '白底'], au_visa: ['澳洲簽證', '白底'], jp_visa: ['日本簽證', '白底'],
    eu_visa: ['申根簽證', '白底'], th_visa: ['泰國簽證（普通簽）', '35×45mm · 白底'], th_visa_4060: ['泰國簽證（落地簽）', '40×60mm · 白底'], vn_visa: ['越南簽證', '白底']
  },
  ja: {
    cn_pass: ['中国パスポート/ビザ', '白背景'], cn_visa: ['中国パスポート/ビザ', '白背景'], cn_id: ['中国身分証', '白背景'], cn_drv: ['運転免許', '白背景'],
    cn_ssc: ['社会保障カード', '白背景'], cn_teacher: ['教師資格証', '1インチ'], std_1inch: ['標準 1インチ', '汎用'], std_2inch: ['標準 2インチ', '汎用'],
    std_2inch_alt: ['大きめ 2インチ', '汎用'], us_pass: ['米国パスポート', '2×2 in'], us_visa: ['米国ビザ', '2×2 in'], ca_pass: ['カナダパスポート', '白背景'],
    ca_visa: ['カナダビザ', '白背景'], uk_visa: ['英国ビザ', '白背景'], au_visa: ['オーストラリアビザ', '白背景'], jp_visa: ['日本ビザ', '白背景'],
    eu_visa: ['シェンゲンビザ', '白背景'], th_visa: ['タイビザ（通常）', '35×45mm · 白背景'], th_visa_4060: ['タイビザ（到着時ビザ）', '40×60mm · 白背景'], vn_visa: ['ベトナムビザ', '白背景']
  },
  ko: {
    cn_pass: ['중국 여권/비자', '흰 배경'], cn_visa: ['중국 여권/비자', '흰 배경'], cn_id: ['중국 신분증', '흰 배경'], cn_drv: ['운전면허증', '흰 배경'],
    cn_ssc: ['사회보장카드', '흰 배경'], cn_teacher: ['교사 자격증', '1인치'], std_1inch: ['표준 1인치', '일반'], std_2inch: ['표준 2인치', '일반'],
    std_2inch_alt: ['큰 2인치', '일반'], us_pass: ['미국 여권', '2×2 in'], us_visa: ['미국 비자', '2×2 in'], ca_pass: ['캐나다 여권', '흰 배경'],
    ca_visa: ['캐나다 비자', '흰 배경'], uk_visa: ['영국 비자', '흰 배경'], au_visa: ['호주 비자', '흰 배경'], jp_visa: ['일본 비자', '흰 배경'],
    eu_visa: ['쉥겐 비자', '흰 배경'], th_visa: ['태국 비자 (일반)', '35×45mm · 흰 배경'], th_visa_4060: ['태국 비자 (도착비자)', '40×60mm · 흰 배경'], vn_visa: ['베트남 비자', '흰 배경']
  }
};

export const BG_LABELS = {
  zh:    { '#FFFFFF': '白色', '#4A80C8': '蓝色', '#87CEEB': '浅蓝', '#E0E0E0': '浅灰', '#C83C3A': '红色', transparent: '透明', custom: '自定义' },
  en:    { '#FFFFFF': 'White', '#4A80C8': 'Blue', '#87CEEB': 'Light Blue', '#E0E0E0': 'Light Gray', '#C83C3A': 'Red', transparent: 'Transparent', custom: 'Custom' },
  'zh-TW': { '#FFFFFF': '白色', '#4A80C8': '藍色', '#87CEEB': '淺藍', '#E0E0E0': '淺灰', '#C83C3A': '紅色', transparent: '透明', custom: '自訂' },
  ja:    { '#FFFFFF': '白', '#4A80C8': '青', '#87CEEB': 'ライトブルー', '#E0E0E0': 'ライトグレー', '#C83C3A': '赤', transparent: '透明', custom: 'カスタム' },
  ko:    { '#FFFFFF': '흰색', '#4A80C8': '파랑', '#87CEEB': '연파랑', '#E0E0E0': '연회색', '#C83C3A': '빨강', transparent: '투명', custom: '사용자 지정' }
};

// Storage keys
export const KEY_AUTO_UNIQUE      = 'vp_auto_unique_name';
export const KEY_BG               = 'vp_bg';
export const KEY_LANG             = 'vp_lang';
export const KEY_FREE_EXPORT_USED = 'vp_free_export_used';
export const KEY_PREMIUM_UNLOCKED = 'vp_premium_unlocked';
export const KEY_DONATION_PAYPAL = 'vp_donation_paypal';
export const KEY_DONATION_LAST_PROMPT = 'vp_donation_last_prompt';
export const FREE_EXPORT_LIMIT    = 1;
export const PREMIUM_UNLOCK_PRODUCT_ID = 'visaphoto_premium_unlock';
