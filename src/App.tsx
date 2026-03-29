import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './store/appStore'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/ProductPage'
import OrderLockedPage from './pages/OrderLockedPage'
import WinMomentPage from './pages/WinMomentPage'
import DashboardPage from './pages/DashboardPage'
import NotificationsPage from './pages/NotificationsPage'

function AppShell() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-start justify-center">
      {/* Desktop frame hint */}
      <div className="hidden md:flex fixed inset-0 items-center justify-center pointer-events-none z-0">
        <div className="w-[390px] h-full border-x border-gray-800/50" />
      </div>

      <div className="relative w-full max-w-[390px] min-h-screen bg-gray-950 flex flex-col">
        <main className="flex-1 pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/order/:id" element={<OrderLockedPage />} />
            <Route path="/order/:id/win" element={<WinMomentPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  )
}
