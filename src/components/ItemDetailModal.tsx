import { useEffect } from 'react';
import { Bookmark, Check, Trash2, X } from 'lucide-react';
import { CATEGORY_META } from '../data/cultureCatalog';
import { CultureItem } from '../types/culture';
import { EditorialImage } from './EditorialImage';

interface ItemDetailModalProps {
  item: CultureItem | null;
  relatedItems: CultureItem[];
  isSaved: boolean;
  isAuthenticated: boolean;
  currentUserUid: string | null;
  userNote: string;
  onUpdateNote: (id: string, note: string) => void;
  onToggleSave: (id: string) => void;
  onDeleteCommunityItem: (id: string) => Promise<void>;
  onSelectRelated: (id: string) => void;
  onOpenAuth: () => void;
  onClose: () => void;
}

export function ItemDetailModal({
  item,
  relatedItems,
  isSaved,
  isAuthenticated,
  currentUserUid,
  userNote,
  onUpdateNote,
  onToggleSave,
  onDeleteCommunityItem,
  onSelectRelated,
  onOpenAuth,
  onClose,
}: ItemDetailModalProps) {
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const catMeta = CATEGORY_META[item.category];
  const isOwnContribution = Boolean(currentUserUid && item.authorUid === currentUserUid);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B2239]/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="folio-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-[#B4D2EE] rounded-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Albiceleste Stripe */}
        <div className="h-1 w-full flex" aria-hidden="true">
          <span className="flex-1 bg-[#6CB4EE]" />
          <span className="flex-1 bg-white" />
          <span className="flex-1 bg-[#6CB4EE]" />
        </div>

        {/* Top Folio Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 sm:px-8 py-4 bg-white/95 backdrop-blur-sm border-b border-[#DCEBFA]">
          <div className="flex items-center gap-2 text-xs text-[#3A546E]">
            <span className="font-mono tabular-nums text-[#526D88]">{item.accessionCode}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-[#0B5394]">{catMeta.singular}</span>
          </div>

          <div className="flex items-center gap-2">
            {isOwnContribution && (
              <button
                type="button"
                onClick={async () => {
                  await onDeleteCommunityItem(item.id);
                  onClose();
                }}
                aria-label="Eliminar mi recomendación"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#991B1B] border border-[#FCA5A5] rounded-sm hover:bg-[#FEE2E2]/60 cursor-pointer min-h-[38px]"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Eliminar</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onToggleSave(item.id)}
              aria-pressed={isSaved}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-sm border transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[38px] ${
                isSaved
                  ? 'bg-[#0B5394] border-[#0B5394] text-white'
                  : 'bg-white border-[#C5DCF2] text-[#0B2239] hover:border-[#0B5394]'
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

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar ficha curatorial"
              className="p-2 text-[#3A546E] hover:text-[#0B2239] hover:bg-[#EAF3FB] rounded-sm transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Folio Content */}
        <div className="p-6 sm:p-8">
          <h2
            id="folio-title"
            className="font-serif text-3xl sm:text-4xl font-semibold text-[#0B2239] leading-tight text-balance"
          >
            {item.title}
          </h2>
          <p className="mt-2 text-base text-[#3A546E]">
            {item.creator}
            {item.authorName && (
              <>
                <span aria-hidden="true"> · </span>
                <span className="text-sm italic text-[#8A5E00]">Aporte de {item.authorName}</span>
              </>
            )}
          </p>

          {item.image && (
            <figure className="mt-6">
              <div className="aspect-[16/9] bg-[#EAF3FB] border border-[#C5DCF2] overflow-hidden rounded-sm">
                <EditorialImage
                  src={item.image}
                  alt={item.imageAlt ?? item.title}
                  fallbackTitle={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="mt-2 text-xs font-serif italic text-[#526D88]">
                {item.imageAlt}
              </figcaption>
            </figure>
          )}

          {/* Museum Accession Metadata Grid */}
          <dl className="mt-6 border-y border-[#DCEBFA] divide-y divide-[#DCEBFA] text-sm">
            <div className="py-3 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4">
              <dt className="sm:col-span-4 text-xs font-semibold uppercase tracking-wider text-[#0B5394]">
                Año / Vigencia
              </dt>
              <dd className="sm:col-span-8 font-mono tabular-nums text-[#0B2239]">
                {item.yearLabel ?? item.year}
              </dd>
            </div>
            <div className="py-3 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4">
              <dt className="sm:col-span-4 text-xs font-semibold uppercase tracking-wider text-[#0B5394]">
                Territorio
              </dt>
              <dd className="sm:col-span-8 text-[#0B2239]">
                {item.location} ({item.province})
              </dd>
            </div>
            <div className="py-3 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4">
              <dt className="sm:col-span-4 text-xs font-semibold uppercase tracking-wider text-[#0B5394]">
                Género y corriente
              </dt>
              <dd className="sm:col-span-8 text-[#0B2239]">{item.genre}</dd>
            </div>
            <div className="py-3 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4">
              <dt className="sm:col-span-4 text-xs font-semibold uppercase tracking-wider text-[#0B5394]">
                Dónde experimentar
              </dt>
              <dd className="sm:col-span-8 text-[#3A546E]">{item.whereToExperience}</dd>
            </div>
          </dl>

          {/* Editorial Essay with Drop Cap */}
          <div className="mt-7 max-w-[68ch]">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#0B5394] mb-3">
              Por qué merece ser visitada o leída
            </h3>
            <p className="text-base text-[#0B2239] leading-[1.75] first-letter:text-5xl first-letter:font-serif first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-[#0B5394]">
              {item.editorialEssay}
            </p>
          </div>

          {/* Pull Quote */}
          {item.pullQuote && (
            <blockquote className="my-8 py-6 border-y border-[#C5DCF2] text-center max-w-2xl mx-auto">
              <p className="font-serif italic text-xl sm:text-2xl text-[#0B2239] leading-relaxed">
                “{item.pullQuote}”
              </p>
              {item.quoteAttribution && (
                <footer className="mt-2.5 text-xs font-semibold tracking-wider uppercase text-[#8A5E00]">
                  — {item.quoteAttribution}
                </footer>
              )}
            </blockquote>
          )}

          {/* Personal Note Box */}
          <div className="mt-7 p-5 bg-[#EAF3FB]/70 border border-[#C5DCF2] rounded-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor={`note-${item.id}`}
                className="block text-xs font-semibold uppercase tracking-wider text-[#0B5394]"
              >
                Nota personal de lectura o visita
              </label>
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="text-xs font-semibold text-[#0B5394] underline underline-offset-4 cursor-pointer"
                >
                  Creá tu cuenta gratis para guardar en la nube
                </button>
              )}
            </div>
            <textarea
              id={`note-${item.id}`}
              rows={2}
              maxLength={500}
              value={userNote}
              onChange={(e) => onUpdateNote(item.id, e.target.value)}
              placeholder="Anotá con quién ir, qué edición buscar o tus impresiones..."
              className="mt-2 w-full px-3 py-2 text-sm bg-white border border-[#C5DCF2] rounded-sm text-[#0B2239] placeholder:text-[#526D88] focus:outline-none focus:border-[#0B5394]"
            />
          </div>

          {/* Related Recommendations */}
          {relatedItems.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#DCEBFA]">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#0B5394]">
                Otras fichas de {catMeta.label}
              </h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedItems.map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => onSelectRelated(rel.id)}
                    className="text-left p-4 bg-[#F5F9FD] border border-[#C5DCF2] rounded-sm hover:border-[#0B5394] transition-colors cursor-pointer"
                  >
                    <p className="font-mono text-[11px] text-[#526D88] tabular-nums">
                      {rel.accessionCode} · {rel.yearLabel ?? rel.year}
                    </p>
                    <p className="mt-1 font-serif text-lg font-semibold text-[#0B2239]">
                      {rel.title}
                    </p>
                    <p className="text-xs text-[#3A546E]">{rel.creator}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
