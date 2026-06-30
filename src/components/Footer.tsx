import { Music2 } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <Music2 size={24} />
            <span>Hiha Fest</span>
          </div>
          <p className="footer-desc">
            Platform penjualan tiket konser terpercaya di Indonesia. Temukan event musik favoritmu dan dapatkan tiketnya dengan mudah.
          </p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Navigasi</h4>
            <a href="/">Daftar Konser</a>
            <a href="/check-ticket">Cek Tiket</a>
          </div>
          <div className="footer-col">
            <h4>Dukungan</h4>
            <a href="#">FAQ</a>
            <a href="#">Hubungi Kami</a>
            <a href="#">Syarat & Ketentuan</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 HihaFest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
