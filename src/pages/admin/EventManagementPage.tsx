import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { api } from '../../services/api';
import { formatCurrency, formatDate } from '../../data/mockData';
import { SkeletonPageHeader, SkeletonTable } from '../../components/SkeletonLoader';
import './EventManagementPage.css';

export default function EventManagementPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching admin events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus event "${name}"?`)) {
      try {
        await api.deleteEvent(id);
        setEvents(events.filter(e => e.id !== id));
      } catch (error) {
        alert('Gagal menghapus event');
      }
    }
  };

  const filtered = events.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter.toUpperCase();
    return matchSearch && matchStatus;
  });

  const getTotalSold = (concert: any) =>
    concert.ticketCategories.reduce((sum: number, tc: any) => sum + tc.sold, 0);

  const getTotalQuota = (concert: any) =>
    concert.ticketCategories.reduce((sum: number, tc: any) => sum + tc.quota, 0);

  const getTotalRevenue = (concert: any) =>
    concert.ticketCategories.reduce((sum: number, tc: any) => sum + tc.sold * tc.price, 0);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      PUBLISHED: 'success', DRAFT: 'warning', COMPLETED: 'info',
    };
    const labels: Record<string, string> = {
      PUBLISHED: 'Published', DRAFT: 'Draft', COMPLETED: 'Selesai',
    };
    return <span className={`badge badge-${map[status] || 'info'}`}>{labels[status] || status}</span>;
  };

  if (loading) {
    return (
      <div>
        <SkeletonPageHeader />
        <SkeletonTable rows={6} cols={7} />
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Manajemen Event</h1>
        <p className="admin-page-subtitle">Kelola semua event konser</p>
      </div>

      <div className="table-header">
        <div className="table-filters">
          <div className="search-box" style={{ minWidth: '250px' }}>
            <Search size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Cari event..."
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
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="completed">Selesai</option>
          </select>
        </div>
        <Link to="/admin/events/new" className="btn btn-primary">
          <Plus size={18} />
          Tambah Event
        </Link>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Tanggal</th>
              <th>Kota</th>
              <th>Tiket Terjual</th>
              <th>Revenue</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(concert => (
              <tr key={concert.id}>
                <td>
                  <div className="event-cell">
                    <img src={concert.poster} alt={concert.name} className="event-thumb" />
                    <div>
                      <div className="event-name">{concert.name}</div>
                      <div className="event-venue">{concert.venue}</div>
                    </div>
                  </div>
                </td>
                <td>{formatDate(concert.date)}</td>
                <td>{concert.city}</td>
                <td>
                  <div className="sold-info">
                    <span>{getTotalSold(concert)} / {getTotalQuota(concert)}</span>
                    <div className="mini-progress">
                      <div
                        className="mini-progress-bar"
                        style={{ width: `${(getTotalSold(concert) / (getTotalQuota(concert) || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td>{formatCurrency(getTotalRevenue(concert))}</td>
                <td>{statusBadge(concert.status)}</td>
                <td>
                  <div className="table-actions">
                    <Link to={`/concert/${concert.id}`} className="btn btn-secondary btn-sm" title="Lihat">
                      <Eye size={15} />
                    </Link>
                    <Link to={`/admin/events/${concert.id}/edit`} className="btn btn-secondary btn-sm" title="Edit">
                      <Edit size={15} />
                    </Link>
                    <button 
                      className="btn btn-danger btn-sm" 
                      title="Hapus"
                      onClick={() => handleDelete(concert.id, concert.name)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state" style={{ padding: '3rem' }}>
          <p>Tidak ada event ditemukan</p>
        </div>
      )}
    </div>
  );
}
