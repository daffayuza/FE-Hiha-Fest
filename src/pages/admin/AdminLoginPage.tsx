import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Music2, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import './AdminLoginPage.css';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await api.adminLogin(form);
      localStorage.setItem('admin_token', response.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <Music2 size={32} />
            <span>ADMIN PANEL</span>
          </div>
          <h1>Selamat Datang</h1>
          <p>Masuk ke dashboard admin untuk mengelola event dan transaksi</p>

          {error && (
            <div className="login-error">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="admin@gmail.com"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(''); }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={16} />
                Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Masukkan password"
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(''); }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg login-submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
