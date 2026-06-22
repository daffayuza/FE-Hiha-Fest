import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle, Mail, Search, Home } from 'lucide-react';
import { formatCurrency } from '../../data/mockData';
import './PaymentStatusPage.css';

export default function PaymentStatusPage() {
  const location = useLocation();
  const state = location.state as {
    status: 'success' | 'pending' | 'failed';
    orderNumber: string;
    concertName: string;
    buyerEmail: string;
    totalPrice: number;
  } | null;

  if (!state) {
    return (
      <div className="status-page">
        <div className="container status-center">
          <h2>Tidak ada data pembayaran</h2>
          <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    success: {
      icon: CheckCircle2,
      title: 'Pembayaran Berhasil! 🎉',
      subtitle: 'E-ticket akan segera dikirim ke email Anda',
      color: 'var(--color-success)',
      bgColor: 'rgba(34, 197, 94, 0.1)',
    },
    pending: {
      icon: Clock,
      title: 'Menunggu Pembayaran',
      subtitle: 'Silakan selesaikan pembayaran sesuai instruksi',
      color: 'var(--color-warning)',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    failed: {
      icon: XCircle,
      title: 'Pembayaran Gagal',
      subtitle: 'Terjadi kesalahan dalam proses pembayaran',
      color: 'var(--color-error)',
      bgColor: 'rgba(239, 68, 68, 0.1)',
    },
  };

  const config = statusConfig[state.status];
  const Icon = config.icon;

  return (
    <div className="status-page">
      <div className="container status-center">
        <div className="status-card animate-fade-in-up">
          <div
            className="status-icon-wrapper"
            style={{ backgroundColor: config.bgColor }}
          >
            <Icon size={56} style={{ color: config.color }} />
          </div>

          <h1 className="status-title">{config.title}</h1>
          <p className="status-subtitle">{config.subtitle}</p>

          <div className="status-details">
            <div className="status-row">
              <span>Nomor Order</span>
              <span className="status-order">{state.orderNumber}</span>
            </div>
            <div className="status-row">
              <span>Event</span>
              <span>{state.concertName}</span>
            </div>
            <div className="status-row">
              <span>Total Pembayaran</span>
              <span>{formatCurrency(state.totalPrice)}</span>
            </div>
          </div>

          {state.status === 'success' && (
            <div className="status-email-notice">
              <Mail size={20} />
              <div>
                <strong>E-ticket dikirim ke:</strong>
                <span>{state.buyerEmail}</span>
              </div>
            </div>
          )}

          {state.status === 'pending' && (
            <div className="status-warning-notice">
              <Clock size={20} />
              <div>
                <strong>Segera selesaikan pembayaran</strong>
                <span>Batas waktu pembayaran: 1 jam</span>
              </div>
            </div>
          )}

          <div className="status-actions">
            <Link to="/check-ticket" className="btn btn-secondary">
              <Search size={18} />
              Cek Status Tiket
            </Link>
            <Link to="/" className="btn btn-primary">
              <Home size={18} />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
