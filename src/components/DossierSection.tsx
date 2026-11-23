import { ArrowUpRight } from 'lucide-react';
import { CULTURAL_DOSSIERS } from '../data/cultureCatalog';
import { CultureCategory } from '../types/culture';
import { EditorialImage } from './EditorialImage';

interface DossierSectionProps {
  onOpenItem: (itemId: string) => void;
  onFilterCategory: (category: CultureCategory) => void;
}

export function DossierSection({ onOpenItem, onFilterCategory }: DossierSectionProps) {
  const [leadDossier, ...secondaryDossiers] = CULTURAL_DOSSIERS;

  return (
    <section id="dossiers" className="py-14 lg:py-20 bg-[#EAF3FB] border-b border-[#C5DCF2]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#C5DCF2]">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#0B5394]">
              Dossiers Temáticos
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#0B2239] text-balance">
              Cuatro puertas de entrada a la escena nacional
            </h2>
          </div>
          <p className="text-sm text-[#3A546E] max-w-sm leading-relaxed">
            Ensayos breves y selecciones iniciales para orientarse entre clásicos imprescindibles y
            voces contemporáneas.
          </p>
        </div>

        {/* Tier 1: Lead Dossier */}
        <article className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-[#C5DCF2] p-6 sm:p-8 rounded-sm">
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-[#8A5E00]">
                {leadDossier.kicker}
              </p>
              <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-semibold text-[#0B2239] leading-tight text-balance">
                {leadDossier.title}
              </h3>
              <p className="mt-4 text-base text-[#3A546E] leading-relaxed max-w-[54ch]">
                {leadDossier.deck}
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-[#DCEBFA] flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() => onOpenItem(leadDossier.featuredItemId)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B5394] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Leer ficha destacada (Ficciones)</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onFilterCategory(leadDossier.category)}
                className="text-sm font-medium text-[#3A546E] hover:text-[#0B2239] cursor-pointer whitespace-nowrap shrink-0"
              >
                Ver toda la selección de Libros
              </button>
            </div>
          </div>

          <figure className="lg:col-span-6 flex flex-col">
            <div className="relative flex-1 min-h-[240px] sm:min-h-[300px] bg-[#EAF3FB] border border-[#C5DCF2] overflow-hidden rounded-sm">
              <EditorialImage
                src={leadDossier.image}
                alt={leadDossier.imageAlt}
                fallbackTitle={leadDossier.title}
                className="w-full h-full lg:absolute lg:inset-0 object-cover"
              />
            </div>
            <figcaption className="mt-2 text-xs font-serif italic text-[#526D88]">
              {leadDossier.caption}
            </figcaption>
          </figure>
        </article>

        {/* Tier 2: 3 Secondary Dossiers */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {secondaryDossiers.map((dossier) => (
            <article
              key={dossier.id}
              className="flex flex-col justify-between bg-white border border-[#C5DCF2] p-5 rounded-sm hover:border-[#6CB4EE] transition-colors duration-150"
            >
              <div>
                <figure>
                  <div className="aspect-[4/3] bg-[#EAF3FB] border border-[#C5DCF2] overflow-hidden rounded-sm">
                    <EditorialImage
                      src={dossier.image}
                      alt={dossier.imageAlt}
                      fallbackTitle={dossier.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-2 text-xs font-serif italic text-[#526D88]">
                    {dossier.caption}
                  </figcaption>
                </figure>

                <p className="mt-4 text-xs font-semibold tracking-wider uppercase text-[#8A5E00]">
                  {dossier.kicker}
                </p>
                <h3 className="mt-1.5 font-serif text-xl font-semibold text-[#0B2239] leading-snug">
                  {dossier.title}
                </h3>
                <p className="mt-2.5 text-sm text-[#3A546E] leading-relaxed">{dossier.deck}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#DCEBFA] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onOpenItem(dossier.featuredItemId)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B5394] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Explorar obra</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onFilterCategory(dossier.category)}
                  className="text-xs font-medium text-[#3A546E] hover:text-[#0B2239] cursor-pointer whitespace-nowrap shrink-0"
                >
                  Filtrar categoría
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
