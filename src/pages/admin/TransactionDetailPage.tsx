import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Ticket, Calendar, CreditCard, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { api } from '../../services/api';
import { formatCurrency, formatDateTime } from '../../data/mockData';
import { SkeletonDetailCards, SkeletonPageHeader } from '../../components/SkeletonLoader';
import './TransactionDetailPage.css';

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const result = await api.getTransactionById(id);
        setTransaction(result);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching transaction detail:', err);
        setError('Gagal memuat detail transaksi.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div>
        <SkeletonPageHeader />
        <SkeletonDetailCards rows={4} />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div>
        <Link to="/admin/transactions" className="back-link" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
          <ArrowLeft size={20} />
          Kembali
        </Link>
        <div className="empty-state">
          <AlertCircle size={48} />
          <h3>{error || 'Transaksi tidak ditemukan'}</h3>
        </div>
      </div>
    );
  }

  const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; label: string; bg: string }> = {
    PAID: { icon: CheckCircle2, color: 'var(--color-success)', label: 'Lunas', bg: 'rgba(34, 197, 94, 0.1)' },
    PENDING: { icon: Clock, color: 'var(--color-warning)', label: 'Menunggu Pembayaran', bg: 'rgba(245, 158, 11, 0.1)' },
    EXPIRED: { icon: AlertCircle, color: 'var(--color-error)', label: 'Kedaluwarsa', bg: 'rgba(239, 68, 68, 0.1)' },
    FAILED: { icon: XCircle, color: 'var(--color-error)', label: 'Gagal', bg: 'rgba(239, 68, 68, 0.1)' },
  };

  const config = statusConfig[transaction.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  return (
    <div>
      <Link to="/admin/transactions" className="back-link" style={{ display: 'inline-flex', marginBottom: 'var(--space-lg)' }}>
        <ArrowLeft size={20} />
        Kembali ke Daftar Transaksi
      </Link>

      <div className="admin-page-header">
        <h1 className="admin-page-title">Detail Transaksi</h1>
        <p className="admin-page-subtitle">{transaction.orderNumber}</p>
      </div>

      {/* Status Banner */}
      <div className="trx-status-banner" style={{ backgroundColor: config.bg, borderColor: config.color + '33' }}>
        <StatusIcon size={24} style={{ color: config.color }} />
        <div>
          <strong style={{ color: config.color }}>{config.label}</strong>
          <span>Transaksi dibuat pada {formatDateTime(transaction.createdAt)}</span>
        </div>
      </div>

      <div className="trx-detail-grid">
        {/* Buyer Info */}
        <div className="trx-section">
          <h3>Informasi Pembeli</h3>
          <div className="trx-info-list">
            <div className="trx-info-item">
              <User size={18} />
              <div>
                <span className="trx-info-label">Nama</span>
                <span className="trx-info-value">{transaction.buyerName}</span>
              </div>
            </div>
            <div className="trx-info-item">
              <Mail size={18} />
              <div>
                <span className="trx-info-label">Email</span>
                <span className="trx-info-value">{transaction.buyerEmail}</span>
              </div>
            </div>
            <div className="trx-info-item">
              <Phone size={18} />
              <div>
                <span className="trx-info-label">No. HP</span>
                <span className="trx-info-value">{transaction.buyerPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="trx-section">
          <h3>Detail Pesanan</h3>
          <div className="trx-info-list">
            <div className="trx-info-item">
              <Calendar size={18} />
              <div>
                <span className="trx-info-label">Event</span>
                <span className="trx-info-value">{transaction.concert?.name}</span>
              </div>
            </div>
            <div className="trx-info-item">
              <Ticket size={18} />
              <div>
                <span className="trx-info-label">Tiket</span>
                <span className="trx-info-value">{transaction.ticketCategory?.name} × {transaction.quantity}</span>
              </div>
            </div>
            <div className="trx-info-item">
              <CreditCard size={18} />
              <div>
                <span className="trx-info-label">Total Pembayaran</span>
                <span className="trx-info-value trx-price">{formatCurrency(transaction.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Tickets */}
      {transaction.tickets && transaction.tickets.length > 0 && (
        <div className="trx-section" style={{ marginTop: 'var(--space-xl)' }}>
          <h3>Tiket Digital</h3>
          <div className="trx-tickets-grid">
            {transaction.tickets.map((tkt: any) => (
              <div key={tkt.id} className="trx-ticket-card">
                <div className="trx-qr">
                  {tkt.qrCode && (
                     <div className="qr-pattern" style={{
                      width: 80,
                      height: 80,
                      background: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 10px 10px',
                      borderRadius: 4,
                    }} />
                  )}
                </div>
                <div className="trx-ticket-info">
                  <div>
                    <span className="trx-info-label">Nomor Tiket</span>
                    <span className="trx-ticket-number">{tkt.ticketNumber}</span>
                  </div>
                  <div>
                    <span className="trx-info-label">QR Code</span>
                    <span className="trx-ticket-qr">{tkt.qrCode}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
