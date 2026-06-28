import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, ShieldCheck, Ticket, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { formatCurrency, formatDate } from '../../data/mockData';
import './CheckoutPage.css';

// Declare Snap type for TypeScript
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        callbacks: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    concert: { id: string; name: string; date: string; time: string; venue: string; city: string; poster: string };
    ticket: { categoryId: string; categoryName: string; price: number; quantity: number; totalPrice: number };
  } | null;

  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!state) {
    return (
      <div className="checkout-page">
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
          <h2>Data pesanan tidak ditemukan</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Silakan pilih tiket terlebih dahulu dari halaman konser.
          </p>
          <Link to="/" className="btn btn-secondary">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!form.email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Format email tidak valid';
    if (!form.phone.trim()) newErrors.phone = 'Nomor HP wajib diisi';
    else if (!/^08\d{8,12}$/.test(form.phone)) newErrors.phone = 'Nomor HP tidak valid (contoh: 081234567890)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await api.createCheckout({
        concertId: state.concert.id,
        ticketCategoryId: state.ticket.categoryId,
        quantity: state.ticket.quantity,
        buyerName: form.name,
        buyerEmail: form.email,
        buyerPhone: form.phone
      });

      const { snapToken, transaction } = response;

      // Open Midtrans Snap popup
      if (window.snap && snapToken) {
        window.snap.pay(snapToken, {
          onSuccess: (result: any) => {
            console.log('Payment success:', result);
            navigate('/payment/status', {
              state: {
                status: 'success',
                orderNumber: transaction.orderNumber,
                concertName: state.concert.name,
                buyerEmail: form.email,
                totalPrice: state.ticket.totalPrice,
              },
            });
          },
          onPending: (result: any) => {
            console.log('Payment pending:', result);
            navigate('/payment/status', {
              state: {
                status: 'pending',
                orderNumber: transaction.orderNumber,
                concertName: state.concert.name,
                buyerEmail: form.email,
                totalPrice: state.ticket.totalPrice,
              },
            });
          },
          onError: (result: any) => {
            console.error('Payment error:', result);
            navigate('/payment/status', {
              state: {
                status: 'failed',
                orderNumber: transaction.orderNumber,
                concertName: state.concert.name,
                buyerEmail: form.email,
                totalPrice: state.ticket.totalPrice,
              },
            });
          },
          onClose: () => {
            console.log('Snap popup closed without finishing payment');
            setSubmitting(false);
            setSubmitError('Pembayaran belum selesai. Silakan coba lagi atau pilih metode pembayaran lain.');
          },
        });
      } else {
        throw new Error('Midtrans Snap tidak tersedia. Silakan refresh halaman.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setSubmitError(err.message || 'Gagal membuat pesanan. Silakan coba lagi.');
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <Link to={`/concert/${state.concert.id}`} className="back-link">
          <ArrowLeft size={20} />
          Kembali ke Detail Konser
        </Link>

        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Lengkapi data diri Anda untuk melanjutkan pembayaran</p>
        </div>

        <div className="checkout-grid">
          {/* Form */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Data Pembeli</h2>

            {submitError && (
              <div className="error-badge mb-4">
                {submitError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                Nama Lengkap
              </label>
              <input
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Masukkan nama lengkap"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={submitting}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={16} />
                Alamat Email
              </label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="email@contoh.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={submitting}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
              <span className="form-hint">E-ticket akan dikirim ke email ini</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Phone size={16} />
                Nomor Handphone
              </label>
              <input
                type="tel"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="081234567890"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={submitting}
              />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>

            <div className="checkout-secure">
              <ShieldCheck size={18} />
              <span>Data Anda aman dan terenkripsi</span>
            </div>

            <button type="submit" className="btn btn-primary btn-lg checkout-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Memproses...
                </>
              ) : (
                <>
                  <Ticket size={20} />
                  Bayar Sekarang
                </>
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Ringkasan Pesanan</h2>
            <div className="order-event">
              <img src={state.concert.poster} alt={state.concert.name} className="order-poster" />
              <div>
                <h3>{state.concert.name}</h3>
                <p>{formatDate(state.concert.date)} · {state.concert.time} WIB</p>
                <p>{state.concert.venue}, {state.concert.city}</p>
              </div>
            </div>
            <div className="order-details">
              <div className="order-row">
                <span>Kategori Tiket</span>
                <span>{state.ticket.categoryName}</span>
              </div>
              <div className="order-row">
                <span>Harga per Tiket</span>
                <span>{formatCurrency(state.ticket.price)}</span>
              </div>
              <div className="order-row">
                <span>Jumlah</span>
                <span>{state.ticket.quantity}</span>
              </div>
              <div className="order-row total">
                <span>Total Pembayaran</span>
                <span className="order-total-price">{formatCurrency(state.ticket.totalPrice)}</span>
              </div>
            </div>

            <div className="checkout-secure" style={{ marginTop: '1.5rem', justifyContent: 'center' }}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Midtrans_Logo.svg/2560px-Midtrans_Logo.svg.png"
                alt="Powered by Midtrans"
                style={{ height: '24px', opacity: 0.7 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
