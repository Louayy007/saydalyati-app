import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, clearAuthSession, getAuthUser } from '../lib/api';

const navItems = [
  { label: 'Tableau de bord', path: '/dashboard' },
  { label: 'Administration', path: '/admin' },
  { label: 'Marketplace', path: '/marketplace' },
  { label: 'Demandes', path: '/exchange-requests' },
  { label: 'Mon profil', path: '/profile' },
];

function Sidebar({ activePath }) {
  const navigate = useNavigate();
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-30">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
        <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-bold">S</div>
        <span className="text-lg font-bold text-gray-900">SAYDALYATI</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = item.path === activePath;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 pb-6">
        <button
          onClick={() => {
            clearAuthSession();
            navigate('/login');
          }}
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 text-gray-600 hover:text-red-500 hover:bg-red-50"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

function statusPill(status) {
  if (status === 'pending') return 'bg-amber-100 text-amber-700';
  if (status === 'accepted' || status === 'approved') return 'bg-emerald-100 text-emerald-700';
  return 'bg-rose-100 text-rose-700';
}

const tabs = [
  { id: 'analytics', label: 'Analyse' },
  { id: 'users', label: 'Gestion utilisateurs' },
  { id: 'requests', label: 'Suivi des demandes' },
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

        const [analyticsResult, pendingResult, requestsResult] = await Promise.allSettled([
          apiRequest('/api/admin/analytics'),
          apiRequest('/api/admin/pending-users'),
          apiRequest('/api/admin/exchange-requests'),
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

        if (analyticsResult.status === 'rejected' || pendingResult.status === 'rejected' || requestsResult.status === 'rejected') {
          setError('Certaines sections admin n\'ont pas pu etre chargees.');
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
        if (usersStatusFilter !== 'all') {
          params.set('status', usersStatusFilter);
        }
        if (usersSearch.trim()) {
          params.set('search', usersSearch.trim());
        }

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

    return () => {
      mounted = false;
    };
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
    if (usersStatusFilter !== 'all') {
      params.set('status', usersStatusFilter);
    }
    if (usersSearch.trim()) {
      params.set('search', usersSearch.trim());
    }
    const query = params.toString();
    const data = await apiRequest(`/api/admin/users${query ? `?${query}` : ''}`);
    setUsers(normalizeUsersPayload(data));
    setError('');
  }

  async function handleApproval(userId, status) {
    try {
      await apiRequest(`/api/admin/users/${userId}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await Promise.all([refreshCoreData(), refreshUsers()]);
    } catch (e) {
      setError(e.message || 'Mise à jour impossible');
    }
  }

  const requestsCount = exchangeRequests.length;
  const latestPendingUsers = useMemo(() => pendingUsers.slice(0, 6), [pendingUsers]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePath="/admin" />

      <main className="ml-64 min-h-screen">
        <header className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-20">
          <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
          <p className="text-sm text-gray-500 mt-1">Espace admin avancé: analyse plateforme, validation des comptes et supervision.</p>
        </header>

        <div className="px-8 py-6 space-y-6">
          {error && <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>}

          <section className="bg-white border border-gray-100 rounded-2xl p-2 flex gap-2 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  activeTab === tab.id ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </section>

          {activeTab === 'analytics' && (
            <section className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">Utilisateurs total</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalUsers}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">Comptes approuvés</p>
                  <p className="text-3xl font-bold text-emerald-700 mt-2">{analytics.approvedUsers}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">Comptes en attente</p>
                  <p className="text-3xl font-bold text-amber-700 mt-2">{analytics.pendingUsers}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">Comptes rejetés</p>
                  <p className="text-3xl font-bold text-rose-700 mt-2">{analytics.rejectedUsers}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">Offres publiées</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalListings}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">Demandes total</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalRequests}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">Demandes en attente</p>
                  <p className="text-3xl font-bold text-amber-700 mt-2">{analytics.pendingRequests}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">Demandes acceptées</p>
                  <p className="text-3xl font-bold text-emerald-700 mt-2">{analytics.acceptedRequests}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h2 className="font-semibold text-gray-900">Validations prioritaires</h2>
                <p className="text-sm text-gray-500 mt-1">Derniers comptes en attente de validation admin.</p>
                <div className="mt-4 space-y-3">
                  {loading && <p className="text-sm text-gray-500">Chargement...</p>}
                  {!loading && latestPendingUsers.length === 0 && <p className="text-sm text-gray-500">Aucun compte en attente.</p>}
                  {!loading &&
                    latestPendingUsers.map((user) => (
                      <div key={user.id} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.profile?.establishmentName || user.profile?.fullName || user.email}</p>
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
                            onClick={() => handleApproval(user.id, 'approved')}
                            className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium"
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
              </div>
            </section>
          )}

          {activeTab === 'users' && (
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="font-semibold text-gray-900">Gestion complète des utilisateurs</h2>
                <div className="flex flex-col md:flex-row gap-2">
                  <input
                    value={usersSearch}
                    onChange={(e) => setUsersSearch(e.target.value)}
                    type="text"
                    placeholder="Rechercher par email, établissement, wilaya..."
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                  <select
                    value={usersStatusFilter}
                    onChange={(e) => setUsersStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
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
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Utilisateur</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Email</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Établissement</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Statut</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Certificat</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-sm text-gray-500">
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
                        <tr key={user.id} className="border-b border-gray-50">
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
                              <button
                                onClick={() => handleApproval(user.id, 'approved')}
                                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium"
                              >
                                Approuver
                              </button>
                              <button
                                onClick={() => handleApproval(user.id, 'rejected')}
                                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium"
                              >
                                Rejeter
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'requests' && (
            <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Demandes de contact / commande</h2>
                <span className="text-sm text-gray-500">{requestsCount} demandes</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Médicament</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Propriétaire</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Demandeur</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Statut</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Message</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading && exchangeRequests.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-sm text-gray-500">Aucune demande enregistrée.</td>
                      </tr>
                    )}
                    {exchangeRequests.map((req) => (
                      <tr key={req.id} className="border-b border-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">{req.listing?.title || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{req.listing?.owner?.email || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{req.requester?.email || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusPill(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-[280px] truncate">{req.message || 'Aucun message'}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{new Date(req.createdAt).toLocaleString('fr-FR')}</td>
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
