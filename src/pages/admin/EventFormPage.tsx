import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Image, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import './EventFormPage.css';

interface TicketCat {
  id?: string;
  name: string;
  price: string;
  quota: string;
}

export default function EventFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    city: '',
    category: '',
    poster: '',
  });

  const [ticketCategories, setTicketCategories] = useState<TicketCat[]>(
    [{ name: '', price: '', quota: '' }]
  );

  useEffect(() => {
    if (isEdit && id) {
      const fetchEvent = async () => {
        try {
          const event = await api.getEventById(id);
          setForm({
            name: event.name,
            description: event.description,
            date: event.date.split('T')[0],
            time: event.time,
            venue: event.venue,
            city: event.city,
            category: event.category,
            poster: event.poster,
          });
          setTicketCategories(event.ticketCategories.map((tc: any) => ({
            id: tc.id,
            name: tc.name,
            price: String(tc.price),
            quota: String(tc.quota),
          })));
        } catch (error) {
          console.error('Error fetching event detail:', error);
          alert('Gagal memuat data event');
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id, isEdit]);

  const addCategory = () => {
    setTicketCategories([...ticketCategories, { name: '', price: '', quota: '' }]);
  };

  const removeCategory = (index: number) => {
    if (ticketCategories.length <= 1) return;
    setTicketCategories(ticketCategories.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, field: keyof TicketCat, value: string) => {
    const updated = [...ticketCategories];
    updated[index][field] = value;
    setTicketCategories(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      ticketCategories: ticketCategories.map(tc => ({
        id: tc.id,
        name: tc.name,
        price: parseFloat(tc.price),
        quota: parseInt(tc.quota),
      }))
    };

    try {
      if (isEdit && id) {
        await api.updateEvent(id, payload);
        alert('Event berhasil diupdate!');
      } else {
        await api.createEvent(payload);
        alert('Event baru berhasil dibuat!');
      }
      navigate('/admin/events');
    } catch (error: any) {
      console.error('Error saving event:', error);
      alert(error.message || 'Gagal menyimpan event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div>
      <Link to="/admin/events" className="back-link" style={{ marginBottom: 'var(--space-lg)', display: 'inline-flex' }}>
        <ArrowLeft size={20} />
        Kembali ke Daftar Event
      </Link>

      <div className="admin-page-header">
        <h1 className="admin-page-title">{isEdit ? 'Edit Event' : 'Tambah Event Baru'}</h1>
        <p className="admin-page-subtitle">
          {isEdit ? 'Perbarui informasi event' : 'Isi detail event konser baru'}
        </p>
      </div>

      <form className="event-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Informasi Event</h3>

          <div className="form-group">
            <label className="form-label">Nama Event</label>
            <input
              type="text"
              className="form-input"
              placeholder="Masukkan nama event"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi</label>
            <textarea
              className="form-input"
              placeholder="Tulis deskripsi event..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tanggal</label>
              <input
                type="date"
                className="form-input"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Waktu</label>
              <input
                type="time"
                className="form-input"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Venue / Lokasi</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nama venue"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Kota</label>
              <input
                type="text"
                className="form-input"
                placeholder="Kota"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Kategori Genre</label>
              <input
                type="text"
                className="form-input"
                placeholder="Pop, Rock, Jazz, Festival..."
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <Image size={16} />
                URL Poster
              </label>
              <input
                type="url"
                className="form-input"
                placeholder="https://..."
                value={form.poster}
                onChange={(e) => setForm({ ...form, poster: e.target.value })}
              />
            </div>
          </div>

          {form.poster && (
            <div className="poster-preview">
              <img src={form.poster} alt="Preview poster" />
            </div>
          )}
        </div>

        {/* Ticket Categories */}
        <div className="form-section">
          <div className="section-header">
            <h3>Kategori Tiket</h3>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addCategory}>
              <Plus size={16} />
              Tambah Kategori
            </button>
          </div>

          {ticketCategories.map((cat, index) => (
            <div key={index} className="ticket-cat-row">
              <div className="ticket-cat-number">{index + 1}</div>
              <div className="ticket-cat-fields">
                <div className="form-group">
                  <label className="form-label">Nama Kategori</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="VIP, Regular, dll."
                    value={cat.name}
                    onChange={(e) => updateCategory(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Harga (Rp)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="500000"
                    value={cat.price}
                    onChange={(e) => updateCategory(index, 'price', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Kuota</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="1000"
                    value={cat.quota}
                    onChange={(e) => updateCategory(index, 'quota', e.target.value)}
                    required
                  />
                </div>
              </div>
              {ticketCategories.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm remove-cat-btn"
                  onClick={() => removeCategory(index)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="form-actions">
          <Link to="/admin/events" className="btn btn-secondary">Batal</Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Buat Event')}
          </button>
        </div>
      </form>
    </div>
  );
}
