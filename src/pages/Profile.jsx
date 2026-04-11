import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, clearAuthSession } from '../lib/api';

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
    label: "Demandes d'échange", path: '/exchange-requests',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>,
  },
  {
    label: 'Mon profil', path: '/profile',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75a17.933 17.933 0 01-7.499-1.632z" /></svg>,
  },
];

const defaultProfile = {
  establishmentName: 'Pharmacie Centrale',
  establishmentType: 'pharmacie',
  registerNumber: 'DZ-PH-10294',
  responsibleName: 'Admin',
  role: 'Pharmacien Responsable',
  email: 'admin@saydalyati.dz',
  phone: '+213 661 000 000',
  wilaya: 'Alger',
  address: '12 Rue Didouche Mourad, Alger',
  description: 'Établissement spécialisé dans la distribution de médicaments essentiels.',
  logo: null,
  notifications: {
    urgentRequests: true,
    marketplaceUpdates: true,
    weeklyReport: false,
  },
};

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
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive ? 'bg-teal-500 text-white shadow-md shadow-teal-200' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
            >
              <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <button onClick={() => { clearAuthSession(); navigate('/login'); }} className="w-full text-sm bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-500 border border-gray-200 rounded-xl py-2.5 transition-colors">
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

export default function Profile() {
  const [form, setForm] = useState(defaultProfile);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiRequest('/api/profile/me');
        const p = data.profile || {};
        setForm((prev) => ({
          ...prev,
          establishmentName: p.establishmentName || prev.establishmentName,
          establishmentType: p.establishmentType || prev.establishmentType,
          responsibleName: p.fullName || prev.responsibleName,
          email: data.email || prev.email,
          phone: p.phone || '',
          wilaya: p.wilaya || '',
          address: p.address || '',
          logo: p.avatarUrl || null,
        }));
      } catch (err) {
        setMessage(err.message || 'Chargement du profil échoué');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleNotificationChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: e.target.checked },
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('/api/profile/me', {
        method: 'PATCH',
        body: JSON.stringify({
          fullName: form.responsibleName,
          establishmentName: form.establishmentName,
          establishmentType: form.establishmentType,
          phone: form.phone || null,
          wilaya: form.wilaya || null,
          address: form.address || null,
          avatarUrl: form.logo || null,
        }),
      });
      setMessage('Profil mis à jour avec succès.');
      window.setTimeout(() => setMessage(''), 2800);
    } catch (err) {
      setMessage(err.message || 'Mise à jour échouée');
    }
  };

  const savePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.next || passwordForm.next !== passwordForm.confirm) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }
    setPasswordForm({ current: '', next: '', confirm: '' });
    setMessage('Mot de passe mis à jour avec succès.');
    window.setTimeout(() => setMessage(''), 2800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePath="/profile" />

      <main className="ml-60 min-h-screen">
        <header className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-20">
          <h1 className="text-2xl font-bold text-gray-800">Mon profil</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gérez les informations de votre établissement et vos paramètres de compte</p>
        </header>

        <div className="px-8 py-6 space-y-6">
          {loading && (
            <div className="rounded-xl border border-gray-200 bg-white text-gray-600 px-4 py-3 text-sm font-medium">
              Chargement du profil...
            </div>
          )}
          {message && (
            <div className="rounded-xl border border-teal-200 bg-teal-50 text-teal-700 px-4 py-3 text-sm font-medium">
              {message}
            </div>
          )}

          <form onSubmit={saveProfile} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <section className="xl:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
              <h2 className="text-lg font-semibold text-gray-800">Informations de l'établissement</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">Nom de l'établissement</label>
                  <input value={form.establishmentName} onChange={handleChange('establishmentName')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">Type</label>
                  <select value={form.establishmentType} onChange={handleChange('establishmentType')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400">
                    <option value="pharmacie">Pharmacie</option>
                    <option value="hopital">Hôpital</option>
                    <option value="labo">Laboratoire</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">Numéro d'agrément</label>
                  <input value={form.registerNumber} onChange={handleChange('registerNumber')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">Responsable</label>
                  <input value={form.responsibleName} onChange={handleChange('responsibleName')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">Fonction</label>
                  <input value={form.role} onChange={handleChange('role')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">Email professionnel</label>
                  <input type="email" value={form.email} onChange={handleChange('email')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">Téléphone</label>
                  <input value={form.phone} onChange={handleChange('phone')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">Wilaya</label>
                  <input value={form.wilaya} onChange={handleChange('wilaya')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 mb-1.5 block">Adresse</label>
                  <input value={form.address} onChange={handleChange('address')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block">Description</label>
                <textarea rows={4} value={form.description} onChange={handleChange('description')} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>

              <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Enregistrer les modifications
              </button>
            </section>

            <section className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Photo / Logo</h3>
                <div className="flex flex-col items-center text-center">
                  {form.logo ? (
                    <img src={form.logo} alt="Logo" className="w-24 h-24 rounded-2xl object-cover border border-gray-200" />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl font-bold border border-teal-100">
                      S
                    </div>
                  )}
                  <label className="mt-4 text-sm font-medium text-teal-700 cursor-pointer hover:text-teal-800">
                    Changer le logo
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Préférences de notification</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <label className="flex items-center justify-between gap-2">
                    <span>Alertes pénuries urgentes</span>
                    <input type="checkbox" checked={form.notifications.urgentRequests} onChange={handleNotificationChange('urgentRequests')} className="w-4 h-4 accent-teal-600" />
                  </label>
                  <label className="flex items-center justify-between gap-2">
                    <span>Nouvelles annonces marketplace</span>
                    <input type="checkbox" checked={form.notifications.marketplaceUpdates} onChange={handleNotificationChange('marketplaceUpdates')} className="w-4 h-4 accent-teal-600" />
                  </label>
                  <label className="flex items-center justify-between gap-2">
                    <span>Rapport hebdomadaire</span>
                    <input type="checkbox" checked={form.notifications.weeklyReport} onChange={handleNotificationChange('weeklyReport')} className="w-4 h-4 accent-teal-600" />
                  </label>
                </div>
              </div>

              <form onSubmit={savePassword} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="text-base font-semibold text-gray-800 mb-1">Sécurité</h3>
                <input type="password" placeholder="Mot de passe actuel" value={passwordForm.current} onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                <input type="password" placeholder="Nouveau mot de passe" value={passwordForm.next} onChange={(e) => setPasswordForm((p) => ({ ...p, next: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                <input type="password" placeholder="Confirmer le mot de passe" value={passwordForm.confirm} onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                  Mettre à jour le mot de passe
                </button>
              </form>
            </section>
          </form>
        </div>
      </main>
    </div>
  );
}