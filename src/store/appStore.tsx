import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { initialOrders, initialNotifications, type Order, type Notification, type TrackingStep } from '../data/mockData'

interface AppState {
  orders: Order[]
  notifications: Notification[]
  creditBalance: number
  totalSaved: number
  activeOrderId: string | null
}

interface AppContextType extends AppState {
  placeOrder: (productId: string, productName: string, price: number) => string
  triggerWin: (orderId: string, newPrice: number) => void
  markNotificationsRead: () => void
  unreadCount: number
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [creditBalance, setCreditBalance] = useState(18.40)
  const [totalSaved, setTotalSaved] = useState(23.90)
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null)

  const placeOrder = useCallback((productId: string, productName: string, price: number): string => {
    const id = `o${Date.now()}`
    const now = new Date()
    const windowEndsAt = new Date(now.getTime() + 12 * 60 * 60 * 1000)
    const parcelCode = `EA${Math.floor(300000000 + Math.random() * 99999999)}EE`
    const estimatedDelivery = new Date(now.getTime() + 30 * 60 * 60 * 1000)

    const tracking: TrackingStep[] = [
      {
        status: 'confirmed',
        label: 'Order confirmed',
        detail: `Price locked at €${price}`,
        timestamp: now,
        done: true,
      },
      {
        status: 'processing',
        label: 'Preparing your order',
        detail: 'Supplier is packing your item',
        timestamp: null,
        done: false,
      },
      {
        status: 'handed_over',
        label: 'Handed to Omniva',
        detail: 'Package scanned at sorting centre',
        timestamp: null,
        done: false,
      },
      {
        status: 'in_transit',
        label: 'In transit',
        detail: 'On the way to your area',
        timestamp: null,
        done: false,
      },
      {
        status: 'out_for_delivery',
        label: 'Out for delivery',
        detail: 'Expected by end of next business day',
        timestamp: null,
        done: false,
      },
      {
        status: 'delivered',
        label: 'Delivered',
        detail: 'To your nearest Omniva parcel locker',
        timestamp: null,
        done: false,
      },
    ]

    const newOrder: Order = {
      id,
      productId,
      productName,
      lockedPrice: price,
      finalPrice: null,
      creditEarned: 0,
      status: 'active',
      buyerCount: 1,
      createdAt: now,
      windowEndsAt,
      parcelCode,
      estimatedDelivery,
      tracking,
    }
    setOrders(prev => [newOrder, ...prev])
    setActiveOrderId(id)
    return id
  }, [])

  const triggerWin = useCallback((orderId: string, newPrice: number) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      const credit = parseFloat((o.lockedPrice - newPrice).toFixed(2))
      return { ...o, status: 'won', finalPrice: newPrice, creditEarned: credit }
    }))
    setOrders(prev => {
      const order = prev.find(o => o.id === orderId)
      if (!order) return prev
      const credit = parseFloat((order.lockedPrice - newPrice).toFixed(2))
      setCreditBalance(b => parseFloat((b + credit).toFixed(2)))
      setTotalSaved(s => parseFloat((s + credit).toFixed(2)))
      const newNotif: Notification = {
        id: `n${Date.now()}`,
        type: 'win',
        title: 'Price improved!',
        body: `Your ${order.productName} order — price dropped by €${credit.toFixed(2)}`,
        credit,
        read: false,
        createdAt: new Date(),
      }
      setNotifications(n => [newNotif, ...n])
      return prev
    })
  }, [])

  const markNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <AppContext.Provider value={{
      orders, notifications, creditBalance, totalSaved, activeOrderId,
      placeOrder, triggerWin, markNotificationsRead, unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
