import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
const INITIAL_REQUESTS = [
  {
    id: 1,
    status: 'pending',
    tab: 'pending',
    medName: 'Paracétamol 500mg',
    medImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&h=120&fit=crop',
    time: 'Il y a 2 heures',
    qty: '500 comprimés',
    expiry: 'Exp. 06/2027',
    message: '"Besoin urgent pour service pédiatrie. Patient en attente."',
    requesterOrg: 'Hôpital Ibn Sina',
    requesterName: 'Dr. Fatima Zahra',
    email: 'f.zahra@ibnsina.dz',
    phone: '+213 661 234 567',
    wilaya: 'Alger',
  },
  {
    id: 2,
    status: 'pending',
    tab: 'pending',
    medName: 'Doliprane 1000mg',
    medImage: 'https://images.unsplash.com/photo-1607619662634-3ac55ec0e216?w=120&h=120&fit=crop',
    time: 'Il y a 5 heures',
    qty: '200 boîtes',
    expiry: 'Exp. 09/2026',
    message: '"Stock épuisé suite à forte demande saisonnière."',
    requesterOrg: 'Pharmacie El Amal',
    requesterName: 'Pharmacien Ahmed El Khadir',
    email: 'a.elkhadir@elamal.dz',
    phone: '+213 662 345 678',
    wilaya: 'Oran',
  },
  {
    id: 3,
    status: 'pending',
    tab: 'pending',
    medName: 'Amoxicilline 1g',
    medImage: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=120&h=120&fit=crop',
    time: 'Hier',
    qty: '100 boîtes',
    expiry: 'Exp. 12/2026',
    message: '"Besoin pour stock de sécurité. Merci d\'avance."',
    requesterOrg: 'Pharmacie du Centre',
    requesterName: 'Dr. Youssef Bennani',
    email: 'y.bennani@centre.dz',
    phone: '+213 663 456 789',
    wilaya: 'Constantine',
  },
];

const ACCEPTED_REQUESTS = [
  {
    id: 4,
    status: 'accepted',
    tab: 'accepted',
    medName: 'Oméprazole 20mg',
    medImage: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=120&h=120&fit=crop',
    time: 'Hier',
    qty: '300 gélules',
    expiry: 'Exp. 08/2026',
    message: '"Traitement en cours pour patient chronique."',
    requesterOrg: 'Clinique Ibn Rochd',
    requesterName: 'Dr. Sara Meziane',
    email: 's.meziane@ibnrochd.dz',
    phone: '+213 664 567 890',
    wilaya: 'Annaba',
    acceptedDate: 'Aujourd\'hui, 09:30',
  },
];

const SENT_ACCEPTED = [
  {
    id: 5,
    status: 'sent_accepted',
    tab: 'sent',
    medName: 'Insuline Glargine 100UI',
    medImage: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=120&h=120&fit=crop',
    time: 'Il y a 3 jours',
    qty: '50 stylos',
    expiry: 'Exp. 11/2025',
    message: '"Urgence diabétique en service réanimation."',
    requesterOrg: 'CHU Mustapha',
    requesterName: 'Dr. Karim Hadj Ali',
    email: 'k.hadjali@chu.dz',
    phone: '+213 665 678 901',
    wilaya: 'Alger',
    acceptedDate: 'Il y a 3 jours',
  },
];

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ activePath, pendingCount }) {
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
          const badge = item.path === '/exchange-requests' ? pendingCount : item.badge;
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive ? 'bg-teal-500 text-white shadow-md shadow-teal-200' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
              <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {badge > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center">{badge}</span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="px-3 pb-4">
        <div className="bg-gray-50 rounded-xl p-3 mb-2">
          <p className="text-xs font-semibold text-gray-700">Pharmacie Centrale</p>
          <p className="text-xs text-gray-400">Alger, Algérie</p>
        </div>
        <button onClick={() => navigate('/login')}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

// ── Request Card ───────────────────────────────────────────────────────────────
function RequestCard({ req, onAccept, onRefuse }) {
  const isPending = req.tab === 'pending';
  const isAccepted = req.tab === 'accepted' || req.tab === 'sent';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Top section */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Image */}
          <img src={req.medImage} alt={req.medName}
            className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-gray-100"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80/e5e7eb/9ca3af?text=💊'; }} />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-800">{req.medName}</h3>
              {isPending && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-600 flex-shrink-0">
                  En attente
                </span>
              )}
              {req.tab === 'accepted' && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 flex-shrink-0">
                  Acceptée
                </span>
              )}
              {req.tab === 'sent' && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
                  Envoyée & Acceptée
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {req.time}
              </span>
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                {req.qty}
              </span>
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                {req.expiry}
              </span>
            </div>

            {/* Message */}
            <p className="text-sm text-gray-500 italic mt-2 bg-gray-50 rounded-lg px-3 py-2 border-l-4 border-gray-200">
              {req.message}
            </p>
          </div>
        </div>

        {/* Requester + Location */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Demandé par</p>
            <p className="text-sm font-semibold text-gray-800">{req.requesterOrg}</p>
            <p className="text-xs text-gray-500">{req.requesterName}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <a href={`mailto:${req.email}`}
                className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                {req.email}
              </a>
              <a href={`tel:${req.phone}`}
                className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {req.phone}
              </a>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Localisation</p>
            <p className="text-sm text-gray-700 flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-teal-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {req.wilaya}
            </p>
            {isAccepted && req.acceptedDate && (
              <p className="text-xs text-teal-600 mt-2 flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Acceptée le {req.acceptedDate}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons — only for pending */}
      {isPending && (
        <div className="grid grid-cols-2 border-t border-gray-100">
          <button onClick={() => onAccept(req.id)}
            className="flex items-center justify-center gap-2 py-3.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Accepter la demande
          </button>
          <button onClick={() => onRefuse(req.id)}
            className="flex items-center justify-center gap-2 py-3.5 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 text-sm font-medium transition-colors border-l border-gray-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Refuser
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function ExchangeRequests() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [acceptedList, setAcceptedList] = useState(ACCEPTED_REQUESTS);
  const [sentList] = useState(SENT_ACCEPTED);

  const pendingCount = requests.length;

  const handleAccept = (id) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    setRequests(prev => prev.filter(r => r.id !== id));
    setAcceptedList(prev => [...prev, {
      ...req,
      tab: 'accepted',
      status: 'accepted',
      acceptedDate: "Aujourd'hui",
    }]);
  };

  const handleRefuse = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const tabs = [
    { key: 'pending', label: 'En attente', count: pendingCount },
    { key: 'accepted', label: 'Acceptées', count: acceptedList.length },
    { key: 'sent', label: 'Demandes envoyées acceptées', count: sentList.length },
  ];

  const currentList =
    activeTab === 'pending' ? requests :
    activeTab === 'accepted' ? acceptedList :
    sentList;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePath="/exchange-requests" pendingCount={pendingCount} />

      <main className="ml-60 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div />
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center border border-gray-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{pendingCount}</span>
              )}
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

        <div className="px-8 py-6">
          {/* Page Title + count */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Demandes d'échange</h1>
              <p className="text-sm text-gray-400 mt-0.5">Gérez les demandes reçues pour vos médicaments disponibles</p>
            </div>
            {pendingCount > 0 && (
              <div className="text-right">
                <span className="text-3xl font-bold text-amber-500">{pendingCount}</span>
                <p className="text-xs text-gray-400">En attente</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-100 shadow-sm w-fit">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-teal-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}>
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* List */}
          {currentList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mb-3 text-gray-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              <p className="font-medium text-gray-500">Aucune demande dans cet onglet</p>
              <p className="text-sm mt-1">Les nouvelles demandes apparaîtront ici</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentList.map(req => (
                <RequestCard key={req.id} req={req} onAccept={handleAccept} onRefuse={handleRefuse} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
