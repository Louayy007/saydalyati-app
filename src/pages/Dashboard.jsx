import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest, getAuthUser } from '../lib/api';

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ activePath, inboxCount, user, isAdmin }) {
  const navigate = useNavigate();
  const initials = (user?.profile?.fullName || user?.email || 'U')[0].toUpperCase();
  const displayName = user?.profile?.fullName || user?.email || 'Utilisateur';
  const estType = user?.profile?.establishmentType || (isAdmin ? 'Administrateur' : '');

  const navItems = [
    {
      label: 'Tableau de bord',
      path: '/dashboard',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
    },
    {
      label: 'Tableau des échanges',
      path: '/marketplace',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
    },
    {
      label: 'Nouvelle déclaration',
      path: '/create-offer',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
    },
    {
      label: "Demandes d'échange",
      path: '/exchange-requests',
      badge: inboxCount,
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>,
    },
    ...(isAdmin ? [{
      label: 'Administration',
      path: '/admin',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M3.75 6h.008v.008H3.75V6zm0 6h.008v.008H3.75V12zm0 6h.008v.008H3.75V18z" /></svg>,
    }] : []),
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
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive 
                  ? 'bg-teal-600 text-white shadow-sm hover:shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}>
              <span className={`transition-colors ${isActive ? 'text-teal-100' : 'text-gray-400'}`}>{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-lg bg-white/20 text-[10px] text-white font-bold">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100">
        <button onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors duration-200">
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

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, colorClass, bgClass, icon, loading }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-default">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass} transition-transform duration-200`}>{icon}</div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{sub}</span>
      </div>
      {loading
        ? <div className="h-8 w-16 bg-gray-100 rounded animate-pulse mt-1" />
        : <p className="text-3xl font-black text-gray-900 tracking-tight">{value ?? '—'}</p>
      }
      <p className="text-sm text-gray-500 mt-2">{label}</p>
    </div>
  );
}

// ─── Urgency Badge ────────────────────────────────────────────────────────────
function UrgencyBadge({ level }) {
  const map = {
    critique: ['bg-red-100 text-red-600', 'Critique'],
    urgent:   ['bg-amber-100 text-amber-600', 'Urgent'],
    normal:   ['bg-gray-100 text-gray-500', 'Normal'],
  };
  const [cls, label] = map[level] || map.normal;
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>{label}</span>;
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const [analyticsData, pendingData, requestsData] = await Promise.all([
          apiRequest('/api/admin/analytics'),
          apiRequest('/api/admin/pending-users'),
          apiRequest('/api/admin/exchange-requests'),
        ]);
        if (!mounted) return;
        setAnalytics(analyticsData);
        setPendingUsers(Array.isArray(pendingData) ? pendingData : []);
        setRecentRequests(Array.isArray(requestsData) ? requestsData.slice(0, 5) : []);
      } catch (err) {
        if (mounted) setError(err.message || 'Erreur de chargement');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function handleApproval(userId, status) {
    try {
      await apiRequest(`/api/admin/users/${userId}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      // refresh analytics count
      setAnalytics(prev => prev ? {
        ...prev,
        pendingUsers: prev.pendingUsers - 1,
        approvedUsers: status === 'approved' ? prev.approvedUsers + 1 : prev.approvedUsers,
        rejectedUsers: status === 'rejected' ? prev.rejectedUsers + 1 : prev.rejectedUsers,
      } : prev);
    } catch (err) {
      setError(err.message || 'Mise à jour impossible');
    }
  }

  const displayName = user?.profile?.fullName || user?.email || 'Admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePath="/dashboard" inboxCount={0} user={user} isAdmin={true} />
      <main className="ml-64 min-h-screen">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <span className="text-xs font-bold bg-teal-100 text-teal-700 px-3 py-1 rounded-full">Admin</span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">Vue globale de la plateforme, {displayName}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-200 shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M3.75 6h.008v.008H3.75V6zm0 6h.008v.008H3.75V12zm0 6h.008v.008H3.75V18z" />
              </svg>
              Gestion Admin
            </button>
            <button onClick={() => navigate('/profile')}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-gray-100 transition-colors duration-200">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold text-sm">
                {displayName[0].toUpperCase()}
              </div>
            </button>
          </div>
        </header>

        <div className="px-8 py-8 space-y-8">
          {error && <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700 font-medium">{error}</div>}

          {/* ── Stats globales ── */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Utilisateurs</h2>
            <div className="grid grid-cols-4 gap-5">
              <StatCard label="Total utilisateurs" value={analytics?.totalUsers} sub="Plateforme" loading={loading}
                colorClass="text-teal-600" bgClass="bg-teal-50"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
              />
              <StatCard label="En attente" value={analytics?.pendingUsers} sub="À valider" loading={loading}
                colorClass="text-amber-500" bgClass="bg-amber-50"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <StatCard label="Approuvés" value={analytics?.approvedUsers} sub="Actifs" loading={loading}
                colorClass="text-green-600" bgClass="bg-green-50"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <StatCard label="Rejetés" value={analytics?.rejectedUsers} sub="Refusés" loading={loading}
                colorClass="text-red-500" bgClass="bg-red-50"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Annonces & Échanges</h2>
            <div className="grid grid-cols-4 gap-5">
              <StatCard label="Total annonces" value={analytics?.totalListings} sub="Plateforme" loading={loading}
                colorClass="text-blue-500" bgClass="bg-blue-50"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" /></svg>}
              />
              <StatCard label="Total échanges" value={analytics?.totalRequests} sub="Toutes" loading={loading}
                colorClass="text-purple-500" bgClass="bg-purple-50"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>}
              />
              <StatCard label="Échanges en attente" value={analytics?.pendingRequests} sub="À traiter" loading={loading}
                colorClass="text-amber-500" bgClass="bg-amber-50"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <StatCard label="Échanges acceptés" value={analytics?.acceptedRequests} sub="Réussis" loading={loading}
                colorClass="text-green-600" bgClass="bg-green-50"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
            </div>
          </div>

          {/* ── Two columns ── */}
          <div className="grid grid-cols-3 gap-6">

            {/* Comptes en attente de validation */}
            <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-sm">Comptes en attente</h2>
                    <p className="text-xs text-gray-500">Nouvelles inscriptions à valider</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                    {pendingUsers.length} en attente
                  </span>
                  <Link to="/admin" className="text-sm text-teal-600 hover:text-teal-700 font-semibold transition">
                    Voir tout →
                  </Link>
                </div>
              </div>

              <div className="p-5">
                {loading && (
                  <div className="space-y-3">
                    {[1,2].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
                  </div>
                )}
                {!loading && pendingUsers.length === 0 && (
                  <div className="text-center py-12 text-sm text-gray-400">
                    ✅ Aucun compte en attente de validation
                  </div>
                )}
                {!loading && pendingUsers.length > 0 && (
                  <div className="space-y-3">
                    {pendingUsers.slice(0, 4).map(u => (
                      <div key={u.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-4 hover:bg-gray-50 hover:border-gray-200 transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-sm shrink-0">
                            {(u.profile?.fullName || u.email)[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {u.profile?.establishmentName || u.profile?.fullName || u.email}
                            </p>
                            <p className="text-xs text-gray-500">
                              {u.email} · <span className="capitalize">{u.profile?.establishmentType || 'N/A'}</span>
                              {u.profile?.wilaya ? ` · ${u.profile.wilaya}` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => handleApproval(u.id, 'approved')}
                            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors duration-200">
                            Approuver
                          </button>
                          <button onClick={() => handleApproval(u.id, 'rejected')}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors duration-200">
                            Rejeter
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions admin */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
                <h3 className="font-semibold text-gray-900 text-sm mb-4">Actions rapides</h3>
                <div className="space-y-2">
                  <button onClick={() => navigate('/admin')}
                    className="flex items-center gap-3 w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors duration-200 shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M3.75 6h.008v.008H3.75V6zm0 6h.008v.008H3.75V12zm0 6h.008v.008H3.75V18z" />
                    </svg>
                    Panneau d'administration
                  </button>
                  <button onClick={() => navigate('/marketplace')}
                    className="flex items-center gap-3 w-full bg-gray-50 hover:bg-gray-100 text-gray-800 text-sm font-semibold px-4 py-3 rounded-xl transition-colors duration-200 border border-gray-200 hover:border-gray-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-teal-600 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    Voir le Tableau des échanges
                  </button>
                </div>
              </div>

              {/* Taux d'approbation */}
              {!loading && analytics && (
                <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <p className="text-sm font-medium text-teal-100 mb-2">Taux d'approbation</p>
                  {analytics.totalUsers > 0 ? (
                    <>
                      <p className="text-4xl font-bold">
                        {Math.round((analytics.approvedUsers / analytics.totalUsers) * 100)}%
                      </p>
                      <p className="text-xs text-teal-200 mt-1">
                        {analytics.approvedUsers} approuvés / {analytics.totalUsers} total
                      </p>
                      <div className="mt-4 bg-teal-500/40 rounded-full h-2">
                        <div className="bg-white rounded-full h-2 transition-all duration-500"
                          style={{ width: `${Math.round((analytics.approvedUsers / analytics.totalUsers) * 100)}%` }} />
                      </div>
                    </>
                  ) : (
                    <p className="text-teal-200 text-sm mt-2">Aucun utilisateur encore</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Échanges récents */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm">Échanges récents (plateforme)</h2>
                  <p className="text-xs text-gray-500">Les 5 dernières demandes d'échange</p>
                </div>
              </div>
            </div>
            {loading ? (
              <div className="p-6 text-center text-sm text-gray-400 animate-pulse">Chargement...</div>
            ) : recentRequests.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">Aucun échange pour l'instant</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      {['Médicament', 'Propriétaire', 'Demandeur', 'Statut', 'Date'].map(h => (
                        <th key={h} className="py-3.5 px-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map(req => {
                      const statusStyle = { pending: 'bg-amber-100 text-amber-700', accepted: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-600' }[req.status] || 'bg-gray-100 text-gray-600';
                      const statusLabel = { pending: 'En attente', accepted: 'Accepté', rejected: 'Rejeté' }[req.status] || req.status;
                      return (
                        <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200">
                          <td className="py-4 px-5 text-sm font-medium text-gray-900">{req.listing?.title || '—'}</td>
                          <td className="py-4 px-5 text-sm text-gray-600">{req.listing?.owner?.establishmentName || req.listing?.owner?.email || '—'}</td>
                          <td className="py-4 px-5 text-sm text-gray-600">{req.requester?.establishmentName || req.requester?.email || '—'}</td>
                          <td className="py-4 px-5">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle}`}>{statusLabel}</span>
                          </td>
                          <td className="py-4 px-5 text-xs text-gray-500">
                            {new Date(req.createdAt).toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short' })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

// ─── USER DASHBOARD ───────────────────────────────────────────────────────────
function UserDashboard({ user }) {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [inboxRequests, setInboxRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const [listingsData, inboxData, sentData] = await Promise.all([
          apiRequest('/api/listings'),
          apiRequest('/api/exchange-requests/inbox'),
          apiRequest('/api/exchange-requests/sent'),
        ]);
        if (!mounted) return;
        setListings(Array.isArray(listingsData) ? listingsData : []);
        setInboxRequests(Array.isArray(inboxData) ? inboxData : []);
        setSentRequests(Array.isArray(sentData) ? sentData : []);
      } catch (err) {
        if (mounted) setError(err.message || 'Erreur de chargement');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const urgentListings = listings.filter(l => l.urgency === 'urgent' || l.urgency === 'critique');
  const pendingInbox = inboxRequests.filter(r => r.status === 'pending');
  const acceptedRequests = [...inboxRequests, ...sentRequests].filter(r => r.status === 'accepted');
  const myListings = listings.filter(l => l.owner?.userId === user?.id);
  const displayName = user?.profile?.fullName || user?.email || 'Utilisateur';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePath="/dashboard" inboxCount={pendingInbox.length} user={user} isAdmin={false} />
      <main className="ml-64 min-h-screen">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-sm text-gray-500 mt-0.5">Bonjour, {displayName} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/exchange-requests')}
              className="relative w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors duration-200 border border-gray-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {pendingInbox.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {pendingInbox.length}
                </span>
              )}
            </button>
            <button onClick={() => navigate('/profile')}
              className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors duration-200">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold text-sm">
                {displayName[0].toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900 leading-none">{displayName}</p>
                <p className="text-xs text-teal-600 mt-0.5 capitalize">{user?.profile?.establishmentType || ''}</p>
              </div>
            </button>
          </div>
        </header>

        <div className="px-8 py-8 space-y-8">
          {error && <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700 font-medium">{error}</div>}

          {/* Stats */}
          <div className="grid grid-cols-4 gap-5">
            <StatCard label="Mes annonces" value={myListings.length} sub="Total" loading={loading}
              colorClass="text-teal-600" bgClass="bg-teal-50"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" /></svg>}
            />
            <StatCard label="Demandes reçues" value={inboxRequests.length} sub="Total" loading={loading}
              colorClass="text-blue-500" bgClass="bg-blue-50"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
            />
            <StatCard label="En attente" value={pendingInbox.length} sub="À traiter" loading={loading}
              colorClass="text-amber-500" bgClass="bg-amber-50"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard label="Échanges acceptés" value={acceptedRequests.length} sub="Réussis" loading={loading}
              colorClass="text-green-600" bgClass="bg-green-50"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Annonces urgentes */}
            <div className="col-span-2 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-sm">Annonces urgentes</h2>
                    <p className="text-xs text-gray-500">Médicaments nécessitant une action rapide</p>
                  </div>
                </div>
                <Link to="/marketplace" className="text-sm text-teal-600 hover:text-teal-700 font-semibold transition">Voir tout →</Link>
              </div>
              <div className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-1/3" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))
                ) : urgentListings.length === 0 ? (
                  <div className="px-6 py-10 text-center text-sm text-gray-400">Aucune annonce urgente 🎉</div>
                ) : (
                  urgentListings.slice(0, 5).map(item => (
                    <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-amber-50 flex items-center justify-center shrink-0 text-2xl">💊</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{item.title}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400 flex-wrap">
                          {item.owner?.establishmentName && <span>{item.owner.establishmentName}</span>}
                          {item.wilaya && <span>📍 {item.wilaya}</span>}
                          <span>{item.quantity} {item.unit}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <UrgencyBadge level={item.urgency} />
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.type === 'offre' ? 'bg-teal-50 text-teal-600' : 'bg-orange-50 text-orange-600'}`}>
                          {item.type === 'offre' ? 'Offre' : 'Demande'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 text-sm mb-4">Actions rapides</h3>
                <div className="space-y-2">
                  <Link to="/create-offer" className="flex items-center gap-3 w-full bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-4 py-3 rounded-xl transition">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Nouvelle déclaration
                  </Link>
                  <Link to="/marketplace" className="flex items-center gap-3 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium px-4 py-3 rounded-xl transition border border-gray-200">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-teal-500 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                    Parcourir le Tableau des échanges
                  </Link>
                  <Link to="/exchange-requests" className="flex items-center gap-3 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium px-4 py-3 rounded-xl transition border border-gray-200">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-teal-500 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                    Mes demandes d'échange
                    {pendingInbox.length > 0 && (
                      <span className="ml-auto w-5 h-5 bg-amber-400 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">{pendingInbox.length}</span>
                    )}
                  </Link>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-5 text-white shadow-md">
                <p className="text-sm font-medium text-teal-100 mb-3">Résumé des échanges</p>
                {loading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-teal-400/40 rounded" />
                    <div className="h-4 bg-teal-400/40 rounded w-3/4" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-teal-100">Offres actives</span><span className="font-bold">{listings.filter(l=>l.type==='offre').length}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-teal-100">Demandes actives</span><span className="font-bold">{listings.filter(l=>l.type==='demande').length}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-teal-100">Urgents</span><span className="font-bold text-amber-300">{urgentListings.length}</span></div>
                    <div className="mt-3 pt-3 border-t border-teal-400/30 flex justify-between text-sm">
                      <span className="text-teal-100">Total annonces</span>
                      <span className="font-black text-lg">{listings.length}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Demandes reçues */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 text-sm">Mes demandes reçues</h2>
                  <p className="text-xs text-gray-400">Les dernières demandes sur vos annonces</p>
                </div>
              </div>
              <Link to="/exchange-requests" className="text-sm text-teal-500 hover:text-teal-700 font-medium">Voir tout →</Link>
            </div>
            {loading ? (
              <div className="p-6 text-center text-sm text-gray-400 animate-pulse">Chargement...</div>
            ) : inboxRequests.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-gray-400">
                Aucune demande reçue pour l'instant.<br />
                <Link to="/create-offer" className="text-teal-500 hover:underline mt-1 inline-block">Créer une annonce →</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Médicament', 'Demandeur', 'Message', 'Statut', 'Date'].map(h => (
                        <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inboxRequests.slice(0, 5).map(req => {
                      const statusStyle = { pending: 'bg-amber-100 text-amber-600', accepted: 'bg-green-100 text-green-600', rejected: 'bg-red-100 text-red-500' }[req.status] || 'bg-gray-100 text-gray-500';
                      const statusLabel = { pending: 'En attente', accepted: 'Accepté', rejected: 'Rejeté' }[req.status] || req.status;
                      return (
                        <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                          <td className="py-3 px-4 text-sm font-medium text-gray-800">{req.listing?.title || '—'}</td>
                          <td className="py-3 px-4 text-sm text-gray-500">{req.requester?.establishmentName || req.requester?.fullName || req.requester?.email || '—'}</td>
                          <td className="py-3 px-4 text-sm text-gray-400 max-w-xs truncate">{req.message || <span className="italic">Aucun message</span>}</td>
                          <td className="py-3 px-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle}`}>{statusLabel}</span></td>
                          <td className="py-3 px-4 text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short' })}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Router Component ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const currentUser = getAuthUser();
  const isAdmin = currentUser?.role === 'administrator';
  return isAdmin
    ? <AdminDashboard user={currentUser} />
    : <UserDashboard user={currentUser} />;
}
