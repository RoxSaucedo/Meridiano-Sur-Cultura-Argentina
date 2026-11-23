import { FormEvent, useEffect, useState } from 'react';
import { LogOut, UserCheck, X } from 'lucide-react';
import { User } from 'firebase/auth';
import { CultureCategory, UserProfile } from '../types/culture';

interface AuthModalProps {
  isOpen: boolean;
  user: User | null;
  profile: UserProfile | null;
  authLoading: boolean;
  authError: string;
  onClose: () => void;
  onGoogleSignIn: () => Promise<void>;
  onSaveProfile: (displayName: string, province: string, favoriteDiscipline: CultureCategory) => Promise<void>;
  onSignOut: () => Promise<void>;
}

const ARGENTINE_PROVINCES = [
  'CABA',
  'Buenos Aires',
  'Córdoba',
  'Santa Fe',
  'Mendoza',
  'Tucumán',
  'Salta',
  'Entre Ríos',
  'Neuquén',
  'Río Negro',
  'Misiones',
  'Chaco',
  'Corrientes',
  'San Juan',
  'Jujuy',
  'Otra provincia / Exterior',
];

export function AuthModal({
  isOpen,
  user,
  profile,
  authLoading,
  authError,
  onClose,
  onGoogleSignIn,
  onSaveProfile,
  onSignOut,
}: AuthModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [province, setProvince] = useState('CABA');
  const [favoriteDiscipline, setFavoriteDiscipline] = useState<CultureCategory>('libros');
  const [saving, setSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState('');

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setProvince(profile.province);
      setFavoriteDiscipline(profile.favoriteDiscipline);
    } else if (user) {
      setDisplayName(user.displayName || user.email?.split('@')[0] || 'Lector argentino');
    }
  }, [profile, user]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmitProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setSaving(true);
    setSavedFeedback('');
    try {
      await onSaveProfile(displayName.trim(), province, favoriteDiscipline);
      setSavedFeedback('Perfil guardado en tu cuenta.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2239]/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white border border-[#B4D2EE] rounded-sm shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Albiceleste top stripe */}
        <div className="h-1.5 w-full flex" aria-hidden="true">
          <span className="flex-1 bg-[#6CB4EE]" />
          <span className="flex-1 bg-white" />
          <span className="flex-1 bg-[#6CB4EE]" />
        </div>

        <div className="px-6 py-4 border-b border-[#DCEBFA] flex items-center justify-between gap-4 bg-[#F5F9FD]">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#0B5394] font-semibold">
              Acceso Libre y Gratuito
            </p>
            <h2 id="account-modal-title" className="font-serif text-2xl font-semibold text-[#0B2239]">
              {user ? 'Tu cuenta en Meridiano Sur' : 'Creá tu cuenta gratuita'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de cuenta"
            className="p-2 text-[#3A546E] hover:text-[#0B2239] rounded-sm cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {authError && (
            <p
              role="alert"
              className="mb-4 p-3 text-xs font-medium text-[#991B1B] bg-[#FEE2E2]/70 border border-[#FCA5A5] rounded-sm"
            >
              {authError}
            </p>
          )}

          {!user ? (
            <div className="space-y-5">
              <p className="text-sm text-[#3A546E] leading-relaxed">
                Registrarte es 100% gratuito y te permite guardar tu lista cultural en cualquier
                dispositivo, conservar tus notas personales y sumar obras al archivo comunitario.
              </p>

              <ul className="border-y border-[#DCEBFA] divide-y divide-[#DCEBFA] text-xs text-[#0B2239]">
                <li className="py-2.5 flex items-center justify-between">
                  <span>Mi Lista Cultural sincronizada</span>
                  <span className="font-medium text-[#0B5394]">Incluido gratis</span>
                </li>
                <li className="py-2.5 flex items-center justify-between">
                  <span>Notas personales de lectura y sala</span>
                  <span className="font-medium text-[#0B5394]">Incluido gratis</span>
                </li>
                <li className="py-2.5 flex items-center justify-between">
                  <span>Publicar recomendaciones argentinas</span>
                  <span className="font-medium text-[#0B5394]">Incluido gratis</span>
                </li>
              </ul>

              <button
                type="button"
                disabled={authLoading}
                onClick={onGoogleSignIn}
                className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 text-sm font-semibold bg-[#0B5394] text-white rounded-md hover:bg-[#083D6E] disabled:opacity-60 transition-colors cursor-pointer min-h-[44px]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                  />
                </svg>
                <span>
                  {authLoading ? 'Conectando...' : 'Crear cuenta o ingresar gratis con Google'}
                </span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitProfile} className="space-y-4">
              <div className="p-3.5 bg-[#EAF3FB] border border-[#C5DCF2] rounded-sm flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#0B5394] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Cuenta activa y gratuita</span>
                  </p>
                  <p className="text-xs text-[#3A546E] truncate mt-0.5">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0B2239] bg-white border border-[#C5DCF2] rounded-sm hover:border-[#0B5394] cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Salir</span>
                </button>
              </div>

              <div>
                <label htmlFor="acc-name" className="block text-xs font-medium text-[#3A546E] mb-1">
                  Nombre público en el archivo
                </label>
                <input
                  id="acc-name"
                  type="text"
                  required
                  maxLength={80}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#C5DCF2] rounded-sm text-[#0B2239] focus:outline-none focus:border-[#0B5394]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="acc-prov" className="block text-xs font-medium text-[#3A546E] mb-1">
                    Provincia o ciudad
                  </label>
                  <select
                    id="acc-prov"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#C5DCF2] rounded-sm text-[#0B2239] focus:outline-none focus:border-[#0B5394]"
                  >
                    {ARGENTINE_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="acc-disc" className="block text-xs font-medium text-[#3A546E] mb-1">
                    Disciplina favorita
                  </label>
                  <select
                    id="acc-disc"
                    value={favoriteDiscipline}
                    onChange={(e) => setFavoriteDiscipline(e.target.value as CultureCategory)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#C5DCF2] rounded-sm text-[#0B2239] focus:outline-none focus:border-[#0B5394]"
                  >
                    <option value="libros">Libros</option>
                    <option value="cine">Cine</option>
                    <option value="teatro">Teatro</option>
                    <option value="musica">Música</option>
                    <option value="espacios">Arte y Espacios</option>
                  </select>
                </div>
              </div>

              {savedFeedback && (
                <p className="text-xs font-medium text-[#0B5394]">{savedFeedback}</p>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#3A546E] hover:text-[#0B2239] cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 text-xs font-semibold bg-[#0B5394] text-white rounded-md hover:bg-[#083D6E] disabled:opacity-60 transition-colors cursor-pointer min-h-[40px]"
                >
                  {saving ? 'Guardando...' : 'Guardar perfil'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
