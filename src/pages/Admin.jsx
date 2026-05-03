import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, clearAuthSession, getAuthUser } from '../lib/api';

// ─── Shared Sidebar (matches Dashboard.jsx exactly) ───────────────────────────
function Sidebar({ activePath, inboxCount }) {
  const navigate = useNavigate();
  const currentUser = getAuthUser();
  const initials = (currentUser?.profile?.fullName || currentUser?.email || 'U')[0].toUpperCase();
  const displayName = currentUser?.profile?.fullName || currentUser?.email || 'Utilisateur';
  const estType = currentUser?.profile?.establishmentType || 'Administrateur';

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
      label: 'Tableau des échanges',
      path: '/marketplace',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      ),
    },
    {
      label: 'Nouvelle déclaration',
      path: '/create-offer',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
    },
    {
      label: "Demandes d'échange",
      path: '/exchange-requests',
      badge: inboxCount,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-30">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-sm">
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
          </svg>
        </div>
        <span className="text-lg font-black text-gray-900 tracking-tight uppercase">Saydalyati</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activePath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm hover:shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className={`transition-colors ${isActive ? 'text-teal-100' : 'text-gray-400'}`}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-lg bg-white/20 text-[10px] text-white font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100">
        <button
          onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors duration-200"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="text-left min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
            <p className="text-xs text-teal-600 capitalize">{estType}</p>
          </div>
        </button>
      </div>
    </aside>
  );
}

// ─── Status pill helper ────────────────────────────────────────────────────────
function statusPill(status) {
  if (status === 'pending') return 'bg-amber-100 text-amber-700';
  if (status === 'accepted' || status === 'approved') return 'bg-emerald-100 text-emerald-700';
  return 'bg-rose-100 text-rose-700';
}

const tabs = [
  { id: 'analytics', label: 'Analyse' },
  { id: 'users', label: 'Gestion utilisateurs' },
  { id: 'requests', label: 'Suivi des demandes' },
  { id: 'listings', label: 'Annonces' },
];

export default function Admin() {
  const navigate = useNavigate();
  const [currentUser] = useState(() => getAuthUser());
  const [activeTab, setActiveTab] = useState('analytics');
  const [isReady, setIsReady] = useState(false);

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    approvedUsers: 0,
    rejectedUsers: 0,
    totalListings: 0,
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
  });

  const [pendingUsers, setPendingUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [exchangeRequests, setExchangeRequests] = useState([]);
  const [listings, setListings] = useState([]);
  const [listingsSearch, setListingsSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [usersStatusFilter, setUsersStatusFilter] = useState('all');
  const [usersSearch, setUsersSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState('');

  function normalizeUsersPayload(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.users)) return payload.users;
    return [];
  }

  function normalizeRequestsPayload(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.requests)) return payload.requests;
    return [];
  }

  function normalizeAnalyticsPayload(payload) {
    if (payload?.analytics && typeof payload.analytics === 'object') return payload.analytics;
    if (payload && typeof payload === 'object') return payload;
    return {
      totalUsers: 0,
      pendingUsers: 0,
      approvedUsers: 0,
      rejectedUsers: 0,
      totalListings: 0,
      totalRequests: 0,
      pendingRequests: 0,
      acceptedRequests: 0,
    };
  }

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    let mounted = true;

    async function verifyAndLoad() {
      try {
        setLoading(true);
        setError('');

        const me = await apiRequest('/api/profile/me');
        if (!mounted) return;
        if (me.role !== 'administrator') {
          navigate('/dashboard', { replace: true });
          return;
        }

        setIsReady(true);

        const [analyticsResult, pendingResult, requestsResult, listingsResult] = await Promise.allSettled([
          apiRequest('/api/admin/analytics'),
          apiRequest('/api/admin/pending-users'),
          apiRequest('/api/admin/exchange-requests'),
          apiRequest('/api/admin/listings'),
        ]);

        if (!mounted) return;

        if (analyticsResult.status === 'fulfilled') {
          setAnalytics(normalizeAnalyticsPayload(analyticsResult.value));
        }
        if (pendingResult.status === 'fulfilled') {
          setPendingUsers(normalizeUsersPayload(pendingResult.value));
        }
        if (requestsResult.status === 'fulfilled') {
          setExchangeRequests(normalizeRequestsPayload(requestsResult.value));
        }
        if (listingsResult.status === 'fulfilled') {
          setListings(Array.isArray(listingsResult.value) ? listingsResult.value : []);
        }

        if (
          analyticsResult.status === 'rejected' ||
          pendingResult.status === 'rejected' ||
          requestsResult.status === 'rejected'
        ) {
          setError("Certaines sections admin n'ont pas pu etre chargees.");
        }
      } catch (e) {
        if (!mounted) return;
        if (e.statusCode === 401) {
          clearAuthSession();
          navigate('/login', { replace: true });
          return;
        }
        if (e.statusCode === 403) {
          navigate('/dashboard', { replace: true });
          return;
        }
        setError(e.message || 'Impossible de charger la page admin');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    verifyAndLoad();
    return () => {
      mounted = false;
    };
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!isReady) return;

    let mounted = true;

    async function loadUsers() {
      try {
        setLoadingUsers(true);
        setError('');
        const params = new URLSearchParams();
        if (usersStatusFilter !== 'all') params.set('status', usersStatusFilter);
        if (usersSearch.trim()) params.set('search', usersSearch.trim());

        const query = params.toString();
        const data = await apiRequest(`/api/admin/users${query ? `?${query}` : ''}`);
        if (!mounted) return;
        setUsers(normalizeUsersPayload(data));
        setError('');
      } catch (e) {
        if (!mounted) return;
        setError(e.message || 'Chargement des utilisateurs impossible');
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    }

    loadUsers();
    return () => { mounted = false; };
  }, [isReady, usersSearch, usersStatusFilter]);

  async function refreshCoreData() {
    const [analyticsRows, pendingRows, requestRows] = await Promise.all([
      apiRequest('/api/admin/analytics'),
      apiRequest('/api/admin/pending-users'),
      apiRequest('/api/admin/exchange-requests'),
    ]);
    setAnalytics(normalizeAnalyticsPayload(analyticsRows));
    setPendingUsers(normalizeUsersPayload(pendingRows));
    setExchangeRequests(normalizeRequestsPayload(requestRows));
    setError('');
  }

  async function refreshUsers() {
    const params = new URLSearchParams();
    if (usersStatusFilter !== 'all') params.set('status', usersStatusFilter);
    if (usersSearch.trim()) params.set('search', usersSearch.trim());
    const query = params.toString();
    const data = await apiRequest(`/api/admin/users${query ? `?${query}` : ''}`);
    setUsers(normalizeUsersPayload(data));
    setError('');
  }

  async function handleApproval(user, action) {
    try {
      if (user.isWaiting) {
        const endpoint =
          action === 'approved'
            ? `/api/admin/pending-users/${user.id}/approve`
            : `/api/admin/pending-users/${user.id}/reject`;
        await apiRequest(endpoint, { method: 'PATCH' });
      } else {
        await apiRequest(`/api/admin/users/${user.id}/approval`, {
          method: 'PATCH',
          body: JSON.stringify({ status: action }),
        });
      }
      await Promise.all([refreshCoreData(), refreshUsers()]);
    } catch (e) {
      setError(e.message || 'Mise à jour impossible');
    }
  }

  async function handleDeleteUser(userId, userEmail) {
    if (!window.confirm(`Supprimer définitivement l'utilisateur "${userEmail}" ? Cette action est irréversible.`)) return;
    try {
      await apiRequest(`/api/admin/users/${userId}`, { method: 'DELETE' });
      await Promise.all([refreshCoreData(), refreshUsers()]);
    } catch (e) {
      setError(e.message || 'Suppression impossible');
    }
  }

  const requestsCount = exchangeRequests.length;
  const latestPendingUsers = useMemo(() => pendingUsers.slice(0, 6), [pendingUsers]);
  const displayName = currentUser?.profile?.fullName || currentUser?.email || 'Admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Same sidebar as Dashboard — activePath='/dashboard' so Tableau de bord is highlighted */}
      <Sidebar activePath="/dashboard" inboxCount={0} />

      <main className="ml-64 min-h-screen">
        {/* Header — matches Dashboard admin header style */}
        <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
              <span className="text-xs font-bold bg-teal-100 text-teal-700 px-3 py-1 rounded-full">Admin</span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Espace admin avancé: analyse plateforme, validation des comptes et supervision.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-200"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              Retour au tableau de bord
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold text-sm">
                {displayName[0].toUpperCase()}
              </div>
            </button>
          </div>
        </header>

        <div className="px-8 py-6 space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>
          )}

          {/* Tabs */}
          <section className="bg-white border border-gray-100 rounded-2xl p-2 flex gap-2 w-fit shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </section>

          {/* ── Analytics Tab ── */}
          {activeTab === 'analytics' && (
            <section className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: 'Utilisateurs total', value: analytics.totalUsers, color: 'text-gray-900' },
                  { label: 'Comptes approuvés', value: analytics.approvedUsers, color: 'text-emerald-700' },
                  { label: 'Comptes en attente', value: analytics.pendingUsers, color: 'text-amber-700' },
                  { label: 'Comptes rejetés', value: analytics.rejectedUsers, color: 'text-rose-700' },
                  { label: 'Offres publiées', value: analytics.totalListings, color: 'text-gray-900' },
                  { label: 'Demandes total', value: analytics.totalRequests, color: 'text-gray-900' },
                  { label: 'Demandes en attente', value: analytics.pendingRequests, color: 'text-amber-700' },
                  { label: 'Demandes acceptées', value: analytics.acceptedRequests, color: 'text-emerald-700' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    {loading
                      ? <div className="h-8 w-16 bg-gray-100 rounded animate-pulse mt-2" />
                      : <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                    }
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-900">Validations prioritaires</h2>
                <p className="text-sm text-gray-500 mt-1">Derniers comptes en attente de validation admin.</p>
                <div className="mt-4 space-y-3">
                  {loading && <p className="text-sm text-gray-500 animate-pulse">Chargement...</p>}
                  {!loading && latestPendingUsers.length === 0 && (
                    <p className="text-sm text-gray-500">Aucun compte en attente.</p>
                  )}
                  {!loading &&
                    latestPendingUsers.map((user) => (
                      <div
                        key={user.id}
                        className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {user.profile?.establishmentName || user.profile?.fullName || user.email}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
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
                            onClick={() => handleApproval({ id: user.id, isWaiting: true }, 'approved')}
                            className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors duration-200"
                          >
                            Approuver
                          </button>
                          <button
                            onClick={() => handleApproval({ id: user.id, isWaiting: true }, 'rejected')}
                            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors duration-200"
                          >
                            Rejeter
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Users Tab ── */}
          {activeTab === 'users' && (
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="font-semibold text-gray-900">Gestion complète des utilisateurs</h2>
                <div className="flex flex-col md:flex-row gap-2">
                  <input
                    value={usersSearch}
                    onChange={(e) => setUsersSearch(e.target.value)}
                    type="text"
                    placeholder="Rechercher par email, établissement, wilaya..."
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <select
                    value={usersStatusFilter}
                    onChange={(e) => setUsersStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">Tous statuts</option>
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvés</option>
                    <option value="rejected">Rejetés</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[940px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Utilisateur', 'Email', 'Établissement', 'Statut', 'Certificat', 'Actions'].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-sm text-gray-500 animate-pulse">
                          Chargement des utilisateurs...
                        </td>
                      </tr>
                    )}
                    {!loadingUsers && users.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-sm text-gray-500">
                          Aucun utilisateur trouvé.
                        </td>
                      </tr>
                    )}
                    {!loadingUsers &&
                      users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200">
                          <td className="px-4 py-3 text-sm text-gray-800">{user.profile?.fullName || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{user.profile?.establishmentName || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusPill(user.approvalStatus)}`}>
                              {user.approvalStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {user.profile?.certificateFileData ? (
                              <a
                                href={user.profile.certificateFileData}
                                target="_blank"
                                rel="noreferrer"
                                className="text-teal-700 hover:text-teal-800 font-semibold"
                                download={user.profile?.certificateFileName || 'certificat'}
                              >
                                Ouvrir
                              </a>
                            ) : (
                              <span className="text-red-600 font-semibold">Absent</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {user.approvalStatus === 'pending' ? (
                                <>
                                  <button
                                    onClick={() => handleApproval(user, 'approved')}
                                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium transition-colors duration-200"
                                  >
                                    Approuver
                                  </button>
                                  <button
                                    onClick={() => handleApproval(user, 'rejected')}
                                    className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors duration-200"
                                  >
                                    Rejeter
                                  </button>
                                </>
                              ) : user.approvalStatus === 'approved' ? (
                                <button
                                  onClick={() => handleDeleteUser(user.id, user.email)}
                                  className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium border border-red-200 transition-colors duration-200"
                                >
                                  Supprimer
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleApproval(user, 'approved')}
                                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium transition-colors duration-200"
                                >
                                  Approuver
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ── Requests Tab ── */}
          {activeTab === 'requests' && (
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Demandes de contact / commande</h2>
                <span className="text-sm text-gray-500">{requestsCount} demandes</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Médicament', 'Propriétaire', 'Demandeur', 'Statut', 'Message', 'Date'].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {!loading && exchangeRequests.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-sm text-gray-500">
                          Aucune demande enregistrée.
                        </td>
                      </tr>
                    )}
                    {exchangeRequests.map((req) => (
                      <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200">
                        <td className="px-4 py-3 text-sm text-gray-800">{req.listing?.title || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{req.listing?.owner?.email || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{req.requester?.email || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusPill(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-[280px] truncate">
                          {req.message || 'Aucun message'}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {new Date(req.createdAt).toLocaleString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ── Listings Tab ── */}
          {activeTab === 'listings' && (
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-gray-900">Toutes les annonces</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {listings.length} annonce{listings.length !== 1 ? 's' : ''} au total
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Rechercher une annonce..."
                  value={listingsSearch}
                  onChange={(e) => setListingsSearch(e.target.value)}
                  className="w-64 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Titre', 'Type', 'Catégorie', 'Établissement', 'Wilaya', 'Date', 'Action'].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {listings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-sm text-gray-400 text-center">
                          Aucune annonce pour l'instant.
                        </td>
                      </tr>
                    )}
                    {listings
                      .filter(
                        (l) =>
                          !listingsSearch.trim() ||
                          l.title?.toLowerCase().includes(listingsSearch.toLowerCase()) ||
                          l.owner?.establishmentName?.toLowerCase().includes(listingsSearch.toLowerCase())
                      )
                      .map((listing) => (
                        <tr key={listing.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-[200px] truncate">
                            {listing.title}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                listing.type === 'offre'
                                  ? 'bg-teal-100 text-teal-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}
                            >
                              {listing.type === 'offre' ? 'Offre' : 'Demande'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{listing.category || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {listing.owner?.establishmentName || listing.owner?.email || '—'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{listing.wilaya || '—'}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">
                            {new Date(listing.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              disabled={deletingId === listing.id}
                              onClick={async () => {
                                if (!window.confirm(`Supprimer l'annonce "${listing.title}" ? Cette action est irréversible.`)) return;
                                setDeletingId(listing.id);
                                try {
                                  await apiRequest(`/api/admin/listings/${listing.id}`, { method: 'DELETE' });
                                  setListings((prev) => prev.filter((l) => l.id !== listing.id));
                                } catch (e) {
                                  alert(e.message || 'Erreur lors de la suppression');
                                } finally {
                                  setDeletingId(null);
                                }
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingId === listing.id ? (
                                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              )}
                              {deletingId === listing.id ? 'Suppression...' : 'Supprimer'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
