import { Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Footer from './components/Footer'

// Public pages
import Home from './pages/Home'
import Conferences from './pages/Conferences'
import ConferenceDetail from './pages/ConferenceDetail'
import PastEvents from './pages/PastEvents'
import Speakers from './pages/Speakers'
import Programme from './pages/Programme'
import Sponsors from './pages/Sponsors'
import Publications from './pages/Publications'
import BoardOfDirectors from './pages/BoardOfDirectors'
import Contact from './pages/Contact'
import CertificateVerify from './pages/CertificateVerify'

// Auth pages
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// Dashboard layout
import DashboardLayout from './pages/dashboard/DashboardLayout'

// Dashboard pages — Phase 2
import Overview from './pages/dashboard/Overview'
import MyConferences from './pages/dashboard/MyConferences'
import MyRegistrations from './pages/dashboard/MyRegistrations'
import MyAbstracts from './pages/dashboard/MyAbstracts'
import AbstractForm from './pages/dashboard/AbstractForm'
import MyReviews from './pages/dashboard/MyReviews'
import ReviewForm from './pages/dashboard/ReviewForm'
import ReviewAbstractPage from './pages/dashboard/ReviewAbstractPage'
import MyInvoices from './pages/dashboard/MyInvoices'
import InvoiceDetail from './pages/dashboard/InvoiceDetail'
import Profile from './pages/dashboard/Profile'
import Notifications from './pages/dashboard/Notifications'
import AdminPanel from './pages/dashboard/AdminPanel'

// Dashboard pages — Phase 3
import MyPayments from './pages/dashboard/MyPayments'
import PaymentUpload from './pages/dashboard/PaymentUpload'
import AdminPayments from './pages/dashboard/AdminPayments'
import MyCertificates from './pages/dashboard/MyCertificates'
import QRCheckin from './pages/dashboard/QRCheckin'
import Analytics from './pages/dashboard/Analytics'
import AdminUsers from './pages/dashboard/AdminUsers'
import AdminAnnouncements from './pages/dashboard/AdminAnnouncements'
import ConferenceRegistrationPage from './pages/dashboard/ConferenceRegistrationPage'

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Standalone auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Public certificate verification — no header/footer */}
        <Route path="/verify/:code" element={<CertificateVerify />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />

          {/* Conferences & Registrations */}
          <Route path="conferences" element={<MyConferences />} />
          <Route path="conferences/:conferenceId/register" element={<ConferenceRegistrationPage />} />
          <Route path="registrations" element={<MyRegistrations />} />

          {/* Abstracts */}
          <Route path="abstracts" element={<MyAbstracts />} />
          <Route path="abstracts/new" element={<AbstractForm />} />
          <Route path="abstracts/:id" element={<AbstractForm />} />

          {/* Reviews */}
          <Route path="reviews" element={<MyReviews />} />
          <Route path="reviews/:id" element={<ReviewForm />} />
          <Route path="reviews/abstract/:abstractId" element={<ReviewAbstractPage />} />

          {/* Invoices */}
          <Route path="invoices" element={<MyInvoices />} />
          <Route path="invoices/:id" element={<InvoiceDetail />} />

          {/* Payments */}
          <Route path="payments" element={<MyPayments />} />
          <Route path="payments/upload/:invoiceId" element={<PaymentUpload />} />

          {/* Certificates */}
          <Route path="certificates" element={<MyCertificates />} />

          {/* Profile & Notifications */}
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />

          {/* Admin-only routes */}
          <Route
            path="admin"
            element={
              <ProtectedRoute requiredRole={['organizer', 'admin']}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/payments"
            element={
              <ProtectedRoute requiredRole={['organizer', 'admin']}>
                <AdminPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/checkin"
            element={
              <ProtectedRoute requiredRole={['organizer', 'admin']}>
                <QRCheckin />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/analytics"
            element={
              <ProtectedRoute requiredRole={['organizer', 'admin']}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <ProtectedRoute requiredRole={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/announcements"
            element={
              <ProtectedRoute requiredRole={['organizer', 'admin']}>
                <AdminAnnouncements />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Public pages with header/footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/conferences" element={<Conferences />} />
          <Route path="/conferences/:slug" element={<ConferenceDetail />} />
          <Route path="/past-events" element={<PastEvents />} />
          <Route path="/speakers" element={<Speakers />} />
          <Route path="/programme" element={<Programme />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/board" element={<BoardOfDirectors />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
