import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, getAuthUser } from '../lib/api';

const navItems = [
  {
    label: 'Tableau de bord', path: '/dashboard',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
  },
  {
    label: 'Tableau des échanges', path: '/marketplace',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  },
  {
    label: 'Nouvelle déclaration', path: '/create-offer',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
  },
  {
    label: "Demandes d'échange", path: '/exchange-requests',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>,
  },
];

function Sidebar({ activePath, user }) {
  const navigate = useNavigate();
  const displayName = user?.profile?.fullName || user?.email || 'Utilisateur';
  const initials = displayName[0].toUpperCase();
  const estType = user?.profile?.establishmentType || '';

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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}>
              <span className={isActive ? 'text-teal-100' : 'text-gray-400'}>{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-100">
        <button onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition">
          <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{initials}</div>
          <div className="text-left min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
            <p className="text-xs text-teal-600 capitalize">{estType}</p>
          </div>
        </button>
      </div>
    </aside>
  );
}

const CATEGORIES = [
  'Analgésique', 'Antibiotique', 'Diabétologie', 'Anti-inflammatoire',
  'Gastro-entérologie', 'Pneumologie', 'Cardiologie', 'Neurologie',
  'Oncologie', 'Pédiatrie', 'Autre',
];

const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
  'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger',
  'Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma',
  'Constantine','Médéa','Mostaganem','M\'Sila','Mascara','Ouargla','Oran','El Bayadh',
  'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued',
  'Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent',
  'Ghardaïa','Relizane',
];

const URGENCY_OPTIONS = [
  { value: 'normal',   label: 'Normal',   sub: 'Pas pressé',       activeClass: 'border-teal-500 bg-teal-50 text-teal-700',   dot: 'bg-teal-500' },
  { value: 'urgent',   label: 'Urgent',   sub: 'Besoin rapide',    activeClass: 'border-amber-400 bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
  { value: 'critique', label: 'Critique', sub: 'Urgence absolue',  activeClass: 'border-red-500 bg-red-50 text-red-700',       dot: 'bg-red-500' },
];

// Declaration type config
const DECLARATION_TYPES = [
  {
    value: 'demande',
    label: 'Pénurie',
    description: 'Vous manquez d\'un médicament et cherchez à en obtenir',
    icon: '🔴',
    color: 'border-red-400 bg-red-50 text-red-700',
    inactiveColor: 'border-gray-200 hover:border-red-200 hover:bg-red-50/50',
  },
  {
    value: 'offre',
    label: 'Surplus',
    description: 'Vous avez un excédent de médicaments à proposer en échange',
    icon: '🟢',
    color: 'border-teal-500 bg-teal-50 text-teal-700',
    inactiveColor: 'border-gray-200 hover:border-teal-200 hover:bg-teal-50/50',
  },
];

export default function CreateOffer() {
  const navigate = useNavigate();
  const currentUser = getAuthUser();

  const [declarationType, setDeclarationType] = useState('demande'); // 'demande' = pénurie, 'offre' = surplus
  const [urgency, setUrgency] = useState('normal');
  const [form, setForm] = useState({
    medName: '',
    category: '',
    quantity: '',
    unit: 'boîtes',
    wilaya: currentUser?.profile?.wilaya || '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.medName.trim()) e.medName = 'Champ requis';
    if (!form.category) e.category = 'Champ requis';
    if (!form.quantity.trim() || isNaN(Number(form.quantity))) e.quantity = 'Quantité invalide';
    if (!form.wilaya) e.wilaya = 'Champ requis';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    try {
      await apiRequest('/api/listings', {
        method: 'POST',
        body: JSON.stringify({
          title: form.medName,
          category: form.category,
          type: declarationType,           // 'demande' ou 'offre'
          quantity: Number(form.quantity),
          unit: form.unit,
          urgency,                          // 'normal', 'urgent', 'critique'
          wilaya: form.wilaya,
          notes: form.notes || null,
        }),
      });
      setSubmitted(true);
    } catch (error) {
      alert(error.message || 'Erreur lors de la publication.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setDeclarationType('demande');
    setUrgency('normal');
    setForm({ medName: '', category: '', quantity: '', unit: 'boîtes', wilaya: currentUser?.profile?.wilaya || '', notes: '' });
    setErrors({});
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    const isPenurie = declarationType === 'demande';
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar activePath="/create-offer" user={currentUser} />
        <main className="ml-64 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md px-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${isPenurie ? 'bg-red-50' : 'bg-teal-50'}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-10 h-10 ${isPenurie ? 'text-red-400' : 'text-teal-500'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-3 ${isPenurie ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-600'}`}>
              {isPenurie ? '🔴 Pénurie déclarée' : '🟢 Surplus déclaré'}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Déclaration publiée !</h2>
            <p className="text-gray-500 mb-6">
              Votre {isPenurie ? 'pénurie' : 'surplus'} de <strong>{form.medName}</strong> est maintenant visible dans le Tableau des échanges.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/marketplace')}
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl text-sm transition">
                Voir le Tableau des échanges
              </button>
              <button onClick={resetForm}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition">
                Nouvelle déclaration
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePath="/create-offer" user={currentUser} />

      <main className="ml-64 min-h-screen">
        <header className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-20">
          <h1 className="text-2xl font-bold text-gray-800">Nouvelle déclaration</h1>
          <p className="text-sm text-gray-400 mt-0.5">Déclarez une pénurie ou un surplus de médicament</p>
        </header>

        <div className="max-w-2xl mx-auto px-8 py-8 space-y-6">

          {/* ── Type de déclaration ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm font-bold text-gray-700 mb-4">Type de déclaration</p>
            <div className="grid grid-cols-2 gap-4">
              {DECLARATION_TYPES.map(dt => {
                const isActive = declarationType === dt.value;
                return (
                  <button key={dt.value} onClick={() => setDeclarationType(dt.value)}
                    className={`border-2 rounded-xl p-4 text-left transition-all ${isActive ? dt.color : dt.inactiveColor}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{dt.icon}</span>
                      <span className="font-bold text-sm">{dt.label}</span>
                      {isActive && (
                        <span className="ml-auto">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${isActive ? 'opacity-80' : 'text-gray-400'}`}>{dt.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Niveau d'urgence (seulement pour pénurie) ── */}
          {declarationType === 'demande' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-sm font-bold text-gray-700 mb-4">Niveau d'urgence</p>
              <div className="grid grid-cols-3 gap-3">
                {URGENCY_OPTIONS.map(opt => {
                  const isActive = urgency === opt.value;
                  return (
                    <button key={opt.value} onClick={() => setUrgency(opt.value)}
                      className={`border-2 rounded-xl p-4 text-center transition-all ${isActive ? opt.activeClass : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        {isActive && <span className={`w-2 h-2 rounded-full ${opt.dot}`} />}
                        <span className="font-semibold text-sm">{opt.label}</span>
                      </div>
                      <p className="text-xs opacity-70">{opt.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Informations médicament ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-sm font-bold text-gray-700">Informations sur le médicament</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Nom du médicament *
                </label>
                <input value={form.medName} onChange={handleChange('medName')}
                  placeholder="Ex: Paracétamol 500mg"
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${errors.medName ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.medName && <p className="text-xs text-red-400 mt-1">{errors.medName}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Catégorie *</label>
                <select value={form.category} onChange={handleChange('category')}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white ${errors.category ? 'border-red-300' : 'border-gray-200'}`}>
                  <option value="" disabled>Sélectionner</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Wilaya *</label>
                <select value={form.wilaya} onChange={handleChange('wilaya')}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white ${errors.wilaya ? 'border-red-300' : 'border-gray-200'}`}>
                  <option value="" disabled>Sélectionner</option>
                  {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                {errors.wilaya && <p className="text-xs text-red-400 mt-1">{errors.wilaya}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  {declarationType === 'demande' ? 'Quantité nécessaire *' : 'Quantité disponible *'}
                </label>
                <input value={form.quantity} onChange={handleChange('quantity')}
                  placeholder="Ex: 200" type="number" min="1"
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${errors.quantity ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.quantity && <p className="text-xs text-red-400 mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Unité</label>
                <select value={form.unit} onChange={handleChange('unit')}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                  {['boîtes', 'unités', 'flacons', 'ampoules', 'comprimés', 'sachets', 'tubes'].map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Notes / Précisions</label>
                <textarea value={form.notes} onChange={handleChange('notes')} rows={3}
                  placeholder={declarationType === 'demande'
                    ? 'Ex: Dosage exact, conditionnement souhaité, date limite...'
                    : 'Ex: Date de péremption, état du stock, conditionnement...'}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} disabled={loading}
              className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition">
              Annuler
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className={`flex-1 py-3 font-semibold rounded-xl text-sm transition shadow-sm text-white ${
                declarationType === 'demande'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-teal-500 hover:bg-teal-600'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? 'Publication...' : declarationType === 'demande' ? '🔴 Déclarer la pénurie' : '🟢 Déclarer le surplus'}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
