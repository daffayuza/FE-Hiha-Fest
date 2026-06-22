import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Minus, Plus, ArrowLeft, Ticket, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { Concert, formatCurrency, formatDate } from '../../data/mockData';
import './ConcertDetailPage.css';

export default function ConcertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [concert, setConcert] = useState<Concert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.getEventById(id);
        setConcert(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Gagal memuat detail konser.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="animate-spin" size={48} />
        <p>Memuat detail konser...</p>
      </div>
    );
  }

  if (error || !concert) {
    return (
      <div className="detail-page">
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
          <AlertCircle size={64} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
          <h2>{error || 'Konser tidak ditemukan'}</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Konser yang Anda cari tidak tersedia.</p>
          <Link to="/" className="btn btn-secondary">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  const selectedTicket = concert.ticketCategories.find(tc => tc.id === selectedCategory);
  const availableQuota = selectedTicket ? selectedTicket.quota - selectedTicket.sold : 0;

  const handleBuy = () => {
    if (!selectedCategory || !selectedTicket) return;
    navigate('/checkout', {
      state: {
        concert: {
          id: concert.id,
          name: concert.name,
          date: concert.date,
          time: concert.time,
          venue: concert.venue,
          city: concert.city,
          poster: concert.poster,
        },
        ticket: {
          categoryId: selectedTicket.id,
          categoryName: selectedTicket.name,
          price: selectedTicket.price,
          quantity,
          totalPrice: selectedTicket.price * quantity,
        },
      },
    });
  };

  return (
    <div className="detail-page">
      {/* Hero Banner */}
      <div className="detail-hero">
        <div className="detail-hero-bg">
          <img src={concert.poster} alt={concert.name} />
          <div className="detail-hero-overlay" />
        </div>
        <div className="container detail-hero-content">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            Kembali
          </Link>
          <div className="detail-hero-info">
            <span className="detail-category">{concert.category}</span>
            <h1 className="detail-title">{concert.name}</h1>
            <div className="detail-meta">
              <span><Calendar size={18} /> {formatDate(concert.date)}</span>
              <span><Clock size={18} /> {concert.time} WIB</span>
              <span><MapPin size={18} /> {concert.venue}, {concert.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container detail-content">
        <div className="detail-grid">
          {/* Left: Description */}
          <div className="detail-description">
            <h2>Tentang Event</h2>
            <p>{concert.description}</p>

            <div className="detail-info-cards">
              <div className="info-card">
                <Calendar size={24} />
                <div>
                  <span className="info-label">Tanggal</span>
                  <span className="info-value">{formatDate(concert.date)}</span>
                </div>
              </div>
              <div className="info-card">
                <Clock size={24} />
                <div>
                  <span className="info-label">Waktu</span>
                  <span className="info-value">{concert.time} WIB</span>
                </div>
              </div>
              <div className="info-card">
                <MapPin size={24} />
                <div>
                  <span className="info-label">Venue</span>
                  <span className="info-value">{concert.venue}, {concert.city}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Ticket Selection */}
          <div className="ticket-panel">
            <h2>Pilih Tiket</h2>
            <div className="ticket-categories">
              {concert.ticketCategories.map(tc => {
                const remaining = tc.quota - tc.sold;
                const soldOut = remaining <= 0;
                return (
                  <button
                    key={tc.id}
                    className={`ticket-option ${selectedCategory === tc.id ? 'selected' : ''} ${soldOut ? 'sold-out' : ''}`}
                    onClick={() => { if (!soldOut) { setSelectedCategory(tc.id); setQuantity(1); } }}
                    disabled={soldOut}
                  >
                    <div className="ticket-option-header">
                      <span className="ticket-name">{tc.name}</span>
                      <span className="ticket-price">{formatCurrency(tc.price)}</span>
                    </div>
                    <div className="ticket-quota">
                      <Users size={14} />
                      {soldOut ? (
                        <span className="sold-out-text">Habis</span>
                      ) : (
                        <span>Sisa {remaining} tiket</span>
                      )}
                    </div>
                    {!soldOut && (
                      <div className="ticket-progress">
                        <div
                          className="ticket-progress-bar"
                          style={{ width: `${(tc.sold / tc.quota) * 100}%` }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedCategory && selectedTicket && (
              <div className="ticket-quantity animate-fade-in">
                <div className="quantity-label">Jumlah Tiket</div>
                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(Math.min(availableQuota, Math.min(5, quantity + 1)))}
                    disabled={quantity >= Math.min(5, availableQuota)}
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <p className="qty-note">Maksimal 5 tiket per transaksi</p>
              </div>
            )}

            {selectedCategory && selectedTicket && (
              <div className="ticket-summary animate-fade-in">
                <div className="summary-row">
                  <span>{selectedTicket.name} x{quantity}</span>
                  <span>{formatCurrency(selectedTicket.price * quantity)}</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span className="total-price">{formatCurrency(selectedTicket.price * quantity)}</span>
                </div>
                <button className="btn btn-primary btn-lg buy-btn" onClick={handleBuy}>
                  <Ticket size={20} />
                  Beli Tiket
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

