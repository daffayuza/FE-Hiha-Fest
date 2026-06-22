import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Customer Pages
import LandingPage from './pages/customer/LandingPage';
import ConcertDetailPage from './pages/customer/ConcertDetailPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import PaymentPage from './pages/customer/PaymentPage';
import PaymentStatusPage from './pages/customer/PaymentStatusPage';
import OrderLookupPage from './pages/customer/OrderLookupPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventManagementPage from './pages/admin/EventManagementPage';
import EventFormPage from './pages/admin/EventFormPage';
import TransactionManagementPage from './pages/admin/TransactionManagementPage';
import TransactionDetailPage from './pages/admin/TransactionDetailPage';

import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="login" element={<AdminLoginPage />} />
                <Route path="*" element={
                  <ProtectedRoute>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="events" element={<EventManagementPage />} />
                      <Route path="events/new" element={<EventFormPage />} />
                      <Route path="events/:id/edit" element={<EventFormPage />} />
                      <Route path="transactions" element={<TransactionManagementPage />} />
                      <Route path="transactions/:id" element={<TransactionDetailPage />} />
                    </Routes>
                  </ProtectedRoute>
                } />
              </Routes>
            </AdminLayout>
          }
        />

        {/* Customer Routes */}
        <Route
          path="/*"
          element={
            <div className="app-container">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/concert/:id" element={<ConcertDetailPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/payment/status" element={<PaymentStatusPage />} />
                  <Route path="/check-ticket" element={<OrderLookupPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
