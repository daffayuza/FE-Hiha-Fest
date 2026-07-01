import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Search } from 'lucide-react';
import { api } from '../../services/api';
import { formatCurrency, formatDateTime } from '../../data/mockData';
import { SkeletonPageHeader, SkeletonTable } from '../../components/SkeletonLoader';

export default function TransactionManagementPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const result = await api.getTransactions();
        setData(result);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching transactions:', err);
        setError('Gagal memuat data transaksi.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filtered = data.filter(t => {
    const matchStatus = !statusFilter || t.status === statusFilter.toUpperCase();
    const matchEvent = !eventFilter || t.concertId === eventFilter;
    const matchSearch = !searchQuery ||
      t.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.buyerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchEvent && matchSearch;
  });

  const concerts = Array.from(new Set(data.map(t => JSON.stringify({ id: t.concertId, name: t.concert?.name }))))
    .map(s => JSON.parse(s));

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      PAID: 'success', PENDING: 'warning', EXPIRED: 'error', FAILED: 'error',
    };
    const labels: Record<string, string> = {
      PAID: 'Lunas', PENDING: 'Menunggu', EXPIRED: 'Kedaluwarsa', FAILED: 'Gagal',
    };
    return <span className={`badge badge-${map[status] || 'info'}`}>{labels[status] || status}</span>;
  };

  if (loading) {
    return (
      <div>
        <SkeletonPageHeader />
        <SkeletonTable rows={7} cols={9} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-secondary">Coba Lagi</button>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Manajemen Transaksi</h1>
        <p className="admin-page-subtitle">Pantau semua transaksi pembelian tiket</p>
      </div>

      <div className="table-header">
        <div className="table-filters">
          <div className="search-box" style={{ minWidth: '250px' }}>
            <Search size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Cari pembeli/order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.6rem 0', border: 'none', outline: 'none', background: 'none', color: 'var(--color-text-primary)', flex: 1 }}
            />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="paid">Lunas</option>
            <option value="pending">Menunggu</option>
            <option value="expired">Kedaluwarsa</option>
            <option value="failed">Gagal</option>
          </select>
          <select
            className="filter-select"
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
          >
            <option value="">Semua Event</option>
            {concerts.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Pembeli</th>
              <th>Email</th>
              <th>No. HP</th>
              <th>Event</th>
              <th>Total</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td><code style={{ fontSize: '0.8rem', background: 'var(--color-bg-tertiary)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{t.orderNumber}</code></td>
                <td>{t.buyerName}</td>
                <td>{t.buyerEmail}</td>
                <td>{t.buyerPhone}</td>
                <td>{t.concert?.name}</td>
                <td>{formatCurrency(t.totalPrice)}</td>
                <td>{statusBadge(t.status)}</td>
                <td>{formatDateTime(t.createdAt)}</td>
                <td>
                  <Link to={`/admin/transactions/${t.id}`} className="btn btn-secondary btn-sm">
                    <Eye size={15} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state" style={{ padding: '3rem' }}>
          <p>Tidak ada transaksi ditemukan</p>
        </div>
      )}
    </div>
  );
}
