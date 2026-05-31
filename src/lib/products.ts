export type ColorVariant = {
  name: string
  hex: string
  imgSrc: string
}

export type CollectionProduct = {
  id: number
  name: string
  sub: string
  price: string
  originalPrice?: string
  materials: string
  description: string
  sizes: string[]
  bg: string
  ink: string
  accentLine: string
  badge?: string
  sku: string
  colors: ColorVariant[]
  stats: { saved: number; rating: number; reviews: number; countries: number }
  care: string[]
}

export type LookbookCell = {
  label: string
  sub: string
  meta: string
  bg: string          // fallback colour if image fails
  span: string
  bigLabel: string
  imgSrc: string
  tag?: string        // small badge, e.g. "NEW" | "EDITORIAL"
}

// Base Unsplash CDN — all images are free under the Unsplash License
const U = 'https://images.unsplash.com'

export const COLLECTION_PRODUCTS: CollectionProduct[] = [
  {
    id: 1,
    sku: 'VLA-CLS-001',
    name: 'THE CLASSIC',
    sub: 'Timeless silhouettes',
    price: '$320',
    materials: 'Italian suede · Natural rubber sole · Hand-stitched lining',
    description: 'A silhouette that transcends seasons — crafted for the woman who moves with quiet confidence.',
    sizes: ['35', '36', '37', '38', '39', '40'],
    bg: '#FAF7F2',
    ink: '#161616',
    accentLine: '#FFD66B',
    badge: 'BEST SELLER',
    colors: [
      { name: 'Cream Nude',   hex: '#EDE8DF', imgSrc: `${U}/photo-1620989928357-71ff9bbf1f34` },
      { name: 'Shadow Black', hex: '#1E1E1E', imgSrc: `${U}/photo-1646122408163-42332de7b4fa` },
      { name: 'Stone Grey',   hex: '#9E9A94', imgSrc: `${U}/photo-1698995475439-f6fa0734e30e` },
    ],
    stats: { saved: 3842, rating: 4.9, reviews: 1204, countries: 32 },
    care: [
      'Hand wash in cold water only',
      'Air dry naturally, away from direct sunlight',
      'Store in the included dust bag',
      'Treat with suede protector spray every 3 months',
    ],
  },
  {
    id: 2,
    sku: 'VLA-BLD-002',
    name: 'THE BOLD',
    sub: 'Statement pieces',
    price: '$480',
    originalPrice: '$560',
    materials: 'Patent leather · Micro-suede lining · Cork insole',
    description: 'Designed to be noticed. Built to be remembered. One piece, infinite looks.',
    sizes: ['35', '36', '37', '38', '39', '40', '41'],
    bg: '#FFD66B',
    ink: '#161616',
    accentLine: '#FF5B4A',
    badge: 'NEW IN',
    colors: [
      { name: 'Solar Amber', hex: '#E8A020', imgSrc: `${U}/photo-1616258374372-6801d31bdbed` },
      { name: 'Pearl White', hex: '#F0F0EE', imgSrc: `${U}/flagged/photo-1556637640-2c80d3201be8` },
      { name: 'Core Black',  hex: '#1A1A1A', imgSrc: `${U}/photo-1628846804102-65648f9f0812` },
    ],
    stats: { saved: 1267, rating: 4.8, reviews: 389, countries: 28 },
    care: [
      'Wipe with a barely damp cloth, never soak',
      'Apply patent leather conditioner monthly',
      'Store upright, never folded or stacked',
      'Avoid exposure to heat sources',
    ],
  },
  {
    id: 3,
    sku: 'VLA-MIN-003',
    name: 'THE MINIMAL',
    sub: 'Quiet luxury',
    price: '$290',
    materials: 'Vegetable-tanned leather · Memory foam · Recycled outsole',
    description: 'Less is precisely more. Every seam intentional, every millimetre earned.',
    sizes: ['35', '36', '37', '38', '39'],
    bg: '#FFB3C1',
    ink: '#161616',
    accentLine: '#A8DADC',
    badge: 'LIMITED',
    colors: [
      { name: 'Blush White', hex: '#F5E8E4', imgSrc: `${U}/photo-1608231387042-66d1773070a5` },
      { name: 'Cherry Red',  hex: '#C8243C', imgSrc: `${U}/photo-1559745206-ca4056293ddc`  },
      { name: 'Ink Multi',   hex: '#3D4B6E', imgSrc: `${U}/photo-1562613521-6b5293e5b0ea`  },
    ],
    stats: { saved: 2041, rating: 4.9, reviews: 672, countries: 35 },
    care: [
      'Gentle machine wash at 30°C, inside mesh bag',
      'Reshape while damp, air dry naturally',
      'Condition with leather balm every season',
      'Stuff with acid-free paper when storing',
    ],
  },
]

export const LOOKBOOK_CELLS: LookbookCell[] = [
  {
    label: 'SS 2024',
    sub: 'Spring Collection',
    meta: 'SPRING 2024 · 24 PIECES',
    bg: '#1a1a2e',
    span: 'row-span-2',
    bigLabel: '01',
    // White/Blue Nike AF1 High — tall editorial, fills the tall cell nicely
    imgSrc: `${U}/photo-1595950653106-6c9ebd614d3a`,
    tag: 'LOOKBOOK',
  },
  {
    label: 'THE COLLECTION',
    sub: 'Full Lookbook',
    meta: 'ALL SEASONS · 60 PIECES',
    bg: '#0e0e0e',
    span: '',
    bigLabel: '—',
    // Iconic white Nike — dramatic, timeless
    imgSrc: `${U}/photo-1542291026-7eec264c27ff`,
  },
  {
    label: '01',
    sub: 'Editorial Series',
    meta: 'LIMITED · 8 PIECES',
    bg: '#2a2000',
    span: '',
    bigLabel: 'I',
    // Yellow Nike — bold, punchy colour pop
    imgSrc: `${U}/photo-1616258374372-6801d31bdbed`,
    tag: 'EDITORIAL',
  },
  {
    label: 'ESSENTIALS',
    sub: 'Core Wardrobe',
    meta: 'YEAR-ROUND · 18 PIECES',
    bg: '#1a1a1a',
    span: '',
    bigLabel: 'II',
    // White/Orange athletic on white box — product-shot feel
    imgSrc: `${U}/photo-1560769629-975ec94e6a86`,
  },
  {
    label: 'NEW IN',
    sub: 'Latest Arrivals',
    meta: 'WEEKLY DROP · 6 PIECES',
    bg: '#2a0a0a',
    span: '',
    bigLabel: 'III',
    // White/Red Nike — sharp contrast, energetic
    imgSrc: `${U}/photo-1600185365483-26d7a4cc7519`,
    tag: 'NEW',
  },
]
