import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, ChevronRight, Sparkles, TrendingUp, Ticket, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { Concert, formatCurrency, formatDate } from '../../data/mockData';
import './LandingPage.css';

export default function LandingPage() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        setLoading(true);
        const data = await api.getEvents();
        setConcerts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching concerts:', err);
        setError('Gagal memuat data konser. Pastikan backend sudah berjalan.');
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  const featured = useMemo(() => concerts.find(c => c.featured) || concerts[0], [concerts]);
  const cities = useMemo(() => [...new Set(concerts.map(c => c.city))], [concerts]);
  const categories = useMemo(() => [...new Set(concerts.map(c => c.category))], [concerts]);

  const filteredConcerts = useMemo(() => {
    return concerts.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.venue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCity = !selectedCity || c.city === selectedCity;
      const matchCategory = !selectedCategory || c.category === selectedCategory;
      return matchSearch && matchCity && matchCategory;
    });
  }, [concerts, searchQuery, selectedCity, selectedCategory]);

  const getLowestPrice = (concert: Concert) => {
    if (!concert.ticketCategories || concert.ticketCategories.length === 0) return 0;
    return Math.min(...concert.ticketCategories.map(tc => tc.price));
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="animate-spin" size={48} />
        <p>Memuat konser...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <h3>Yah, ada masalah!</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      {featured && (
        <section className="hero">
          <div className="hero-bg">
            <img src={featured.poster} alt={featured.name} />
            <div className="hero-overlay" />
          </div>
          <div className="container hero-content">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>Featured Event</span>
            </div>
            <h1 className="hero-title">{featured.name}</h1>
            <p className="hero-info">
              <Calendar size={18} />
              {formatDate(featured.date)} · {featured.time} WIB
            </p>
            <p className="hero-info">
              <MapPin size={18} />
              {featured.venue}, {featured.city}
            </p>
            <p className="hero-desc">{featured.description}</p>
            <div className="hero-actions">
              <Link to={`/concert/${featured.id}`} className="btn btn-primary btn-lg">
                <Ticket size={20} />
                Beli Tiket Sekarang
              </Link>
              <span className="hero-price">
                Mulai dari {formatCurrency(getLowestPrice(featured))}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Concert Listing */}
      <section className="concerts-section">
        <div className="container">
          <div className="concerts-header">
            <h2 className="section-title">
              {/* <TrendingUp size={28} /> */}
              Konser Mendatang
            </h2>
          </div>

          {/* Filters */}
          <div className="filters-bar">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Cari konser atau venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="filter-select"
              >
                <option value="">Semua Kota</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="">Semua Kategori</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Concert Grid */}
          <div className="concerts-grid">
            {filteredConcerts.map((concert, index) => (
              <Link
                to={`/concert/${concert.id}`}
                key={concert.id}
                className="concert-card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="concert-poster">
                  <img src={concert.poster} alt={concert.name} />
                  <div className="concert-category-badge">{concert.category}</div>
                </div>
                <div className="concert-info">
                  <h3 className="concert-name">{concert.name}</h3>
                  <p className="concert-date">
                    <Calendar size={14} />
                    {formatDate(concert.date)}
                  </p>
                  <p className="concert-venue">
                    <MapPin size={14} />
                    {concert.venue}, {concert.city}
                  </p>
                  <div className="concert-footer">
                    <span className="concert-price">
                      Mulai {formatCurrency(getLowestPrice(concert))}
                    </span>
                    <span className="concert-cta">
                      Detail <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredConcerts.length === 0 && (
            <div className="empty-state">
              <Search size={48} />
              <h3>Tidak ada konser ditemukan</h3>
              <p>Coba ubah filter atau kata kunci pencarian Anda</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

