import { ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/cultureCatalog';
import { CultureCategory } from '../types/culture';
import { EditorialImage } from './EditorialImage';

interface EditorialHeroProps {
  countsByCategory: Record<CultureCategory, number>;
  isAuthenticated: boolean;
  onSelectCategoryAndScroll: (category: CultureCategory) => void;
  onOpenAuth: () => void;
}

export function EditorialHero({
  countsByCategory,
  isAuthenticated,
  onSelectCategoryAndScroll,
  onOpenAuth,
}: EditorialHeroProps) {
  const overviewCards: {
    index: string;
    category: CultureCategory;
    title: string;
    subtitle: string;
    count: number;
  }[] = [
    {
      index: '01',
      category: 'libros',
      title: 'Literatura y Crónica',
      subtitle: 'Borges, Cortázar, Enríquez y Walsh',
      count: countsByCategory.libros,
    },
    {
      index: '02',
      category: 'cine',
      title: 'Cine Nacional',
      subtitle: 'Del policial porteño al norte de Martel',
      count: countsByCategory.cine,
    },
    {
      index: '03',
      category: 'teatro',
      title: 'Escena Teatral',
      subtitle: 'Circuito independiente, Corrientes y Colón',
      count: countsByCategory.teatro,
    },
    {
      index: '04',
      category: 'espacios',
      title: 'Museos, Libros y Música',
      subtitle: 'MALBA, Grand Splendid, Piazzolla y Rock',
      count: countsByCategory.musica + countsByCategory.espacios,
    },
  ];

  return (
    <section id="inicio" className="border-b border-[#C5DCF2] bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-10 pb-12 lg:pt-14 lg:pb-16">
        {/* 2-Column Editorial Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              {/* Kicker with subtle Sol de Mayo golden emblem */}
              <div className="flex items-center gap-2.5 mb-4">
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
                <p className="text-xs font-semibold tracking-widest uppercase text-[#0B5394]">
                  República Argentina · Archivo Cultural
                </p>
              </div>

              <h1
                className="font-serif font-semibold text-[#0B2239] leading-[1.06] tracking-tight text-balance"
                style={{ fontSize: 'clamp(2.35rem, 4.1vw, 3.65rem)' }}
              >
                Lecturas, cine y escenas que definen a la Argentina
              </h1>

              <p className="mt-6 text-base sm:text-lg text-[#3A546E] leading-relaxed max-w-[58ch]">
                Una guía curatorial dedicada al patrimonio vivo de nuestro país: libros esenciales,
                cine nacional, teatro independiente y salas históricas de Buenos Aires a cada
                provincia.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-[#DCEBFA] flex flex-wrap items-center gap-5">
              <a
                href="#catalogo"
                className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold bg-[#0B5394] text-white rounded-md hover:bg-[#083D6E] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0B5394]"
              >
                <span>Explorar catálogo</span>
                <ArrowRight className="w-4 h-4 text-[#F5B727]" aria-hidden="true" />
              </a>

              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="inline-flex items-center py-2.5 text-sm font-semibold text-[#0B5394] hover:text-[#083D6E] underline underline-offset-4 decoration-[#6CB4EE] hover:decoration-[#0B5394] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Creá tu cuenta gratis
                </button>
              ) : (
                <a
                  href="#rutas"
                  className="inline-flex items-center py-2.5 text-sm font-semibold text-[#0B5394] hover:text-[#083D6E] underline underline-offset-4 decoration-[#6CB4EE] hover:decoration-[#0B5394] transition-colors whitespace-nowrap shrink-0"
                >
                  Ver rutas federales
                </a>
              )}
            </div>
          </div>

          <figure className="lg:col-span-6 flex flex-col">
            <div className="relative flex-1 min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] bg-[#EAF3FB] border border-[#C5DCF2] overflow-hidden rounded-sm">
              <EditorialImage
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                fallbackTitle="Teatro Colón de Buenos Aires"
                fallbackSubtitle="Patrimonio Escénico Argentino"
                className="w-full h-full lg:absolute lg:inset-0 object-cover"
              />
            </div>
            <figcaption className="mt-2.5 text-xs font-serif italic text-[#526D88]">
              {HERO_IMAGE.caption}
            </figcaption>
          </figure>
        </div>

        {/* Full-Width 4-Column Curatorial Utility Ribbon */}
        <div className="mt-12 pt-8 border-t border-[#DCEBFA] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x lg:divide-[#DCEBFA]">
          {overviewCards.map((card) => (
            <button
              key={card.index}
              type="button"
              onClick={() => onSelectCategoryAndScroll(card.category)}
              className="group text-left p-4 lg:px-6 lg:py-2 hover:bg-[#EAF3FB]/70 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5394] rounded-sm"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xs text-[#8A5E00] font-medium tabular-nums">
                  {card.index}
                </span>
                <span className="font-mono text-xs text-[#0B5394] tabular-nums">
                  {card.count} obras
                </span>
              </div>
              <h2 className="mt-1.5 font-serif text-xl font-semibold text-[#0B2239] group-hover:text-[#0B5394] transition-colors">
                {card.title}
              </h2>
              <p className="mt-1 text-xs text-[#3A546E] leading-relaxed">{card.subtitle}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
