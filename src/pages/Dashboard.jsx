import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest, getAuthUser } from '../lib/api';

// ── Mock Data ──────────────────────────────────────────────────────────────────
const urgentDeclarations = [
  {
    id: 1,
    name: 'Paracétamol 500mg',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&h=80&fit=crop',
    location: 'Alger',
    time: 'Il y a 15 min',
    requester: 'Hôpital Mustapha',
    quantity: '1000 unités',
    badge: 'Urgent',
  },
  {
    id: 2,
    name: 'Amoxicilline 1g',
    image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=80&h=80&fit=crop',
    location: 'Oran',
    time: 'Il y a 32 min',
    requester: 'Pharmacie El Amel',
    quantity: '500 boîtes',
    badge: 'Urgent',
  },
  {
    id: 3,
    name: 'Insuline Glargine',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=80&h=80&fit=crop',
    location: 'Constantine',
    time: 'Il y a 1h',
    requester: 'Clinique Ibn Rochd',
    quantity: '200 stylos',
    badge: 'Critique',
  },
  {
    id: 4,
    name: 'Metformine 850mg',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=80&h=80&fit=crop',
    location: 'Annaba',
    time: 'Il y a 2h',
    requester: 'Hôpital Ibn Sina',
    quantity: '300 boîtes',
    badge: 'Urgent',
  },
];

const recentExchanges = [
  { id: 1, med: 'Doliprane 1g', from: 'Pharmacie Centrale', to: 'Hôpital Parnet', qty: '500 unités', status: 'Complété', date: 'Aujourd\'hui' },
  { id: 2, med: 'Augmentin 1g', from: 'Labo Saidal', to: 'Pharmacie El Fath', qty: '200 boîtes', status: 'En cours', date: 'Hier' },
  { id: 3, med: 'Voltarène gel', from: 'Pharmacie Ibn Khaldoun', to: 'Clinique Tafat', qty: '100 tubes', status: 'Complété', date: 'Hier' },
];

const stats = [
  {
    label: 'Pénuries urgentes',
    value: '12',
    sub: 'Ce mois',
    color: 'text-red-500',
    bg: 'bg-red-50',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    label: 'Échanges réussis',
    value: '48',
    sub: 'Ce mois',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    label: 'Médicaments disponibles',
    value: '342',
    sub: 'Actuel',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    label: 'Partenaires actifs',
    value: '127',
    sub: 'Réseau',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

const navItems = [
  {
    label: 'Tableau de bord',
    path: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: 'Marketplace',
    path: '/marketplace',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    label: 'Déclarer une pénurie',
    path: '/create-offer',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Demandes d'échange",
    path: '/exchange-requests',
    badge: 3,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
];

// ── Components ─────────────────────────────────────────────────────────────────

// Dans Sidebar.jsx
function Sidebar({ activePath, pendingCount }) {
  const navigate = useNavigate();
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-md border-r border-gray-100/50 flex flex-col z-30">
      <div className="flex items-center gap-3 px-6 py-8"> {/* Plus de padding vertical */}
        <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-200/50">
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
          </svg>
        </div>
        <span className="text-xl font-black text-gray-900 tracking-tight uppercase">Saydalyati</span>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = activePath === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                isActive 
                ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' // Noir profond pour l'actif = très pro
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}>
              <span className={`${isActive ? 'text-teal-400' : 'text-gray-400'} transition-colors`}>{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-lg bg-teal-500 text-[10px] text-white font-bold">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>
      {/* ... reste du footer sidebar ... */}
    </aside>
  );
}

// Dans Dashboard.jsx
function StatCard({ stat }) {
  return (
    <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] transition-all duration-500 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors`}>
          {stat.icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{stat.sub}</span>
      </div>
      <div>
        <p className="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
        <p className="text-sm font-medium text-gray-500 mt-1">{stat.label}</p>
      </div>
    </div>
  );
}

function UrgentCard({ item }) {
  const badgeColor =
    item.badge === 'Critique'
      ? 'bg-red-100 text-red-600'
      : 'bg-amber-100 text-amber-600';

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 group">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/64x64/e5e7eb/9ca3af?text=💊';
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {item.location}
          </span>
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {item.time}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          <span className="font-semibold text-gray-700">{item.requester}</span> recherche{' '}
          <span className="font-semibold text-gray-700">{item.quantity}</span>
        </p>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
          {item.badge}
        </span>
        <button className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          Contacter
        </button>
      </div>
    </div>
  );
}

function ExchangeRow({ exchange }) {
  const statusStyle =
    exchange.status === 'Complété'
      ? 'bg-green-100 text-green-600'
      : 'bg-blue-100 text-blue-600';

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4 text-sm font-medium text-gray-800">{exchange.med}</td>
      <td className="py-3 px-4 text-sm text-gray-500">{exchange.from}</td>
      <td className="py-3 px-4 text-sm text-gray-500">{exchange.to}</td>
      <td className="py-3 px-4 text-sm text-gray-500">{exchange.qty}</td>
      <td className="py-3 px-4">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle}`}>
          {exchange.status}
        </span>
      </td>
      <td className="py-3 px-4 text-xs text-gray-400">{exchange.date}</td>
    </tr>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [notifications] = useState(3);
  const [currentUser] = useState(() => getAuthUser());
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState('');
  const isAdmin = currentUser?.role === 'administrator';

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    let isMounted = true;

    async function loadPendingUsers() {
      try {
        setPendingLoading(true);
        setPendingError('');
        const rows = await apiRequest('/api/admin/pending-users');
        if (isMounted) setPendingUsers(rows);
      } catch (error) {
        if (isMounted) {
          setPendingError(error.message || 'Impossible de charger les comptes en attente');
        }
      } finally {
        if (isMounted) setPendingLoading(false);
      }
    }

    loadPendingUsers();
    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  async function handleApproval(userId, status) {
    try {
      await apiRequest(`/api/admin/users/${userId}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      setPendingError(error.message || 'Mise a jour impossible');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar activePath="/dashboard" />

      {/* Main Content */}
      <main className="ml-60 min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
            <p className="text-sm text-gray-400 mt-0.5">Bienvenue, Admin — Voici un aperçu de votre activité</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button
              onClick={() => navigate('/exchange-requests')}
              className="relative w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors border border-gray-200"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            {/* Avatar */}
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1 hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold text-sm shadow">
                A
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-none">Admin</p>
                <p className="text-xs text-teal-600 mt-0.5">Pharmacie</p>
              </div>
            </button>
          </div>
        </header>

        <div className="px-8 py-6 space-y-6">
          {isAdmin && (
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-800">Validation des nouveaux comptes</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Un administrateur doit confirmer les nouvelles inscriptions</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                  {pendingUsers.length} en attente
                </span>
              </div>

              <div className="p-5">
                {pendingLoading && <p className="text-sm text-gray-500">Chargement...</p>}
                {pendingError && <p className="text-sm text-red-600">{pendingError}</p>}

                {!pendingLoading && !pendingError && pendingUsers.length === 0 && (
                  <p className="text-sm text-gray-500">Aucun compte en attente.</p>
                )}

                {!pendingLoading && pendingUsers.length > 0 && (
                  <div className="space-y-3">
                    {pendingUsers.map((user) => (
                      <div key={user.id} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{user.profile?.establishmentName || user.profile?.fullName || user.email}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Type: {user.profile?.establishmentType || 'N/A'} · Wilaya: {user.profile?.wilaya || 'N/A'}
                          </p>
                          {user.profile?.certificateFileData ? (
                            <a
                              href={user.profile.certificateFileData}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex mt-2 text-xs text-teal-700 hover:text-teal-800 font-semibold"
                              download={user.profile?.certificateFileName || 'certificat'}
                            >
                              Voir le certificat: {user.profile?.certificateFileName || 'fichier'}
                            </a>
                          ) : (
                            <p className="mt-2 text-xs font-semibold text-red-600">Certificat non fourni</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproval(user.id, 'approved')}
                            className="px-3 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium"
                          >
                            Approuver
                          </button>
                          <button
                            onClick={() => handleApproval(user.id, 'rejected')}
                            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
                          >
                            Rejeter
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={i} stat={stat} />
            ))}
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-3 gap-6">
            {/* Urgent Declarations — takes 2 cols */}
            <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">Déclarations urgentes</h2>
                    <p className="text-xs text-gray-400">Pénuries nécessitant une action immédiate</p>
                  </div>
                </div>
                <Link to="/marketplace" className="text-sm text-teal-500 hover:text-teal-700 font-medium transition-colors">
                  Voir tout →
                </Link>
              </div>
              <div className="px-6 divide-y divide-gray-50">
                {urgentDeclarations.map((item) => (
                  <UrgentCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Actions rapides</h3>
                <div className="space-y-2.5">
                  <Link
                    to="/create-offer"
                    className="flex items-center gap-3 w-full bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-4 py-3 rounded-xl transition-colors shadow-sm"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Déclarer une pénurie
                  </Link>
                  <Link
                    to="/marketplace"
                    className="flex items-center gap-3 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium px-4 py-3 rounded-xl transition-colors border border-gray-200"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-teal-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    Parcourir le Marketplace
                  </Link>
                  <Link
                    to="/exchange-requests"
                    className="flex items-center gap-3 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium px-4 py-3 rounded-xl transition-colors border border-gray-200"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-teal-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                    Voir les demandes
                    <span className="ml-auto w-5 h-5 bg-amber-400 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium px-4 py-3 rounded-xl transition-colors border border-gray-200"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-teal-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M3.75 6h.008v.008H3.75V6zm0 6h.008v.008H3.75V12zm0 6h.008v.008H3.75V18z" />
                      </svg>
                      Administration
                    </Link>
                  )}
                </div>
              </div>

              {/* Mini Stats */}
              <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-5 text-white shadow-md">
                <p className="text-sm font-medium text-teal-100 mb-1">Taux de succès</p>
                <p className="text-4xl font-bold">94%</p>
                <p className="text-xs text-teal-200 mt-1">Échanges complétés ce mois</p>
                <div className="mt-4 bg-teal-400/30 rounded-full h-2">
                  <div className="bg-white rounded-full h-2 w-[94%]" />
                </div>
              </div>

              {/* Network Distribution */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-3">Mon réseau</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Pharmacies', count: 72, color: 'bg-teal-400', pct: '57%' },
                    { label: 'Hôpitaux', count: 38, color: 'bg-blue-400', pct: '30%' },
                    { label: 'Laboratoires', count: 17, color: 'bg-amber-400', pct: '13%' },
                  ].map((r) => (
                    <div key={r.label}>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{r.label}</span>
                        <span className="font-medium text-gray-700">{r.count}</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-1.5">
                        <div className={`${r.color} rounded-full h-1.5`} style={{ width: r.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Exchanges Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">Échanges récents</h2>
                  <p className="text-xs text-gray-400">Historique des derniers échanges effectués</p>
                </div>
              </div>
              <Link to="/exchange-requests" className="text-sm text-teal-500 hover:text-teal-700 font-medium transition-colors">
                Voir tout →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Médicament', 'De', 'Vers', 'Quantité', 'Statut', 'Date'].map((h) => (
                      <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentExchanges.map((ex) => (
                    <ExchangeRow key={ex.id} exchange={ex} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
