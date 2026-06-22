import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CreditCard, Wallet, Building2, ArrowLeft, Lock, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../data/mockData';
import './PaymentPage.css';

const paymentMethods = [
  { id: 'va_bca', name: 'BCA Virtual Account', icon: Building2, category: 'Transfer Bank' },
  { id: 'va_bni', name: 'BNI Virtual Account', icon: Building2, category: 'Transfer Bank' },
  { id: 'va_mandiri', name: 'Mandiri Virtual Account', icon: Building2, category: 'Transfer Bank' },
  { id: 'gopay', name: 'GoPay', icon: Wallet, category: 'E-Wallet' },
  { id: 'ovo', name: 'OVO', icon: Wallet, category: 'E-Wallet' },
  { id: 'dana', name: 'DANA', icon: Wallet, category: 'E-Wallet' },
  { id: 'cc', name: 'Kartu Kredit / Debit', icon: CreditCard, category: 'Kartu' },
];

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    concert: { name: string };
    ticket: { categoryName: string; quantity: number; totalPrice: number };
    buyer: { name: string; email: string; phone: string };
    orderNumber: string;
  } | null;

  const [selectedMethod, setSelectedMethod] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!state) {
    return (
      <div className="payment-page">
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
          <h2>Data pembayaran tidak ditemukan</h2>
          <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  const grouped = paymentMethods.reduce<Record<string, typeof paymentMethods>>((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {});

  const handlePay = () => {
    if (!selectedMethod) return;
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% success rate
      navigate('/payment/status', {
        state: {
          status: isSuccess ? 'success' : 'pending',
          orderNumber: state.orderNumber,
          concertName: state.concert.name,
          buyerEmail: state.buyer.email,
          totalPrice: state.ticket.totalPrice,
        },
      });
    }, 2000);
  };

  return (
    <div className="payment-page">
      <div className="container">
        <Link to="/checkout" className="back-link">
          <ArrowLeft size={20} />
          Kembali
        </Link>

        <div className="payment-header">
          <h1>Pembayaran</h1>
          <p>Pilih metode pembayaran untuk menyelesaikan pesanan Anda</p>
        </div>

        <div className="payment-grid">
          {/* Payment Methods */}
          <div className="payment-methods">
            {Object.entries(grouped).map(([category, methods]) => (
              <div key={category} className="method-group">
                <h3 className="method-category">{category}</h3>
                <div className="method-list">
                  {methods.map(method => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        className={`method-option ${selectedMethod === method.id ? 'selected' : ''}`}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        <Icon size={22} />
                        <span>{method.name}</span>
                        <div className={`method-radio ${selectedMethod === method.id ? 'checked' : ''}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Payment Summary */}
          <div className="payment-summary">
            <h2>Ringkasan</h2>
            <div className="payment-details">
              <div className="pay-row">
                <span>Order</span>
                <span className="pay-order">{state.orderNumber}</span>
              </div>
              <div className="pay-row">
                <span>Event</span>
                <span>{state.concert.name}</span>
              </div>
              <div className="pay-row">
                <span>Tiket</span>
                <span>{state.ticket.categoryName} x{state.ticket.quantity}</span>
              </div>
              <div className="pay-row">
                <span>Pembeli</span>
                <span>{state.buyer.name}</span>
              </div>
              <div className="pay-row total">
                <span>Total</span>
                <span className="pay-total">{formatCurrency(state.ticket.totalPrice)}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg pay-btn"
              onClick={handlePay}
              disabled={!selectedMethod || processing}
            >
              {processing ? (
                <>
                  <Loader2 size={20} className="spin" />
                  Memproses Pembayaran...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Bayar {formatCurrency(state.ticket.totalPrice)}
                </>
              )}
            </button>

            <p className="pay-secure">
              <Lock size={14} />
              Transaksi dijamin aman & terenkripsi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
