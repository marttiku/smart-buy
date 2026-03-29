import { useEffect } from 'react'
import { Trophy, Users, Package, Info, Bell } from 'lucide-react'
import { useApp } from '../store/appStore'
import type { Notification } from '../data/mockData'

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function NotificationItem({ notif }: { notif: Notification }) {
  const iconConfig = {
    win: { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    demand: { icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    delivery: { icon: Package, color: 'text-green-400', bg: 'bg-green-500/10' },
    info: { icon: Info, color: 'text-gray-400', bg: 'bg-gray-500/10' },
  }
  const cfg = iconConfig[notif.type]
  const Icon = cfg.icon

  return (
    <div className={`flex items-start gap-3 px-4 py-4 border-b border-gray-800/50 transition-colors ${!notif.read ? 'bg-indigo-950/20' : ''}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
        <Icon className={`w-4.5 h-4.5 ${cfg.color}`} style={{ width: '18px', height: '18px' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-semibold ${notif.read ? 'text-gray-300' : 'text-gray-100'}`}>
            {notif.title}
          </p>
          <span className="text-xs text-gray-600 flex-shrink-0 mt-0.5">{timeAgo(notif.createdAt)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{notif.body}</p>
        {notif.credit && (
          <div className="mt-2 inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-0.5">
            <Trophy className="w-3 h-3 text-green-400" />
            <span className="text-xs font-semibold text-green-400">+€{notif.credit.toFixed(2)} credit earned</span>
          </div>
        )}
      </div>
      {!notif.read && (
        <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2" />
      )}
    </div>
  )
}

export default function NotificationsPage() {
  const { notifications, markNotificationsRead, unreadCount } = useApp()

  useEffect(() => {
    const timer = setTimeout(markNotificationsRead, 1500)
    return () => clearTimeout(timer)
  }, [markNotificationsRead])

  return (
    <div>
      {/* Header */}
      <div className="px-5 pt-12 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-indigo-400 mt-0.5">{unreadCount} new</p>
            )}
          </div>
        </div>
      </div>

      {/* Notifications list */}
      <div className="bg-gray-900 border-y border-gray-800">
        {notifications.length === 0 ? (
          <div className="py-16 text-center">
            <Bell className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No notifications yet</p>
            <p className="text-xs text-gray-600 mt-1">We'll tell you when your price improves</p>
          </div>
        ) : (
          notifications.map(notif => (
            <NotificationItem key={notif.id} notif={notif} />
          ))
        )}
      </div>

      {/* Footer note */}
      {notifications.length > 0 && (
        <div className="px-5 pt-4">
          <p className="text-xs text-gray-600 text-center">
            You'll be notified when your order price improves or your delivery arrives.
          </p>
        </div>
      )}
    </div>
  )
}
