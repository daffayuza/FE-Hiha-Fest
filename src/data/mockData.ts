export interface TicketCategory {
  id: string;
  name: string;
  price: number;
  quota: number;
  sold: number;
}

export interface Concert {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  category: string;
  poster: string;
  ticketCategories: TicketCategory[];
  status: 'published' | 'draft' | 'completed';
  featured?: boolean;
}

export interface Transaction {
  id: string;
  orderNumber: string;
  concertId: string;
  concertName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  ticketCategory: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  createdAt: string;
  tickets?: GeneratedTicket[];
}

export interface GeneratedTicket {
  id: string;
  qrCode: string;
  ticketNumber: string;
}

export const concerts: Concert[] = [
  {
    id: '1',
    name: 'HAHAHIHIFEST 2026',
    description: 'Festival musik terbesar tahun ini menghadirkan deretan artis papan atas Indonesia dan internasional. Nikmati pengalaman konser yang tak terlupakan dengan stage megah, sound system berkualitas tinggi, dan atmosfer yang luar biasa. Lebih dari 20 artis akan tampil dalam 2 hari penuh keseruan!',
    date: '2026-08-15',
    time: '14:00',
    venue: 'Gelora Bung Karno',
    city: 'Jakarta',
    category: 'Festival',
    poster: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=1000&fit=crop',
    ticketCategories: [
      { id: 'tc1', name: 'Festival Pass (2 Hari)', price: 1500000, quota: 5000, sold: 3200 },
      { id: 'tc2', name: 'VIP Pass (2 Hari)', price: 3500000, quota: 1000, sold: 750 },
      { id: 'tc3', name: 'VVIP Pass (2 Hari)', price: 7500000, quota: 200, sold: 180 },
    ],
    status: 'published',
    featured: true,
  },
  {
    id: '2',
    name: 'Tulus - Manusia World Tour',
    description: 'Konser tur dunia Tulus dengan album terbaru "Manusia". Rasakan kehangatan musik Tulus dengan aransemen orkestra penuh dan setlist spesial yang mencakup lagu-lagu hit serta lagu baru.',
    date: '2026-09-20',
    time: '19:00',
    venue: 'Indonesia Convention Exhibition (ICE)',
    city: 'Tangerang',
    category: 'Pop',
    poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1000&fit=crop',
    ticketCategories: [
      { id: 'tc4', name: 'CAT 1', price: 1250000, quota: 3000, sold: 2800 },
      { id: 'tc5', name: 'CAT 2', price: 850000, quota: 5000, sold: 3500 },
      { id: 'tc6', name: 'CAT 3', price: 450000, quota: 7000, sold: 4200 },
    ],
    status: 'published',
  },
  {
    id: '3',
    name: 'Dewa 19 Reunion Concert',
    description: 'Konser reuni legendaris Dewa 19 dengan formasi lengkap! Saksikan performa epic dari band rock terbesar Indonesia yang akan membawakan hits sepanjang masa.',
    date: '2026-10-05',
    time: '19:30',
    venue: 'Stadion Utama Gelora Bung Karno',
    city: 'Jakarta',
    category: 'Rock',
    poster: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=1000&fit=crop',
    ticketCategories: [
      { id: 'tc7', name: 'Tribune', price: 350000, quota: 20000, sold: 15000 },
      { id: 'tc8', name: 'Festival', price: 750000, quota: 10000, sold: 7500 },
      { id: 'tc9', name: 'VIP', price: 2000000, quota: 2000, sold: 1800 },
    ],
    status: 'published',
  },
  {
    id: '4',
    name: 'Raisa - Kali Kedua Live',
    description: 'Raisa kembali dengan konser akustik intimate. Dengarkan suara merdu Raisa lebih dekat dalam setting yang hangat dan personal.',
    date: '2026-11-12',
    time: '20:00',
    venue: 'The Kasablanka Hall',
    city: 'Jakarta',
    category: 'Pop',
    poster: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=1000&fit=crop',
    ticketCategories: [
      { id: 'tc10', name: 'Regular', price: 500000, quota: 2000, sold: 1200 },
      { id: 'tc11', name: 'Premium', price: 1000000, quota: 800, sold: 600 },
      { id: 'tc12', name: 'VVIP (Meet & Greet)', price: 3000000, quota: 100, sold: 85 },
    ],
    status: 'published',
  },
  {
    id: '5',
    name: 'Java Jazz Festival 2026',
    description: 'Festival jazz internasional terbesar di Asia Tenggara. Lebih dari 100 penampilan dari musisi jazz lokal dan internasional selama 3 hari berturut-turut.',
    date: '2026-12-01',
    time: '12:00',
    venue: 'JIExpo Kemayoran',
    city: 'Jakarta',
    category: 'Jazz',
    poster: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=1000&fit=crop',
    ticketCategories: [
      { id: 'tc13', name: 'Daily Pass', price: 600000, quota: 8000, sold: 3000 },
      { id: 'tc14', name: '3 Day Pass', price: 1500000, quota: 3000, sold: 1200 },
      { id: 'tc15', name: 'VIP 3 Day Pass', price: 4000000, quota: 500, sold: 200 },
    ],
    status: 'published',
  },
  {
    id: '6',
    name: 'Sheila On 7 - Anniversary Tour',
    description: 'Perayaan 30 tahun berkarya Sheila On 7 dengan tur keliling Indonesia. Nikmati lagu-lagu nostalgia yang menemani generasi.',
    date: '2026-10-25',
    time: '19:00',
    venue: 'Sasana Budaya Ganesha (Sabuga)',
    city: 'Bandung',
    category: 'Pop Rock',
    poster: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=1000&fit=crop',
    ticketCategories: [
      { id: 'tc16', name: 'Regular', price: 250000, quota: 3000, sold: 2500 },
      { id: 'tc17', name: 'VIP', price: 750000, quota: 1000, sold: 700 },
    ],
    status: 'published',
  },
];

export const transactions: Transaction[] = [
  {
    id: 'tr1',
    orderNumber: 'ORD-2026-001234',
    concertId: '1',
    concertName: 'HAHAHIHIFEST 2026',
    buyerName: 'Ahmad Rizky',
    buyerEmail: 'ahmad.rizky@email.com',
    buyerPhone: '081234567890',
    ticketCategory: 'Festival Pass (2 Hari)',
    quantity: 2,
    totalPrice: 3000000,
    status: 'paid',
    createdAt: '2026-06-15T10:30:00',
    tickets: [
      { id: 'tkt1', qrCode: 'QR-HHF-001234-A', ticketNumber: 'TKT-001234-A' },
      { id: 'tkt2', qrCode: 'QR-HHF-001234-B', ticketNumber: 'TKT-001234-B' },
    ],
  },
  {
    id: 'tr2',
    orderNumber: 'ORD-2026-001235',
    concertId: '1',
    concertName: 'HAHAHIHIFEST 2026',
    buyerName: 'Siti Nurhaliza',
    buyerEmail: 'siti.n@email.com',
    buyerPhone: '081298765432',
    ticketCategory: 'VIP Pass (2 Hari)',
    quantity: 1,
    totalPrice: 3500000,
    status: 'paid',
    createdAt: '2026-06-15T11:45:00',
    tickets: [
      { id: 'tkt3', qrCode: 'QR-HHF-001235-A', ticketNumber: 'TKT-001235-A' },
    ],
  },
  {
    id: 'tr3',
    orderNumber: 'ORD-2026-001236',
    concertId: '2',
    concertName: 'Tulus - Manusia World Tour',
    buyerName: 'Budi Santoso',
    buyerEmail: 'budi.s@email.com',
    buyerPhone: '087654321098',
    ticketCategory: 'CAT 1',
    quantity: 3,
    totalPrice: 3750000,
    status: 'pending',
    createdAt: '2026-06-16T09:15:00',
  },
  {
    id: 'tr4',
    orderNumber: 'ORD-2026-001237',
    concertId: '3',
    concertName: 'Dewa 19 Reunion Concert',
    buyerName: 'Dewi Lestari',
    buyerEmail: 'dewi.l@email.com',
    buyerPhone: '081345678901',
    ticketCategory: 'VIP',
    quantity: 2,
    totalPrice: 4000000,
    status: 'paid',
    createdAt: '2026-06-16T14:20:00',
    tickets: [
      { id: 'tkt4', qrCode: 'QR-DW19-001237-A', ticketNumber: 'TKT-001237-A' },
      { id: 'tkt5', qrCode: 'QR-DW19-001237-B', ticketNumber: 'TKT-001237-B' },
    ],
  },
  {
    id: 'tr5',
    orderNumber: 'ORD-2026-001238',
    concertId: '4',
    concertName: 'Raisa - Kali Kedua Live',
    buyerName: 'Fajar Nugraha',
    buyerEmail: 'fajar.n@email.com',
    buyerPhone: '089876543210',
    ticketCategory: 'VVIP (Meet & Greet)',
    quantity: 1,
    totalPrice: 3000000,
    status: 'expired',
    createdAt: '2026-06-17T08:00:00',
  },
  {
    id: 'tr6',
    orderNumber: 'ORD-2026-001239',
    concertId: '1',
    concertName: 'HAHAHIHIFEST 2026',
    buyerName: 'Maya Putri',
    buyerEmail: 'maya.p@email.com',
    buyerPhone: '081567890123',
    ticketCategory: 'VVIP Pass (2 Hari)',
    quantity: 2,
    totalPrice: 15000000,
    status: 'paid',
    createdAt: '2026-06-17T16:30:00',
    tickets: [
      { id: 'tkt6', qrCode: 'QR-HHF-001239-A', ticketNumber: 'TKT-001239-A' },
      { id: 'tkt7', qrCode: 'QR-HHF-001239-B', ticketNumber: 'TKT-001239-B' },
    ],
  },
  {
    id: 'tr7',
    orderNumber: 'ORD-2026-001240',
    concertId: '5',
    concertName: 'Java Jazz Festival 2026',
    buyerName: 'Randi Setiawan',
    buyerEmail: 'randi.s@email.com',
    buyerPhone: '082345678901',
    ticketCategory: '3 Day Pass',
    quantity: 4,
    totalPrice: 6000000,
    status: 'failed',
    createdAt: '2026-06-18T12:00:00',
  },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
