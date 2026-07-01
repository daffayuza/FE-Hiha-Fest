# Hihafest Frontend

Ini adalah repositori antarmuka pengguna (Frontend) untuk **Hihafest**, platform penjualan tiket konser modern. Aplikasi ini menghubungkan pembeli tiket acara dan administrator melalui Single Page Application yang interaktif dan responsif.

## Tech Stack

- **Framework:** React 18 dengan [Vite](https://vitejs.dev/)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS (baru di-migrate sepenuhnya untuk memudahkan pengelolaan *utility classes*)
- **Routing:** React Router v7
- **Ikonografi:** Lucide React
- **Visualisasi Data:** Recharts (digunakan untuk *chart* penjualan di dashboard admin)

## Fitur Aplikasi

Aplikasi frontend ini memuat dua area utama:
1. **Public/Customer Area:** Landing page untuk *discovery* acara, detail acara eksklusif, serta alur pendaftaran dan checkout pembelian tiket menggunakan *Midtrans UI*.
2. **Admin Dashboard:** Panel kontrol terproteksi (dibutuhkan otentikasi) yang menangani fitur manajemen acara, memantau *timeline* pendapatan, melacak seluruh proses transaksi, serta pengelolaan informasi profil pengelola.

## Instalasi & Cara Menjalankan

1. Pastikan Anda berada di direktori `frontend`.
   ```bash
   cd frontend
   ```
2. Install seluruh kebutuhan dependensi menggunakan `npm`:
   ```bash
   npm install
   ```
3. Persiapkan `.env`. Copy dari contoh jika ada, dan konfigurasikan *environment variables* yang wajib digunakan program. Biasanya ini mencakup:
   - `VITE_API_URL` (Tujuan path endpoint ke Node.js Backend Anda)
   - `VITE_MIDTRANS_CLIENT_KEY` (Key publik yang bisa didapatkan pada Midtrans Dashboard)
4. Jalankan development server:
   ```bash
   npm run dev
   ```

Aplikasi dapat diamati beroperasi melalui [http://localhost:5173](http://localhost:5173).

## Scripts Utama

- `npm run dev`: Menjalankan aplikasi dalam mode lokal untuk pengembangan. Mendukung HMR.
- `npm run build`: Melakukan compiler TypeScript dan mem-build asset production.
- `npm run lint`: Menjalankan ESLint untuk mengecek kelayakan gaya pengkodean.
- `npm run preview`: Mensimulasikan hasil dari production build lokal.
