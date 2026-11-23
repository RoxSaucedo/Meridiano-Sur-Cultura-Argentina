import { CultureCategory } from '../types/culture';

interface FooterProps {
  onSelectCategory: (cat: CultureCategory) => void;
  onOpenSaved: () => void;
  onOpenAuth: () => void;
  isAuthenticated: boolean;
}

export function Footer({
  onSelectCategory,
  onOpenSaved,
  onOpenAuth,
  isAuthenticated,
}: FooterProps) {
  return (
    <footer className="bg-white py-12 lg:py-16 text-sm text-[#3A546E]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#DCEBFA]">
          <div className="md:col-span-6">
            <div className="flex items-center gap-2.5">
              <svg
                className="w-5 h-5 text-[#D99B16] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4.5" fill="currentColor" />
                <path
                  d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <p className="font-serif text-2xl font-semibold text-[#0B2239]">Meridiano Sur</p>
            </div>
            <p className="mt-3 text-sm text-[#3A546E] max-w-md leading-relaxed">
              Publicación curatorial independiente dedicada a difundir literatura, cine nacional,
              teatro, música y espacios culturales de toda la República Argentina. Acceso abierto y
              cuentas gratuitas.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0B5394] mb-3">
              Disciplinas
            </p>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('libros')}
                  className="hover:text-[#0B5394] transition-colors cursor-pointer"
                >
                  Literatura y Crónica
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('cine')}
                  className="hover:text-[#0B5394] transition-colors cursor-pointer"
                >
                  Cine Nacional
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('teatro')}
                  className="hover:text-[#0B5394] transition-colors cursor-pointer"
                >
                  Escena Teatral
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('musica')}
                  className="hover:text-[#0B5394] transition-colors cursor-pointer"
                >
                  Música y Discos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('espacios')}
                  className="hover:text-[#0B5394] transition-colors cursor-pointer"
                >
                  Arte y Espacios
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0B5394] mb-3">
              Tu Archivo
            </p>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="hover:text-[#0B5394] transition-colors cursor-pointer font-medium"
                >
                  {isAuthenticated ? 'Mi cuenta gratuita' : 'Crear cuenta gratuita'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSaved}
                  className="hover:text-[#0B5394] transition-colors cursor-pointer"
                >
                  Abrir Mi Lista Cultural
                </button>
              </li>
              <li>
                <a href="#rutas" className="hover:text-[#0B5394] transition-colors">
                  Rutas Federales
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#526D88]">
          <p>© {new Date().getFullYear()} Meridiano Sur · Cultura Argentina.</p>
          <p>Buenos Aires, Córdoba, Rosario y todas las provincias argentinas.</p>
        </div>
      </div>
    </footer>
  );
}
