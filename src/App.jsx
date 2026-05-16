import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import MedicalInsurance from './pages/services/MedicalInsurance'
import FinancialInsurance from './pages/services/FinancialInsurance'
import Courses from './pages/services/Courses'
import Restaurants from './pages/services/Restaurants'
import Entertainment from './pages/services/Entertainment'
import Services from './pages/Services'

// Dashboard pages
import UserDashboard from './pages/dashboard/UserDashboard'
import UserProfile from './pages/dashboard/UserProfile'
import UserCards from './pages/dashboard/UserCards'
import UserInstallments from './pages/dashboard/UserInstallments'
import UserScans from './pages/dashboard/UserScans'
import DiscountsBrowse from './pages/dashboard/DiscountsBrowse'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import AdminUsers from './pages/dashboard/AdminUsers'
import AdminCompanies from './pages/dashboard/AdminCompanies'
import AdminDiscounts from './pages/dashboard/AdminDiscounts'
import CompanyDashboard from './pages/dashboard/CompanyDashboard'
import CompanyDiscounts from './pages/dashboard/CompanyDiscounts'
import CompanyAnalytics from './pages/dashboard/CompanyAnalytics'
import CompanyProfile from './pages/dashboard/CompanyProfile'

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const location = useLocation()

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/pricing" element={<PageWrapper><Pricing /></PageWrapper>} />
          <Route path="/join" element={<PageWrapper><Signup /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />

          {/* Service routes */}
          <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
          <Route path="/services/medical-insurance" element={<PageWrapper><MedicalInsurance /></PageWrapper>} />
          <Route path="/services/financial-insurance" element={<PageWrapper><FinancialInsurance /></PageWrapper>} />
          <Route path="/services/courses" element={<PageWrapper><Courses /></PageWrapper>} />
          <Route path="/services/restaurants" element={<PageWrapper><Restaurants /></PageWrapper>} />
          <Route path="/services/entertainment" element={<PageWrapper><Entertainment /></PageWrapper>} />

          {/* User Dashboard routes */}
          <Route path="/dashboard/user" element={<ProtectedRoute requiredRole="user"><PageWrapper><UserDashboard /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/user/profile" element={<ProtectedRoute requiredRole="user"><PageWrapper><UserProfile /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/user/cards" element={<ProtectedRoute requiredRole="user"><PageWrapper><UserCards /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/user/installments" element={<ProtectedRoute requiredRole="user"><PageWrapper><UserInstallments /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/user/scans" element={<ProtectedRoute requiredRole="user"><PageWrapper><UserScans /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/discounts" element={<ProtectedRoute><PageWrapper><DiscountsBrowse /></PageWrapper></ProtectedRoute>} />

          {/* Admin Dashboard routes */}
          <Route path="/dashboard/admin" element={<ProtectedRoute requiredRole="admin"><PageWrapper><AdminDashboard /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/admin/users" element={<ProtectedRoute requiredRole="admin"><PageWrapper><AdminUsers /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/admin/companies" element={<ProtectedRoute requiredRole="admin"><PageWrapper><AdminCompanies /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/admin/discounts" element={<ProtectedRoute requiredRole="admin"><PageWrapper><AdminDiscounts /></PageWrapper></ProtectedRoute>} />

          {/* Company Dashboard routes */}
          <Route path="/dashboard/company" element={<ProtectedRoute requiredRole="company"><PageWrapper><CompanyDashboard /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/company/discounts" element={<ProtectedRoute requiredRole="company"><PageWrapper><CompanyDiscounts /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/company/analytics" element={<ProtectedRoute requiredRole="company"><PageWrapper><CompanyAnalytics /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/company/profile" element={<ProtectedRoute requiredRole="company"><PageWrapper><CompanyProfile /></PageWrapper></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

export default App
