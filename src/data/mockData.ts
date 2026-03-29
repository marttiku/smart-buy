export interface Product {
  id: string
  name: string
  brand: string
  category: string
  categoryId: string
  currentPrice: number
  originalPrice: number
  buyerCount: number
  demandPercent: number
  deliveryDays: number
  icon: string
  specs: string[]
}

export type TrackingStatus =
  | 'confirmed'
  | 'processing'
  | 'handed_over'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'

export interface TrackingStep {
  status: TrackingStatus
  label: string
  detail: string
  timestamp: Date | null
  done: boolean
}

export interface Order {
  id: string
  productId: string
  productName: string
  lockedPrice: number
  finalPrice: number | null
  creditEarned: number
  status: 'active' | 'completed' | 'won'
  buyerCount: number
  createdAt: Date
  windowEndsAt: Date
  tracking?: TrackingStep[]
  parcelCode?: string
  estimatedDelivery?: Date
}

export interface Notification {
  id: string
  type: 'win' | 'demand' | 'delivery' | 'info'
  title: string
  body: string
  credit?: number
  read: boolean
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  icon: string
  buyersActive: number
  available: boolean
  featured?: boolean
}

export const categories: Category[] = [
  { id: 'electronics', name: 'Electronics', icon: '📱', buyersActive: 47, available: true, featured: true },
  { id: 'appliances', name: 'Home Appliances', icon: '🏠', buyersActive: 23, available: true },
  { id: 'seasonal', name: 'Seasonal', icon: '🌡️', buyersActive: 0, available: false },
  { id: 'fashion', name: 'Fashion', icon: '👕', buyersActive: 0, available: false },
]

export const products: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro 128GB',
    brand: 'Apple',
    category: 'Electronics',
    categoryId: 'electronics',
    currentPrice: 1199,
    originalPrice: 1299,
    buyerCount: 34,
    demandPercent: 72,
    deliveryDays: 2,
    icon: '📱',
    specs: ['6.1" Super Retina XDR', 'A17 Pro chip', '48MP camera', '128GB storage'],
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24 256GB',
    brand: 'Samsung',
    category: 'Electronics',
    categoryId: 'electronics',
    currentPrice: 849,
    originalPrice: 999,
    buyerCount: 21,
    demandPercent: 55,
    deliveryDays: 2,
    icon: '📱',
    specs: ['6.2" Dynamic AMOLED', 'Snapdragon 8 Gen 3', '50MP camera', '256GB storage'],
  },
  {
    id: 'p3',
    name: 'AirPods Pro 2nd Gen',
    brand: 'Apple',
    category: 'Electronics',
    categoryId: 'electronics',
    currentPrice: 249,
    originalPrice: 279,
    buyerCount: 58,
    demandPercent: 88,
    deliveryDays: 1,
    icon: '🎧',
    specs: ['Active Noise Cancellation', 'Adaptive Audio', 'USB-C charging', '30h battery'],
  },
  {
    id: 'p4',
    name: 'MacBook Air M3 13"',
    brand: 'Apple',
    category: 'Electronics',
    categoryId: 'electronics',
    currentPrice: 1299,
    originalPrice: 1449,
    buyerCount: 15,
    demandPercent: 38,
    deliveryDays: 3,
    icon: '💻',
    specs: ['M3 chip', '8GB RAM', '256GB SSD', '18h battery'],
  },
  {
    id: 'p5',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    category: 'Electronics',
    categoryId: 'electronics',
    currentPrice: 329,
    originalPrice: 379,
    buyerCount: 29,
    demandPercent: 61,
    deliveryDays: 2,
    icon: '🎧',
    specs: ['Industry-leading ANC', '30h battery', 'Hi-Res Audio', 'Multipoint connection'],
  },
  {
    id: 'p6',
    name: 'iPad Pro 11" M4',
    brand: 'Apple',
    category: 'Electronics',
    categoryId: 'electronics',
    currentPrice: 1099,
    originalPrice: 1199,
    buyerCount: 19,
    demandPercent: 44,
    deliveryDays: 2,
    icon: '📱',
    specs: ['11" Ultra Retina XDR', 'M4 chip', 'Apple Pencil Pro', '256GB storage'],
  },
  {
    id: 'p7',
    name: 'Samsung 65" QLED 4K TV',
    brand: 'Samsung',
    category: 'Electronics',
    categoryId: 'electronics',
    currentPrice: 799,
    originalPrice: 999,
    buyerCount: 41,
    demandPercent: 79,
    deliveryDays: 3,
    icon: '📺',
    specs: ['65" QLED panel', '4K 120Hz', 'Tizen OS', 'Dolby Atmos'],
  },
  {
    id: 'p8',
    name: 'PlayStation 5 Slim',
    brand: 'Sony',
    category: 'Electronics',
    categoryId: 'electronics',
    currentPrice: 449,
    originalPrice: 499,
    buyerCount: 67,
    demandPercent: 92,
    deliveryDays: 2,
    icon: '🎮',
    specs: ['AMD Zen 2 CPU', '825GB SSD', '4K gaming', 'DualSense controller'],
  },
  {
    id: 'p9',
    name: 'Dyson V15 Detect',
    brand: 'Dyson',
    category: 'Home Appliances',
    categoryId: 'appliances',
    currentPrice: 599,
    originalPrice: 699,
    buyerCount: 18,
    demandPercent: 48,
    deliveryDays: 2,
    icon: '🌀',
    specs: ['Laser dust detection', '60min battery', 'HEPA filtration', '230 AW suction'],
  },
  {
    id: 'p10',
    name: 'Bosch Series 8 Washing Machine',
    brand: 'Bosch',
    category: 'Home Appliances',
    categoryId: 'appliances',
    currentPrice: 749,
    originalPrice: 899,
    buyerCount: 12,
    demandPercent: 35,
    deliveryDays: 4,
    icon: '🫧',
    specs: ['9kg capacity', 'A+++ energy', 'i-DOS auto dosing', '1400 RPM'],
  },
  {
    id: 'p11',
    name: 'Nespresso Vertuo Next',
    brand: 'Nespresso',
    category: 'Home Appliances',
    categoryId: 'appliances',
    currentPrice: 89,
    originalPrice: 129,
    buyerCount: 33,
    demandPercent: 66,
    deliveryDays: 1,
    icon: '☕',
    specs: ['Centrifusion tech', '5 cup sizes', 'Wi-Fi enabled', '40s heat-up'],
  },
  {
    id: 'p12',
    name: 'Philips Air Fryer XXL',
    brand: 'Philips',
    category: 'Home Appliances',
    categoryId: 'appliances',
    currentPrice: 179,
    originalPrice: 229,
    buyerCount: 25,
    demandPercent: 57,
    deliveryDays: 2,
    icon: '🍳',
    specs: ['7.3L capacity', 'Rapid Air tech', 'Smart sensing', 'Dishwasher safe'],
  },
]

const now = new Date()
const windowEnds = new Date(now.getTime() + 10 * 60 * 60 * 1000) // 10h from now
const pastWindow = new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2h ago

export const initialOrders: Order[] = [
  {
    id: 'o1',
    productId: 'p3',
    productName: 'AirPods Pro 2nd Gen',
    lockedPrice: 249,
    finalPrice: 246.50,
    creditEarned: 2.50,
    status: 'won',
    buyerCount: 58,
    createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    windowEndsAt: pastWindow,
    parcelCode: 'EA382910471EE',
    estimatedDelivery: new Date(now.getTime() + 18 * 60 * 60 * 1000),
    tracking: [
      {
        status: 'confirmed',
        label: 'Order confirmed',
        detail: 'Price locked at €246.50',
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        done: true,
      },
      {
        status: 'processing',
        label: 'Preparing your order',
        detail: 'Supplier is packing your item',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        done: true,
      },
      {
        status: 'handed_over',
        label: 'Handed to Omniva',
        detail: 'Package scanned at Tallinn sorting centre',
        timestamp: new Date(now.getTime() - 60 * 60 * 1000),
        done: true,
      },
      {
        status: 'in_transit',
        label: 'In transit',
        detail: 'On the way to your area',
        timestamp: new Date(now.getTime() - 20 * 60 * 1000),
        done: true,
      },
      {
        status: 'out_for_delivery',
        label: 'Out for delivery',
        detail: 'Expected today by 18:00',
        timestamp: null,
        done: false,
      },
      {
        status: 'delivered',
        label: 'Delivered',
        detail: 'Parcel locker P-234, Viru Keskus',
        timestamp: null,
        done: false,
      },
    ],
  },
]

export const initialNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'win',
    title: 'Price improved!',
    body: 'Your AirPods Pro order — price dropped by €2.50',
    credit: 2.50,
    read: false,
    createdAt: new Date(now.getTime() - 30 * 60 * 1000),
  },
  {
    id: 'n2',
    type: 'demand',
    title: '12 buyers joined your pool',
    body: 'iPhone 15 Pro is gaining demand — price may improve.',
    read: false,
    createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'n3',
    type: 'delivery',
    title: 'Order delivered',
    body: 'Your AirPods Pro have been delivered to parcel locker P-234.',
    read: true,
    createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
  },
]

export { windowEnds }
