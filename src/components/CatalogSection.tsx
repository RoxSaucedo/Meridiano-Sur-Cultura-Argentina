import { Bookmark, Check, Plus, Search, X } from 'lucide-react';
import { CATEGORY_META } from '../data/cultureCatalog';
import { CultureCategory, CultureEra, CultureItem } from '../types/culture';

export type SortOrder = 'curated' | 'newest' | 'oldest';

interface CatalogSectionProps {
  items: CultureItem[];
  totalCount: number;
  selectedCategory: CultureCategory | 'all';
  onCategoryChange: (cat: CultureCategory | 'all') => void;
  selectedEra: CultureEra | 'all';
  onEraChange: (era: CultureEra | 'all') => void;
  sortOrder: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenItem: (id: string) => void;
  onOpenSuggest: () => void;
  onResetFilters: () => void;
}

const CATEGORY_TABS: { key: CultureCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Todo' },
  { key: 'libros', label: 'Libros' },
  { key: 'cine', label: 'Cine' },
  { key: 'teatro', label: 'Teatro' },
  { key: 'musica', label: 'Música' },
  { key: 'espacios', label: 'Arte y Espacios' },
];

const ERA_OPTIONS: { key: CultureEra | 'all'; label: string }[] = [
  { key: 'all', label: 'Todas las épocas' },
  { key: 'clasicos', label: 'Clásicos esenciales' },
  { key: 'contemporaneo', label: 'Contemporáneo' },
  { key: 'imperdibles', label: 'Imperdibles' },
];

export function CatalogSection({
  items,
  totalCount,
  selectedCategory,
  onCategoryChange,
  selectedEra,
  onEraChange,
  sortOrder,
  onSortChange,
  searchQuery,
  onSearchChange,
  savedIds,
  onToggleSave,
  onOpenItem,
  onOpenSuggest,
  onResetFilters,
}: CatalogSectionProps) {
  const hasActiveFilters =
    selectedCategory !== 'all' || selectedEra !== 'all' || searchQuery.trim().length > 0;

  return (
    <section id="catalogo" className="py-14 lg:py-20 bg-white border-b border-[#C5DCF2]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#C5DCF2]">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#0B5394]">
              Archivo Curatorial
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#0B2239] text-balance">
              Catálogo de recomendaciones culturales
            </h2>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="font-mono text-xs text-[#526D88] tabular-nums">
              {items.length} de {totalCount} fichas
            </span>
            <button
              type="button"
              onClick={onOpenSuggest}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-[#0B5394] text-[#0B5394] rounded-md hover:bg-[#0B5394] hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sugerir obra</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="mt-6 flex flex-col gap-4">
          {/* Category Segmented Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Filtrar por disciplina cultural"
              className="flex flex-wrap items-center gap-1 p-1 bg-[#EAF3FB] border border-[#C5DCF2] rounded-md"
            >
              {CATEGORY_TABS.map((tab) => {
                const isActive = selectedCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => onCategoryChange(tab.key)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] ${
                      isActive
                        ? 'bg-[#0B5394] text-white shadow-xs'
                        : 'text-[#3A546E] hover:text-[#0B2239]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Era & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="sr-only" htmlFor="era-select">
                Filtrar por época
              </label>
              <select
                id="era-select"
                value={selectedEra}
                onChange={(e) => onEraChange(e.target.value as CultureEra | 'all')}
                className="px-3 py-2 text-xs font-medium bg-[#F5F9FD] border border-[#C5DCF2] rounded-md text-[#0B2239] focus:outline-none focus:ring-2 focus:ring-[#0B5394] min-h-[40px] cursor-pointer"
              >
                {ERA_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <label className="sr-only" htmlFor="sort-select">
                Ordenar resultados
              </label>
              <select
                id="sort-select"
                value={sortOrder}
                onChange={(e) => onSortChange(e.target.value as SortOrder)}
                className="px-3 py-2 text-xs font-medium bg-[#F5F9FD] border border-[#C5DCF2] rounded-md text-[#0B2239] focus:outline-none focus:ring-2 focus:ring-[#0B5394] min-h-[40px] cursor-pointer"
              >
                <option value="curated">Orden curatorial</option>
                <option value="newest">Año más reciente</option>
                <option value="oldest">Clásicos más antiguos</option>
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search
              className="w-4 h-4 text-[#526D88] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por título, autor, cineasta, ciudad, provincia o sala..."
              aria-label="Buscar en el catálogo cultural"
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#F5F9FD] border border-[#C5DCF2] rounded-md text-[#0B2239] placeholder:text-[#526D88] focus:outline-none focus:border-[#0B5394] focus:ring-1 focus:ring-[#0B5394] min-h-[44px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#526D88] hover:text-[#0B2239] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {items.length === 0 ? (
          <div className="mt-10 py-16 px-6 text-center bg-[#EAF3FB]/60 border border-[#C5DCF2] rounded-sm">
            <p className="font-serif text-2xl text-[#0B2239]">
              No se encontraron obras con esos criterios
            </p>
            <p className="mt-2 text-sm text-[#3A546E] max-w-md mx-auto">
              Probá ampliando los filtros de disciplina o buscando por otro autor, provincia o sala.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="mt-6 px-5 py-2.5 text-xs font-semibold bg-[#0B5394] text-white rounded-md hover:bg-[#083D6E] transition-colors cursor-pointer"
              >
                Restablecer filtros
              </button>
            )}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const isSaved = savedIds.includes(item.id);
              const catMeta = CATEGORY_META[item.category];

              return (
                <article
                  key={item.id}
                  className="flex flex-col justify-between bg-[#F5F9FD]/65 border border-[#C5DCF2] p-6 rounded-sm hover:border-[#6CB4EE] hover:bg-white transition-colors duration-150"
                >
                  <div>
                    {/* Quiet unboxed metadata header */}
                    <div className="flex items-center justify-between gap-2 text-xs text-[#3A546E]">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-semibold text-[#0B5394]">{catMeta.singular}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {item.yearLabel ?? item.year}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{item.province}</span>
                      </div>
                      <span className="font-mono text-[11px] text-[#526D88] tabular-nums shrink-0">
                        {item.accessionCode}
                      </span>
                    </div>

                    {/* Title & Creator */}
                    <h3 className="mt-3 font-serif text-2xl font-semibold text-[#0B2239] leading-snug">
                      <button
                        type="button"
                        onClick={() => onOpenItem(item.id)}
                        className="text-left hover:text-[#0B5394] transition-colors cursor-pointer focus-visible:outline-none focus-visible:underline"
                      >
                        {item.title}
                      </button>
                    </h3>
                    <p className="mt-1 text-xs font-medium text-[#3A546E]">
                      {item.creator}
                      {item.isUserSubmitted && (
                        <>
                          <span aria-hidden="true"> · </span>
                          <span className="italic text-[#8A5E00]">
                            {item.authorName ? `Aporte de ${item.authorName}` : 'Aporte comunitario'}
                          </span>
                        </>
                      )}
                    </p>

                    <p className="mt-3.5 text-sm text-[#3A546E] leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-6 pt-4 border-t border-[#DCEBFA] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onOpenItem(item.id)}
                      className="text-xs font-semibold text-[#0B2239] hover:text-[#0B5394] underline underline-offset-4 decoration-[#6CB4EE] hover:decoration-[#0B5394] transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1"
                    >
                      Leer ficha curatorial
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleSave(item.id)}
                      aria-pressed={isSaved}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] ${
                        isSaved
                          ? 'bg-[#0B5394] border-[#0B5394] text-white'
                          : 'bg-white border-[#C5DCF2] text-[#0B2239] hover:border-[#0B5394] hover:text-[#0B5394]'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#F5B727]" aria-hidden="true" />
                          <span>En Mi Lista</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Guardar</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
