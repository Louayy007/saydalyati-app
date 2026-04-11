import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { apiRequest, clearAuthSession } from '../lib/api';

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

const ALGERIA_WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Bejaia', 'Biskra', 'Bechar', 'Blida', 'Bouira',
  'Tamanrasset', 'Tebessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Setif', 'Saida',
  'Skikda', 'Sidi Bel Abbes', 'Annaba', 'Guelma', 'Constantine', 'Medea', 'Mostaganem', 'Msila', 'Mascara', 'Ouargla',
  'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arreridj', 'Boumerdes', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
  'Souk Ahras', 'Tipaza', 'Mila', 'Ain Defla', 'Naama', 'Ain Temouchent', 'Ghardaia', 'Relizane', 'El Mghair', 'El Meniaa',
  'Ouled Djellal', 'Bordj Baji Mokhtar', 'Beni Abbes', 'Timimoun', 'Touggourt', 'Djanet', 'In Salah', 'In Guezzam',
];
const OWNER_TYPES = ['Tous', 'pharmacie', 'hopital', 'labo'];

const ownerTypeLabel = { pharmacie: 'Pharmacie', hopital: 'Hôpital', labo: 'Laboratoire' };
const ownerTypeColor = {
  pharmacie: 'bg-teal-50 text-teal-700 border-teal-200',
  hopital: 'bg-blue-50 text-blue-700 border-blue-200',
  labo: 'bg-amber-50 text-amber-700 border-amber-200',
};
const ownerTypeDot = { pharmacie: 'bg-teal-500', hopital: 'bg-blue-500', labo: 'bg-amber-500' };

function normalizeText(value) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeWilayaName(rawWilaya) {
  const normalized = normalizeText(rawWilaya);
  const matched = ALGERIA_WILAYAS.find((wilaya) => normalizeText(wilaya) === normalized);
  return matched || rawWilaya || 'N/A';
}

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
          <button onClick={() => { clearAuthSession(); navigate('/login'); }} title="Déconnexion" className="text-gray-400 hover:text-red-400 transition-colors">
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
  const isDemand = item.type === 'demande';
  const urgencyStyle = item.urgency === 'critique'
    ? 'bg-red-100 text-red-600'
    : item.urgency === 'urgent'
    ? 'bg-amber-100 text-amber-600'
    : null;

  if (isDemand) {
    return (
      <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-white via-orange-50/60 to-rose-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
        <div className="px-4 py-3 border-b border-orange-100 bg-gradient-to-r from-orange-500 to-rose-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-100">Demande d'echange</p>
              <p className="text-sm font-semibold leading-tight">{item.category}</p>
            </div>
          </div>
          {item.urgency && (
            <span className={`text-[11px] font-bold px-2 py-1 rounded-full capitalize ${urgencyStyle}`}>
              {item.urgency}
            </span>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-gray-900 text-[15px] leading-tight mb-3">{item.name}</h3>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-xl border border-orange-100 bg-white p-2.5">
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">Quantite</p>
              <p className="text-sm font-semibold text-gray-800">{item.qty.toLocaleString()} {item.unit}</p>
            </div>
            <div className="rounded-xl border border-orange-100 bg-white p-2.5">
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">Localisation</p>
              <p className="text-sm font-semibold text-gray-800">{item.wilaya}</p>
            </div>
          </div>

          <div className="rounded-xl border border-orange-100 bg-white px-3 py-2.5 mb-3">
            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Etablissement</p>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ownerTypeDot[item.ownerType]}`} />
              <span className="text-sm text-gray-700 truncate">{item.owner}</span>
              <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full border ${ownerTypeColor[item.ownerType]}`}>
                {ownerTypeLabel[item.ownerType]}
              </span>
            </div>
          </div>

          <div className="mt-auto">
            <button onClick={() => onContact(item)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Proposer un echange
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img src={item.image} alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200/e5e7eb/9ca3af?text=💊'; }}
        />
        {/* Type badge */}
        <div className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full shadow bg-teal-500 text-white">
          📦 Offre
        </div>
        {/* Expiry */}
        {item.expiry && (
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
          {item.price && (
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
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(`Bonjour, je suis intéressé par votre ${item.type === 'offre' ? 'offre' : 'demande'} concernant ${item.name} (${item.qty} ${item.unit}). Pouvez-vous me donner plus de détails ?`);

  async function sendRequest() {
    try {
      setSending(true);
      await apiRequest('/api/exchange-requests', {
        method: 'POST',
        body: JSON.stringify({
          listingId: item.id,
          message,
        }),
      });
      onClose();
    } catch (error) {
      alert(error.message || "Impossible d'envoyer la demande");
    } finally {
      setSending(false);
    }
  }

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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button onClick={sendRequest} disabled={sending} className={`w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5 rounded-xl text-sm transition-colors shadow-sm ${sending ? 'opacity-60 cursor-not-allowed' : ''}`}>
            {sending ? 'Envoi...' : "Envoyer la demande d'échange"}
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [typeFilter, setTypeFilter] = useState('tous'); // 'tous' | 'offre' | 'demande'
  const [categoryFilter, setCategoryFilter] = useState('Tous');
  const [wilayaFilter, setWilayaFilter] = useState('Toutes');
  const [ownerFilter, setOwnerFilter] = useState('Tous');
  const [urgencyOnly, setUrgencyOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('recent');
  const [contactItem, setContactItem] = useState(null);
  const [allListings, setAllListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [listingsError, setListingsError] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const listingsCacheRef = useRef(new Map());

  const categoryOptions = useMemo(() => {
    const values = Array.from(new Set(allListings.map((item) => item.category).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'fr'));
    return ['Tous', ...values];
  }, [allListings]);

  const wilayaStats = useMemo(() => {
    const counts = new Map();
    allListings.forEach((item) => {
      const name = normalizeWilayaName(item.wilaya);
      if (!ALGERIA_WILAYAS.includes(name)) return;
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return counts;
  }, [allListings]);

  useEffect(() => {
    const nextSearch = searchParams.get('search') || '';
    setSearch(nextSearch);
  }, [searchParams]);

  useEffect(() => {
    const current = searchParams.get('search') || '';
    if (current === search) return;

    const nextParams = new URLSearchParams(searchParams);
    if (search.trim()) {
      nextParams.set('search', search.trim());
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams, { replace: true });
  }, [search, searchParams, setSearchParams]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadListings() {
      const params = new URLSearchParams();
      if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
      if (typeFilter !== 'tous') params.set('type', typeFilter);
      if (categoryFilter !== 'Tous') params.set('category', categoryFilter);
      if (wilayaFilter !== 'Toutes') params.set('wilaya', wilayaFilter);
      if (ownerFilter !== 'Tous') params.set('ownerType', ownerFilter);
      if (urgencyOnly) params.set('urgentOnly', 'true');
      if (sortBy !== 'recent') params.set('sort', sortBy);
      const queryString = params.toString();

      try {
        setIsLoadingListings(true);
        setListingsError('');

        if (listingsCacheRef.current.has(queryString)) {
          setAllListings(listingsCacheRef.current.get(queryString));
          setIsLoadingListings(false);
          return;
        }

        const rows = await apiRequest(`/api/listings${queryString ? `?${queryString}` : ''}`, { signal: controller.signal });
        const mapped = rows.map((r) => ({
          id: r.id,
          name: r.title,
          category: r.category,
          type: r.type,
          qty: r.quantity,
          unit: r.unit,
          price: r.priceDa,
          wilaya: normalizeWilayaName(r.wilaya || r.owner?.wilaya),
          owner: r.owner?.establishmentName || r.owner?.fullName || r.owner?.email || 'N/A',
          ownerType: r.owner?.establishmentType || 'pharmacie',
          expiry: null,
          urgency: r.urgency,
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
        }));
        listingsCacheRef.current.set(queryString, mapped);
        setAllListings(mapped);
      } catch (error) {
        if (error.name === 'AbortError') return;
        setAllListings([]);
        setListingsError(error.message || 'Impossible de charger les produits depuis la base de donnees.');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingListings(false);
        }
      }
    }

    loadListings();
    return () => {
      controller.abort();
    };
  }, [debouncedSearch, typeFilter, categoryFilter, wilayaFilter, ownerFilter, urgencyOnly, sortBy]);

  const filtered = allListings;

  const offresCount = allListings.filter(i => i.type === 'offre').length;
  const demandesCount = allListings.filter(i => i.type === 'demande').length;
  const urgentCount = allListings.filter(i => i.urgency).length;
  const typeFilterLabel = typeFilter === 'offre' ? 'Offres' : typeFilter === 'demande' ? 'Demandes' : 'Tous';

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
            <button
              onClick={() => navigate('/exchange-requests')}
              className="relative w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center border border-gray-200"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1 hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold text-sm">A</div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-none">Admin</p>
                <p className="text-xs text-teal-600 mt-0.5">Pharmacie</p>
              </div>
            </button>
          </div>
        </header>

        <div className="flex-1 p-6">
          {listingsError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
              {listingsError}
            </div>
          )}

          {/* ── Professional Top Filters ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-5 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-1">Résumé</span>
              <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">Offres: {offresCount}</span>
              <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">Demandes: {demandesCount}</span>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">Urgents: {urgentCount}</span>
              <button
                onClick={() => {
                  setSearch('');
                  setTypeFilter('tous');
                  setCategoryFilter('Tous');
                  setWilayaFilter('Toutes');
                  setOwnerFilter('Tous');
                  setUrgencyOnly(false);
                }}
                className="ml-auto text-xs text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                Réinitialiser
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500">Type</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="tous">Tous</option>
                  <option value="offre">Offres</option>
                  <option value="demande">Demandes</option>
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500">Catégorie</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500">Wilaya</span>
                <select
                  value={wilayaFilter}
                  onChange={(e) => setWilayaFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="Toutes">Toutes</option>
                  {ALGERIA_WILAYAS.map((w) => (
                    <option key={w} value={w}>{w}{wilayaStats.get(w) ? ` (${wilayaStats.get(w)})` : ''}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500">Établissement</span>
                <select
                  value={ownerFilter}
                  onChange={(e) => setOwnerFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  {OWNER_TYPES.map((o) => (
                    <option key={o} value={o}>{o === 'Tous' ? 'Tous' : ownerTypeLabel[o]}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm font-medium text-gray-600">Niveau d'urgence</p>
                <div className="flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden">
                  <button
                    onClick={() => setUrgencyOnly(false)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors ${!urgencyOnly ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setUrgencyOnly(true)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors ${urgencyOnly ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Urgents seulement
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div>
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
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{filtered.length}</span> résultat{filtered.length !== 1 ? 's' : ''}
              </span>
              {/* Active filters */}
              {typeFilter !== 'tous' && (
                <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  {typeFilterLabel}
                  <button onClick={() => setTypeFilter('tous')} className="hover:text-red-500">×</button>
                </span>
              )}
              {categoryFilter !== 'Tous' && (
                <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  {categoryFilter}
                  <button onClick={() => setCategoryFilter('Tous')} className="hover:text-red-500">×</button>
                </span>
              )}
              {wilayaFilter !== 'Toutes' && (
                <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  {wilayaFilter}
                  <button onClick={() => setWilayaFilter('Toutes')} className="hover:text-red-500">×</button>
                </span>
              )}
              {ownerFilter !== 'Tous' && (
                <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  {ownerTypeLabel[ownerFilter]}
                  <button onClick={() => setOwnerFilter('Tous')} className="hover:text-red-500">×</button>
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
            {isLoadingListings ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-3" />
                <p className="font-medium">Chargement des produits depuis la base de donnees...</p>
              </div>
            ) : filtered.length === 0 ? (
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
                {filtered.map(item => {
                  const isDemand = item.type === 'demande';
                  return (
                  <div key={item.id} className={`rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-4 flex items-center gap-4 ${isDemand ? 'bg-gradient-to-r from-orange-50 to-rose-50 border-orange-200' : 'bg-white border-gray-100'}`}>
                    <img src={item.image} alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/64x64/e5e7eb/9ca3af?text=💊'; }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.type === 'offre' ? 'bg-teal-50 text-teal-700' : 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'}`}>
                          {item.type === 'offre' ? 'Offre' : 'Demande'}
                        </span>
                        {item.urgency && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${item.urgency === 'critique' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            {item.urgency}
                          </span>
                        )}
                        {isDemand && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-orange-200 text-orange-700">Prioritaire</span>}
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
                        className={`flex items-center gap-1.5 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors ${isDemand ? 'bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600' : 'bg-teal-500 hover:bg-teal-600'}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        {isDemand ? 'Proposer un echange' : 'Contacter'}
                      </button>
                    </div>
                  </div>
                )})}
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
