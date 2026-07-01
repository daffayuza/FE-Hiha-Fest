import { useState, useEffect } from 'react';
import { CalendarDays, Ticket, DollarSign, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { api } from '../../services/api';
import { formatCurrency } from '../../data/mockData';
import {
  SkeletonStatCards, SkeletonChart, SkeletonTable, SkeletonPageHeader
} from '../../components/SkeletonLoader';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stats, sales] = await Promise.all([
          api.getDashboardStats(),
          api.getSalesSummary(),
        ]);
        setData(stats);
        setSalesData(sales);
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
      <div>
        <SkeletonPageHeader />
        <SkeletonStatCards />
        <SkeletonChart />
        <div className="dashboard-table card" style={{ marginTop: '1.5rem' }}>
          <SkeletonTable rows={5} cols={5} />
        </div>
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

  // Custom tooltip for dual-axis chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#1a1a2e',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: '0.75rem 1rem',
          color: '#f1f5f9',
          fontSize: '0.85rem',
        }}>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>
          {payload.map((p: any) => (
            <p key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
              {p.name}: {p.dataKey === 'revenue' ? formatCurrency(p.value) : p.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
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

      {/* Sales Chart */}
      <div className="dashboard-chart card">
        <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Grafik Penjualan</h3>
        {salesData.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>
            Belum ada data penjualan
          </p>
        ) : (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={salesData} margin={{ top: 8, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis
                  yAxisId="left"
                  stroke="#a855f7"
                  fontSize={11}
                  tickFormatter={(v) => v.toLocaleString()}
                  label={{ value: 'Tiket', angle: -90, position: 'insideLeft', fill: '#a855f7', fontSize: 11, dx: -4 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#22c55e"
                  fontSize={11}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}jt`}
                  label={{ value: 'Revenue', angle: 90, position: 'insideRight', fill: '#22c55e', fontSize: 11, dx: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                <Bar
                  yAxisId="left"
                  dataKey="tiketTerjual"
                  name="Tiket Terjual"
                  fill="url(#barGradientPurple)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  name="Revenue"
                  fill="url(#barGradientGreen)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
                <defs>
                  <linearGradient id="barGradientPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                  <linearGradient id="barGradientGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
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
