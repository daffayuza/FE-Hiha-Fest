import { useState, useEffect } from 'react';
import { CalendarDays, Ticket, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../services/api';
import { formatCurrency } from '../../data/mockData';
import './AdminDashboard.css';

const salesData = [
  { month: 'Jan', penjualan: 12000000 },
  { month: 'Feb', penjualan: 18500000 },
  { month: 'Mar', penjualan: 22000000 },
  { month: 'Apr', penjualan: 15000000 },
  { month: 'Mei', penjualan: 28000000 },
  { month: 'Jun', penjualan: 35000000 },
];

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.getDashboardStats();
        setData(result);
        setError(null);
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        setError('Gagal memuat data dashboard. Sesi mungkin telah berakhir.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card text-center p-8">
        <p className="text-red-500 mb-4">{error || 'Data tidak tersedia'}</p>
        <button onClick={() => window.location.reload()} className="btn btn-secondary">Coba Lagi</button>
      </div>
    );
  }

  const { stats, recentTransactions } = data;

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      PAID: 'success', PENDING: 'warning', EXPIRED: 'error', FAILED: 'error',
    };
    const labels: Record<string, string> = {
      PAID: 'Lunas', PENDING: 'Menunggu', EXPIRED: 'Kedaluwarsa', FAILED: 'Gagal',
    };
    return <span className={`badge badge-${map[status] || 'info'}`}>{labels[status] || status}</span>;
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Ringkasan penjualan dan aktivitas terbaru</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple"><CalendarDays size={24} /></div>
          <div>
            <div className="stat-label">Event Aktif</div>
            <div className="stat-value">{stats.activeEvents}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Ticket size={24} /></div>
          <div>
            <div className="stat-label">Tiket Terjual</div>
            <div className="stat-value">{stats.totalTicketsSold.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><DollarSign size={24} /></div>
          <div>
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><TrendingUp size={24} /></div>
          <div>
            <div className="stat-label">Transaksi</div>
            <div className="stat-value">{stats.totalTransactions}</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="dashboard-chart card">
        <h3>Grafik Penjualan</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
              <Tooltip
                contentStyle={{
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                }}
                formatter={(value: any) => [formatCurrency(Number(value)), 'Penjualan']}
              />
              <Bar dataKey="penjualan" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="dashboard-table card">
        <h3>Transaksi Terbaru</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Pembeli</th>
                <th>Event</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t: any) => (
                <tr key={t.id}>
                  <td><code>{t.orderNumber}</code></td>
                  <td>{t.buyerName}</td>
                  <td>{t.concert?.name || t.concertName}</td>
                  <td>{formatCurrency(t.totalPrice)}</td>
                  <td>{statusBadge(t.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
