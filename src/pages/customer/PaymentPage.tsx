import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import './PaymentPage.css';

/**
 * PaymentPage is now a fallback/redirect page.
 * With Midtrans Snap integration, the popup is opened from CheckoutPage directly.
 * This page handles edge cases where users navigate to /payment directly.
 */
export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    snapToken?: string;
    orderNumber?: string;
    concert?: { name: string };
    buyer?: { email: string };
    ticket?: { totalPrice: number };
  } | null;

  useEffect(() => {
    // If we have a snapToken, try to open Snap popup
    if (state?.snapToken && window.snap) {
      window.snap.pay(state.snapToken, {
        onSuccess: (result: any) => {
          navigate('/payment/status', {
            state: {
              status: 'success',
              orderNumber: state.orderNumber,
              concertName: state.concert?.name,
              buyerEmail: state.buyer?.email,
              totalPrice: state.ticket?.totalPrice,
            },
          });
        },
        onPending: (result: any) => {
          navigate('/payment/status', {
            state: {
              status: 'pending',
              orderNumber: state.orderNumber,
              concertName: state.concert?.name,
              buyerEmail: state.buyer?.email,
              totalPrice: state.ticket?.totalPrice,
            },
          });
        },
        onError: (result: any) => {
          navigate('/payment/status', {
            state: {
              status: 'failed',
              orderNumber: state.orderNumber,
              concertName: state.concert?.name,
              buyerEmail: state.buyer?.email,
              totalPrice: state.ticket?.totalPrice,
            },
          });
        },
        onClose: () => {
          navigate('/');
        },
      });
    }
  }, [state, navigate]);

  if (!state || !state.snapToken) {
    return (
      <div className="payment-page">
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
          <h2>Data pembayaran tidak ditemukan</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Pembayaran kini dilakukan langsung dari halaman checkout melalui popup Midtrans.
          </p>
          <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <Loader2 size={48} className="spin" style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }} />
        <h2>Membuka Pembayaran...</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Popup pembayaran Midtrans akan segera muncul. Mohon jangan tutup halaman ini.
        </p>
      </div>
    </div>
  );
}
