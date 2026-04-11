import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';

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

const CATEGORIES = [
  'Analgésique', 'Antibiotique', 'Diabétologie', 'Anti-inflammatoire',
  'Gastro-entérologie', 'Pneumologie', 'Cardiologie', 'Neurologie',
  'Oncologie', 'Pédiatrie', 'Autre',
];

const PRIORITY_OPTIONS = [
  { value: 'Normal', label: 'Normal', sub: 'Stock en baisse', color: 'border-teal-500 bg-teal-50 text-teal-700', dot: 'bg-teal-500' },
  { value: 'Urgent', label: 'Urgent', sub: 'Besoin rapide', color: 'border-amber-400 bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
  { value: 'Critique', label: 'Critique', sub: 'Urgence absolue', color: 'border-red-500 bg-red-50 text-red-700', dot: 'bg-red-500' },
];

export default function CreateOffer() {
  const navigate = useNavigate();
  const [priority, setPriority] = useState('Normal');
  const [form, setForm] = useState({
    medName: '', category: '', quantity: '', dosage: '',
    reason: '', contactName: '', phone: '', email: '', notes: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.medName.trim()) e.medName = 'Champ requis';
    if (!form.category) e.category = 'Champ requis';
    if (!form.quantity.trim()) e.quantity = 'Champ requis';
    if (!form.contactName.trim()) e.contactName = 'Champ requis';
    if (!form.phone.trim()) e.phone = 'Champ requis';
    if (!form.email.trim()) e.email = 'Champ requis';
    return e;
  };

  // --- LOGIQUE DE CONNEXION AU SERVEUR ---
  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    
    setLoading(true);

    const dataToSend = {
      title: form.medName,
      category: form.category,
      type: 'demande',
      quantity: Number.parseInt(form.quantity, 10) || 1,
      unit: 'unités',
      urgency: priority.toLowerCase(),
      wilaya: form.contactName,
      notes: form.notes || null,
      priceDa: null,
    };

    try {
      await apiRequest('/api/listings', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Erreur réseau:", error);
      alert(error.message || "Le serveur backend ne semble pas démarré.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar activePath="/create-offer" />
        <main className="ml-60 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md px-6">
            <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-teal-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Déclaration publiée !</h2>
            <p className="text-gray-500 mb-6">Votre pénurie de <strong>{form.medName}</strong> a été enregistrée dans la base de données.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl text-sm transition-colors">
                Tableau de bord
              </button>
              <button onClick={() => { setSubmitted(false); setForm({ medName: '', category: '', quantity: '', dosage: '', reason: '', contactName: '', phone: '', email: '', notes: '' }); setImagePreview(null); }}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Nouvelle déclaration
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePath="/create-offer" />

      <main className="ml-60 min-h-screen">
        <header className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-20 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Déclarer une pénurie</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/exchange-requests')}
              className="relative w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center border border-gray-200"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
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

        <div className="max-w-3xl mx-auto px-8 py-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8">

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Déclarer une pénurie</h2>
              <p className="text-sm text-gray-400">Informez le réseau d'une pénurie de médicaments pour recevoir de l'aide rapidement.</p>
            </div>

            {/* Priority */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Niveau de priorité</p>
              <div className="grid grid-cols-3 gap-3">
                {PRIORITY_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setPriority(opt.value)}
                    className={`border-2 rounded-xl p-4 text-center transition-all ${priority === opt.value ? opt.color + ' border-current' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {priority === opt.value && <span className={`w-2 h-2 rounded-full ${opt.dot}`} />}
                      <span className="font-semibold text-sm">{opt.label}</span>
                    </div>
                    <p className="text-xs opacity-70">{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Medicine Info */}
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-700">Informations sur le médicament</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Nom du médicament *</label>
                  <input value={form.medName} onChange={handleChange('medName')} placeholder="Ex: Paracétamol 500mg"
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800 ${errors.medName ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.medName && <p className="text-xs text-red-400 mt-1">{errors.medName}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Catégorie *</label>
                  <select value={form.category} onChange={handleChange('category')}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-800 ${errors.category ? 'border-red-300' : 'border-gray-200'}`}>
                    <option value="" disabled>Sélectionner</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Quantité nécessaire *</label>
                  <input value={form.quantity} onChange={handleChange('quantity')} placeholder="Ex: 200 boîtes"
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800 ${errors.quantity ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.quantity && <p className="text-xs text-red-400 mt-1">{errors.quantity}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Dosage</label>
                  <input value={form.dosage} onChange={handleChange('dosage')} placeholder="Ex: 500mg"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-700">Informations de contact</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Ville / Pharmacie *</label>
                  <input value={form.contactName} onChange={handleChange('contactName')} placeholder="Alger / Pharmacie Centrale"
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${errors.contactName ? 'border-red-300' : 'border-gray-200'}`} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Téléphone *</label>
                  <input value={form.phone} onChange={handleChange('phone')} placeholder="+213..."
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${errors.phone ? 'border-red-300' : 'border-gray-200'}`} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Email *</label>
                  <input value={form.email} onChange={handleChange('email')} type="email" placeholder="contact@pharmacie.com"
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${errors.email ? 'border-red-300' : 'border-gray-200'}`} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button onClick={() => navigate('/dashboard')} disabled={loading}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className={`flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {loading ? 'Envoi...' : 'Publier la déclaration'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}