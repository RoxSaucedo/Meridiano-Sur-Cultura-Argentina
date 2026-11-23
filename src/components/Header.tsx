import { useState } from 'react';
import { Menu, User, X } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  userDisplayName: string | null;
  onOpenSaved: () => void;
  onOpenSuggest: () => void;
  onOpenAuth: () => void;
}

export function Header({
  savedCount,
  userDisplayName,
  onOpenSaved,
  onOpenSuggest,
  onOpenAuth,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const shortName = userDisplayName ? userDisplayName.split(' ')[0] : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#C5DCF2]">
      {/* Thin patriotic Albiceleste ribbon */}
      <div className="h-1 w-full flex" aria-hidden="true">
        <span className="flex-1 bg-[#6CB4EE]" />
        <span className="flex-1 bg-white" />
        <span className="flex-1 bg-[#6CB4EE]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Wordmark */}
        <a
          href="#inicio"
          className="font-serif text-2xl font-semibold tracking-tight text-[#0B2239] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5394] rounded-sm"
        >
          Meridiano Sur
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#3A546E]"
        >
          <a
            href="#dossiers"
            className="hover:text-[#0B2239] hover:underline underline-offset-4 decoration-[#6CB4EE] transition-colors whitespace-nowrap shrink-0"
          >
            Dossiers
          </a>
          <a
            href="#catalogo"
            className="hover:text-[#0B2239] hover:underline underline-offset-4 decoration-[#6CB4EE] transition-colors whitespace-nowrap shrink-0"
          >
            Catálogo
          </a>
          <a
            href="#rutas"
            className="hover:text-[#0B2239] hover:underline underline-offset-4 decoration-[#6CB4EE] transition-colors whitespace-nowrap shrink-0"
          >
            Rutas
          </a>
          <button
            type="button"
            onClick={onOpenSuggest}
            className="hover:text-[#0B2239] hover:underline underline-offset-4 decoration-[#6CB4EE] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sugerir obra
          </button>
          <button
            type="button"
            onClick={onOpenSaved}
            className="hover:text-[#0B2239] hover:underline underline-offset-4 decoration-[#D99B16] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Mi Lista <span className="font-mono tabular-nums text-[#0B5394]">({savedCount})</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenAuth}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#0B5394] text-white rounded-md hover:bg-[#083D6E] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0B5394] min-h-[40px]"
          >
            <User className="w-3.5 h-3.5 text-[#F5B727]" aria-hidden="true" />
            <span>{shortName ? `Cuenta · ${shortName}` : 'Crear cuenta'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 text-[#0B2239] border border-[#C5DCF2] rounded-md hover:bg-[#EAF3FB] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Navegación móvil"
          className="md:hidden border-t border-[#C5DCF2] bg-white px-4 py-4 flex flex-col gap-3 text-sm font-medium text-[#0B2239]"
        >
          <a
            href="#dossiers"
            onClick={handleLinkClick}
            className="py-2 border-b border-[#DCEBFA] hover:text-[#0B5394]"
          >
            Dossiers
          </a>
          <a
            href="#catalogo"
            onClick={handleLinkClick}
            className="py-2 border-b border-[#DCEBFA] hover:text-[#0B5394]"
          >
            Catálogo
          </a>
          <a
            href="#rutas"
            onClick={handleLinkClick}
            className="py-2 border-b border-[#DCEBFA] hover:text-[#0B5394]"
          >
            Rutas federales
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSaved();
            }}
            className="py-2 border-b border-[#DCEBFA] text-left hover:text-[#0B5394] cursor-pointer"
          >
            Mi Lista ({savedCount})
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSuggest();
            }}
            className="py-2 text-left text-[#0B5394] font-semibold cursor-pointer"
          >
            Sugerir una obra
          </button>
        </nav>
      )}
    </header>
  );
}
