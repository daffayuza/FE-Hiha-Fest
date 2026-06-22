import { useState } from 'react';
import { Search, Ticket, CheckCircle2, Clock, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { formatCurrency, formatDateTime } from '../../data/mockData';
import './OrderLookupPage.css';

export default function OrderLookupPage() {
  const [searchType, setSearchType] = useState<'email' | 'order'>('email');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.lookupOrder(query);
      setResults(data);
      setSearched(true);
    } catch (err) {
      console.error('Search error:', err);
      setError('Gagal mencari pesanan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const statusIcons: Record<string, JSX.Element> = {
    PAID: <CheckCircle2 size={18} />,
    PENDING: <Clock size={18} />,
    EXPIRED: <AlertCircle size={18} />,
    FAILED: <XCircle size={18} />,
  };

  const statusLabels: Record<string, string> = {
    PAID: 'Lunas',
    PENDING: 'Menunggu',
    EXPIRED: 'Kedaluwarsa',
    FAILED: 'Gagal',
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      default: return 'error';
    }
  };

  return (
    <div className="lookup-page">
      <div className="container">
        <div className="lookup-header">
          <div className="lookup-icon-wrapper">
            <Ticket size={36} />
          </div>
          <h1>Cek Status Tiket</h1>
          <p>Masukkan email atau nomor order untuk melihat status tiket Anda</p>
        </div>

        <form className="lookup-form" onSubmit={handleSearch}>
          <div className="lookup-toggle">
            <button
              type="button"
              className={`toggle-btn ${searchType === 'email' ? 'active' : ''}`}
              onClick={() => { setSearchType('email'); setQuery(''); setSearched(false); setResults(null); }}
            >
              Cari dengan Email
            </button>
            <button
              type="button"
              className={`toggle-btn ${searchType === 'order' ? 'active' : ''}`}
              onClick={() => { setSearchType('order'); setQuery(''); setSearched(false); setResults(null); }}
            >
              Cari dengan No. Order
            </button>
          </div>

          <div className="lookup-input-group">
            <input
              type={searchType === 'email' ? 'email' : 'text'}
              className="form-input lookup-input"
              placeholder={searchType === 'email' ? 'Masukkan alamat email...' : 'Masukkan nomor order (ORD-2026-...)'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary lookup-btn" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              Cari
            </button>
          </div>
        </form>

        {error && (
          <div className="error-badge text-center" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
            {error}
          </div>
        )}

        {/* Results */}
        {searched && results !== null && (
          <div className="lookup-results animate-fade-in-up">
            {results.length === 0 ? (
              <div className="lookup-empty">
                <Search size={48} />
                <h3>Tidak ditemukan</h3>
                <p>Tidak ada tiket yang cocok dengan pencarian Anda. Pastikan email atau nomor order sudah benar.</p>
              </div>
            ) : (
              <>
                <h2 className="results-title">Ditemukan {results.length} pesanan</h2>
                <div className="results-list">
                  {results.map(t => (
                    <div key={t.id} className="result-card">
                      <div className="result-header">
                        <span className="result-order">{t.orderNumber}</span>
                        <span className={`badge badge-${getStatusClass(t.status)}`}>
                          {statusIcons[t.status] || <AlertCircle size={18} />}
                          {statusLabels[t.status] || t.status}
                        </span>
                      </div>
                      <div className="result-body">
                        <div className="result-detail">
                          <span className="result-label">Event</span>
                          <span className="result-value">{t.concert?.name || t.concertName}</span>
                        </div>
                        <div className="result-detail">
                          <span className="result-label">Tiket</span>
                          <span className="result-value">{t.ticketCategory?.name || 'Tiket'} × {t.quantity}</span>
                        </div>
                        <div className="result-detail">
                          <span className="result-label">Total</span>
                          <span className="result-value">{formatCurrency(t.totalPrice)}</span>
                        </div>
                        <div className="result-detail">
                          <span className="result-label">Tanggal</span>
                          <span className="result-value">{formatDateTime(t.createdAt)}</span>
                        </div>
                      </div>
                      {t.tickets && t.tickets.length > 0 && (
                        <div className="result-tickets">
                          <h4>Tiket Digital</h4>
                          <div className="ticket-grid">
                            {t.tickets.map((tkt: any) => (
                              <div key={tkt.id} className="digital-ticket">
                                <div className="qr-container">
                                  {/* In a real app, qrCode would be a URL or Base64 QR Image */}
                                  <div className="qr-pattern" style={{ opacity: 0.2 }} />
                                  <div style={{ wordBreak: 'break-all', fontSize: '10px' }}>{tkt.qrCode}</div>
                                </div>
                                <span className="ticket-number">{tkt.ticketNumber}</span>
                                <span className="ticket-cat">{tkt.ticketCategory?.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
