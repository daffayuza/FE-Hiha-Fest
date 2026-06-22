import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Search } from 'lucide-react';
import { transactions, concerts, formatCurrency, formatDateTime } from '../../data/mockData';

export default function TransactionManagementPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = transactions.filter(t => {
    const matchStatus = !statusFilter || t.status === statusFilter;
    const matchEvent = !eventFilter || t.concertId === eventFilter;
    const matchSearch = !searchQuery ||
      t.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.buyerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchEvent && matchSearch;
  });

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      paid: 'success', pending: 'warning', expired: 'error', failed: 'error',
    };
    const labels: Record<string, string> = {
      paid: 'Lunas', pending: 'Menunggu', expired: 'Kedaluwarsa', failed: 'Gagal',
    };
    return <span className={`badge badge-${map[status]}`}>{labels[status]}</span>;
  };

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
                <td>{t.concertName}</td>
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
