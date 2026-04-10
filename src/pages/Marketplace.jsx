import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// ── Nav Items (shared with Dashboard) ─────────────────────────────────────────
const navItems = [
  {
    label: 'Tableau de bord', path: '/dashboard',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
  },
  {
    label: 'Marketplace', path: '/marketplace',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  },
  {
    label: 'Déclarer une pénurie', path: '/create-offer',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    label: "Demandes d'échange", path: '/exchange-requests', badge: 3,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>,
  },
];

// ── Mock Data ──────────────────────────────────────────────────────────────────
const ALL_LISTINGS = [
  { id: 1, name: 'Paracétamol 500mg', category: 'Analgésique', type: 'offre', qty: 2000, unit: 'unités', price: 1200, wilaya: 'Alger', owner: 'Pharmacie El Nour', ownerType: 'pharmacie', expiry: '2026-08', urgency: null, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop' },
  { id: 2, name: 'Amoxicilline 1g', category: 'Antibiotique', type: 'demande', qty: 500, unit: 'boîtes', price: null, wilaya: 'Oran', owner: 'Hôpital Ibn Sina', ownerType: 'hopital', expiry: null, urgency: 'urgent', image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&h=200&fit=crop' },
  { id: 3, name: 'Insuline Glargine 100UI', category: 'Diabétologie', type: 'offre', qty: 150, unit: 'stylos', price: 45000, wilaya: 'Constantine', owner: 'Labo Saidal', ownerType: 'labo', expiry: '2025-12', urgency: null, image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=200&fit=crop' },
  { id: 4, name: 'Metformine 850mg', category: 'Diabétologie', type: 'demande', qty: 300, unit: 'boîtes', price: null, wilaya: 'Annaba', owner: 'Clinique Tafat', ownerType: 'hopital', expiry: null, urgency: 'critique', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=200&fit=crop' },
  { id: 5, name: 'Doliprane 1g', category: 'Analgésique', type: 'offre', qty: 800, unit: 'boîtes', price: 950, wilaya: 'Blida', owner: 'Pharmacie Centrale', ownerType: 'pharmacie', expiry: '2026-06', urgency: null, image: 'https://images.unsplash.com/photo-1607619662634-3ac55ec0e216?w=300&h=200&fit=crop' },
  { id: 6, name: 'Augmentin 1g', category: 'Antibiotique', type: 'offre', qty: 200, unit: 'boîtes', price: 3200, wilaya: 'Sétif', owner: 'Labo Biopharm', ownerType: 'labo', expiry: '2026-03', urgency: null, image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop' },
  { id: 7, name: 'Voltarène Gel 1%', category: 'Anti-inflammatoire', type: 'demande', qty: 100, unit: 'tubes', price: null, wilaya: 'Tizi Ouzou', owner: 'Pharmacie Ibn Khaldoun', ownerType: 'pharmacie', expiry: null, urgency: 'urgent', image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=300&h=200&fit=crop' },
  { id: 8, name: 'Oméprazole 20mg', category: 'Gastro-entérologie', type: 'offre', qty: 1500, unit: 'gélules', price: 800, wilaya: 'Alger', owner: 'Pharmacie Bab El Oued', ownerType: 'pharmacie', expiry: '2026-09', urgency: null, image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=300&h=200&fit=crop' },
  { id: 9, name: 'Ciprofloxacine 500mg', category: 'Antibiotique', type: 'demande', qty: 400, unit: 'comprimés', price: null, wilaya: 'Oran', owner: 'Hôpital Canastel', ownerType: 'hopital', expiry: null, urgency: null, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=200&fit=crop' },
  { id: 10, name: 'Salbutamol 100mcg', category: 'Pneumologie', type: 'offre', qty: 60, unit: 'inhalateurs', price: 5500, wilaya: 'Batna', owner: 'Pharmacie El Shifa', ownerType: 'pharmacie', expiry: '2026-05', urgency: null, image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=300&h=200&fit=crop' },
  { id: 11, name: 'Furosémide 40mg', category: 'Cardiologie', type: 'demande', qty: 600, unit: 'comprimés', price: null, wilaya: 'Constantine', owner: 'CHU Constantine', ownerType: 'hopital', expiry: null, urgency: 'urgent', image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=300&h=200&fit=crop' },
  { id: 12, name: 'Atorvastatine 40mg', category: 'Cardiologie', type: 'offre', qty: 900, unit: 'comprimés', price: 2100, wilaya: 'Blida', owner: 'Labo Saidal', ownerType: 'labo', expiry: '2027-01', urgency: null, image: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=300&h=200&fit=crop' },
];

const CATEGORIES = ['Tous', 'Analgésique', 'Antibiotique', 'Diabétologie', 'Anti-inflammatoire', 'Gastro-entérologie', 'Pneumologie', 'Cardiologie'];
const WILAYAS = ['Toutes', 'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif', 'Tizi Ouzou', 'Batna'];
const OWNER_TYPES = ['Tous', 'pharmacie', 'hopital', 'labo'];

const ownerTypeLabel = { pharmacie: 'Pharmacie', hopital: 'Hôpital', labo: 'Laboratoire' };
const ownerTypeColor = {
  pharmacie: 'bg-teal-50 text-teal-700 border-teal-200',
  hopital: 'bg-blue-50 text-blue-700 border-blue-200',
  labo: 'bg-amber-50 text-amber-700 border-amber-200',
};
const ownerTypeDot = { pharmacie: 'bg-teal-500', hopital: 'bg-blue-500', labo: 'bg-amber-500' };

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ activePath }) {
  const navigate = useNavigate();
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-100 flex flex-col z-30 shadow-sm">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center shadow">
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
          </svg>
        </div>
        <span className="text-lg font-bold text-gray-800 tracking-tight">SAYDALYATI</span>
      </div>
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const isActive = activePath === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive ? 'bg-teal-500 text-white shadow-md shadow-teal-200' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
              <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="px-3 pb-5">
        <div className="bg-teal-50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">Admin</p>
            <p className="text-xs text-teal-600">Pharmacie</p>
          </div>
          <button onClick={() => navigate('/login')} title="Déconnexion" className="text-gray-400 hover:text-red-400 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

// ── Listing Card ───────────────────────────────────────────────────────────────
function ListingCard({ item, onContact }) {
  const isOffer = item.type === 'offre';
  const urgencyStyle = item.urgency === 'critique'
    ? 'bg-red-100 text-red-600'
    : item.urgency === 'urgent'
    ? 'bg-amber-100 text-amber-600'
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img src={item.image} alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200/e5e7eb/9ca3af?text=💊'; }}
        />
        {/* Type badge */}
        <div className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full shadow ${isOffer ? 'bg-teal-500 text-white' : 'bg-gray-800 text-white'}`}>
          {isOffer ? '📦 Offre' : '🔍 Demande'}
        </div>
        {/* Urgency */}
        {item.urgency && (
          <div className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${urgencyStyle}`}>
            {item.urgency}
          </div>
        )}
        {/* Expiry */}
        {isOffer && item.expiry && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-lg">
            Exp. {item.expiry}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-800 text-sm leading-tight">{item.name}</h3>
        </div>
        <p className="text-xs text-gray-400 mb-3">{item.category}</p>

        {/* Quantity + Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <span className="font-medium text-gray-700">{item.qty.toLocaleString()}</span> {item.unit}
          </div>
          {isOffer && item.price && (
            <span className="text-sm font-bold text-teal-600">{item.price.toLocaleString()} DA</span>
          )}
        </div>

        {/* Owner */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ownerTypeDot[item.ownerType]}`} />
          <span className="text-xs text-gray-600 truncate">{item.owner}</span>
          <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full border ${ownerTypeColor[item.ownerType]}`}>
            {ownerTypeLabel[item.ownerType]}
          </span>
        </div>

        {/* Wilaya */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {item.wilaya}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <button onClick={() => onContact(item)}
          className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          Contacter
        </button>
      </div>
    </div>
  );
}

// ── Contact Modal ──────────────────────────────────────────────────────────────
function ContactModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Contacter {item.owner}</h3>
            <p className="text-xs text-gray-400">{item.name} — {item.wilaya}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Votre message</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              rows={4}
              defaultValue={`Bonjour, je suis intéressé par votre ${item.type === 'offre' ? 'offre' : 'demande'} concernant ${item.name} (${item.qty} ${item.unit}). Pouvez-vous me donner plus de détails ?`}
            />
          </div>
          <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5 rounded-xl text-sm transition-colors shadow-sm">
            Envoyer la demande d'échange
          </button>
          <button onClick={onClose} className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium py-2.5 rounded-xl text-sm transition-colors border border-gray-200">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Marketplace ───────────────────────────────────────────────────────────
export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('tous'); // 'tous' | 'offre' | 'demande'
  const [categoryFilter, setCategoryFilter] = useState('Tous');
  const [wilayaFilter, setWilayaFilter] = useState('Toutes');
  const [ownerFilter, setOwnerFilter] = useState('Tous');
  const [urgencyOnly, setUrgencyOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('recent');
  const [contactItem, setContactItem] = useState(null);

  const filtered = useMemo(() => {
    let result = ALL_LISTINGS;
    if (typeFilter !== 'tous') result = result.filter(i => i.type === typeFilter);
    if (categoryFilter !== 'Tous') result = result.filter(i => i.category === categoryFilter);
    if (wilayaFilter !== 'Toutes') result = result.filter(i => i.wilaya === wilayaFilter);
    if (ownerFilter !== 'Tous') result = result.filter(i => i.ownerType === ownerFilter);
    if (urgencyOnly) result = result.filter(i => i.urgency);
    if (search.trim()) result = result.filter(i =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.owner.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === 'price_asc') result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === 'price_desc') result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === 'qty_desc') result = [...result].sort((a, b) => b.qty - a.qty);
    return result;
  }, [search, typeFilter, categoryFilter, wilayaFilter, ownerFilter, urgencyOnly, sortBy]);

  const offresCount = ALL_LISTINGS.filter(i => i.type === 'offre').length;
  const demandesCount = ALL_LISTINGS.filter(i => i.type === 'demande').length;
  const urgentCount = ALL_LISTINGS.filter(i => i.urgency).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePath="/marketplace" />

      <main className="ml-60 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
            <p className="text-sm text-gray-400 mt-0.5">Explorez les offres et demandes de médicaments</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/create-offer"
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Nouvelle annonce
            </Link>
            {/* Notification */}
            <button className="relative w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center border border-gray-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold text-sm">A</div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-none">Admin</p>
                <p className="text-xs text-teal-600 mt-0.5">Pharmacie</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          {/* ── Filters Panel ── */}
          <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 p-4 space-y-5 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
            {/* Summary chips */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Résumé</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Offres</span>
                <span className="font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{offresCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Demandes</span>
                <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">{demandesCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Urgents</span>
                <span className="font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{urgentCount}</span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Type */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Type</p>
              <div className="space-y-1">
                {[{ val: 'tous', label: 'Tous' }, { val: 'offre', label: '📦 Offres' }, { val: 'demande', label: '🔍 Demandes' }].map(t => (
                  <button key={t.val} onClick={() => setTypeFilter(t.val)}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${typeFilter === t.val ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Category */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Catégorie</p>
              <div className="space-y-1">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategoryFilter(c)}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${categoryFilter === c ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Wilaya */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Wilaya</p>
              <select value={wilayaFilter} onChange={e => setWilayaFilter(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700 bg-white">
                {WILAYAS.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>

            <hr className="border-gray-100" />

            {/* Owner type */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Établissement</p>
              <div className="space-y-1">
                {OWNER_TYPES.map(o => (
                  <button key={o} onClick={() => setOwnerFilter(o)}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors capitalize ${ownerFilter === o ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {o === 'Tous' ? 'Tous' : ownerTypeLabel[o]}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Urgency toggle */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">Urgents seulement</p>
              <button onClick={() => setUrgencyOnly(v => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors ${urgencyOnly ? 'bg-teal-500' : 'bg-gray-200'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${urgencyOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Reset */}
            <button onClick={() => { setSearch(''); setTypeFilter('tous'); setCategoryFilter('Tous'); setWilayaFilter('Toutes'); setOwnerFilter('Tous'); setUrgencyOnly(false); }}
              className="w-full text-xs text-gray-400 hover:text-red-400 transition-colors py-1 border border-dashed border-gray-200 rounded-lg hover:border-red-200">
              Réinitialiser les filtres
            </button>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 p-6">
            {/* Search + sort bar */}
            <div className="flex items-center gap-3 mb-5">
              <div className="relative flex-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un médicament, établissement…"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-white" />
              </div>

              {/* Sort */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-700 min-w-[160px]">
                <option value="recent">Plus récents</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="qty_desc">Quantité décroissante</option>
              </select>

              {/* View toggle */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-teal-50 text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </button>
                <button onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-teal-50 text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{filtered.length}</span> résultat{filtered.length !== 1 ? 's' : ''}
              </span>
              {/* Active filters */}
              {typeFilter !== 'tous' && (
                <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  {typeFilter}
                  <button onClick={() => setTypeFilter('tous')} className="hover:text-red-500">×</button>
                </span>
              )}
              {categoryFilter !== 'Tous' && (
                <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  {categoryFilter}
                  <button onClick={() => setCategoryFilter('Tous')} className="hover:text-red-500">×</button>
                </span>
              )}
              {urgencyOnly && (
                <span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  Urgents
                  <button onClick={() => setUrgencyOnly(false)} className="hover:text-red-800">×</button>
                </span>
              )}
            </div>

            {/* Grid or List */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mb-3 text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p className="font-medium text-gray-500">Aucun résultat trouvé</p>
                <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(item => (
                  <ListingCard key={item.id} item={item} onContact={setContactItem} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex items-center gap-4">
                    <img src={item.image} alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/64x64/e5e7eb/9ca3af?text=💊'; }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.type === 'offre' ? 'bg-teal-50 text-teal-700' : 'bg-gray-100 text-gray-600'}`}>
                          {item.type === 'offre' ? 'Offre' : 'Demande'}
                        </span>
                        {item.urgency && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${item.urgency === 'critique' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            {item.urgency}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-1">{item.category} · {item.wilaya}</p>
                      <p className="text-xs text-gray-600">
                        <span className={`w-2 h-2 inline-block rounded-full mr-1 ${ownerTypeDot[item.ownerType]}`} />
                        {item.owner}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">{item.qty.toLocaleString()} {item.unit}</p>
                        {item.price && <p className="text-xs text-teal-600 font-medium">{item.price.toLocaleString()} DA</p>}
                      </div>
                      <button onClick={() => setContactItem(item)}
                        className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        Contacter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Contact Modal */}
      <ContactModal item={contactItem} onClose={() => setContactItem(null)} />
    </div>
  );
}
