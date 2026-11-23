import { useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { CATEGORY_META, FEDERAL_ROUTES } from '../data/cultureCatalog';
import { CultureItem } from '../types/culture';

interface FederalRoutesSectionProps {
  allItems: CultureItem[];
  onOpenItem: (id: string) => void;
}

export function FederalRoutesSection({ allItems, onOpenItem }: FederalRoutesSectionProps) {
  const [activeRouteId, setActiveRouteId] = useState(FEDERAL_ROUTES[0].id);
  const activeRoute = FEDERAL_ROUTES.find((r) => r.id === activeRouteId) ?? FEDERAL_ROUTES[0];

  const relatedItems = activeRoute.relatedItemIds
    .map((id) => allItems.find((item) => item.id === id))
    .filter((item): item is CultureItem => Boolean(item));

  return (
    <section id="rutas" className="py-14 lg:py-20 bg-[#EAF3FB] border-b border-[#C5DCF2]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#C5DCF2]">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#0B5394]">
              Geografía Cultural Federal
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#0B2239] text-balance">
              Rutas culturales de todo el país
            </h2>
          </div>
          <p className="text-sm text-[#3A546E] max-w-md leading-relaxed">
            Itinerarios pensados para recorrer librerías, salas de cine, teatros y museos en
            distintas provincias argentinas.
          </p>
        </div>

        {/* Region Tabs */}
        <div
          role="tablist"
          aria-label="Seleccionar región cultural"
          className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {FEDERAL_ROUTES.map((route) => {
            const isSelected = route.id === activeRoute.id;
            return (
              <button
                key={route.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveRouteId(route.id)}
                className={`text-left p-4 border rounded-sm transition-colors duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#0B5394] text-[#0B2239] shadow-xs'
                    : 'bg-white/75 border-[#C5DCF2] text-[#3A546E] hover:border-[#6CB4EE] hover:text-[#0B2239]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs tabular-nums text-[#8A5E00] font-medium">
                    {route.indexNumber}
                  </span>
                  {isSelected && (
                    <span className="text-[11px] font-semibold text-[#0B5394]">Activo</span>
                  )}
                </div>
                <p className="mt-1.5 font-serif text-xl font-semibold text-[#0B2239]">
                  {route.regionName}
                </p>
                <p className="mt-0.5 text-xs text-[#526D88] truncate">{route.cityLabel}</p>
              </button>
            );
          })}
        </div>

        {/* 70/30 Asymmetric Reading Canvas */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Essay Column (70%) */}
          <div className="lg:col-span-8 bg-white border border-[#C5DCF2] p-6 sm:p-8 rounded-sm">
            <div className="flex items-center gap-2 text-xs text-[#0B5394] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#D99B16]" aria-hidden="true" />
              <span>{activeRoute.cityLabel}</span>
            </div>

            <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-semibold text-[#0B2239] leading-tight text-balance">
              {activeRoute.title}
            </h3>

            <p className="mt-5 text-base text-[#0B2239] leading-relaxed max-w-[65ch] first-letter:text-5xl first-letter:font-serif first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-[#0B5394]">
              {activeRoute.overview}
            </p>

            <dl className="mt-8 border-t border-[#DCEBFA] divide-y divide-[#DCEBFA]">
              {activeRoute.highlights.map((item) => (
                <div
                  key={item.label}
                  className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4"
                >
                  <dt className="sm:col-span-3 text-xs font-semibold uppercase tracking-wider text-[#0B5394]">
                    {item.label}
                  </dt>
                  <dd className="sm:col-span-9 text-sm text-[#3A546E] leading-relaxed">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Margin Sidebar Rail (30%) */}
          <aside className="lg:col-span-4 bg-white border border-[#C5DCF2] p-6 rounded-sm">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#0B5394] pb-3 border-b border-[#DCEBFA]">
              Obras vinculadas a esta ruta
            </p>
            <div className="divide-y divide-[#DCEBFA]">
              {relatedItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenItem(item.id)}
                  className="w-full py-4 text-left group flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div>
                    <p className="text-xs text-[#0B5394] font-medium">
                      {CATEGORY_META[item.category].singular} ·{' '}
                      <span className="font-mono tabular-nums text-[#526D88]">
                        {item.yearLabel ?? item.year}
                      </span>
                    </p>
                    <p className="mt-1 font-serif text-lg font-semibold text-[#0B2239] group-hover:text-[#0B5394] transition-colors leading-snug">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-[#3A546E]">{item.creator}</p>
                  </div>
                  <ArrowUpRight
                    className="w-4 h-4 text-[#526D88] group-hover:text-[#0B5394] shrink-0 mt-1 transition-colors"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
