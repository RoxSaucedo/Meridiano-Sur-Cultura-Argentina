import { useEffect, useState } from 'react';
import { Check, Copy, Trash2, X } from 'lucide-react';
import { CATEGORY_META } from '../data/cultureCatalog';
import { CultureItem } from '../types/culture';

interface SavedListDrawerProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  savedItems: CultureItem[];
  notesMap: Record<string, string>;
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onOpenItem: (id: string) => void;
  onOpenAuth: () => void;
  onClearAll: () => void;
}

export function SavedListDrawer({
  isOpen,
  isAuthenticated,
  savedItems,
  notesMap,
  onClose,
  onRemoveItem,
  onOpenItem,
  onOpenAuth,
  onClearAll,
}: SavedListDrawerProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyItinerary = async () => {
    if (savedItems.length === 0) return;
    const lines = [
      'MI LISTA CULTURAL — MERIDIANO SUR',
      '====================================',
      ...savedItems.map((item, idx) => {
        const note = notesMap[item.id]?.trim();
        return `${idx + 1}. [${CATEGORY_META[item.category].label}] ${item.title} — ${item.creator} (${item.yearLabel ?? item.year})\n   Dónde: ${item.whereToExperience}${note ? `\n   Nota: ${note}` : ''}`;
      }),
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0B2239]/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Mi lista cultural guardada"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-white border-l border-[#B4D2EE] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Albiceleste Stripe */}
        <div className="h-1 w-full flex shrink-0" aria-hidden="true">
          <span className="flex-1 bg-[#6CB4EE]" />
          <span className="flex-1 bg-white" />
          <span className="flex-1 bg-[#6CB4EE]" />
        </div>

        <div className="px-6 py-5 border-b border-[#DCEBFA] bg-[#F5F9FD] flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#0B5394] font-semibold">
              Itinerario Personal
            </p>
            <h2 className="font-serif text-2xl font-semibold text-[#0B2239]">
              Mi Lista Cultural ({savedItems.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar Mi Lista"
            className="p-2 text-[#3A546E] hover:text-[#0B2239] hover:bg-[#EAF3FB] rounded-sm cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated && (
          <div className="px-6 py-3 bg-[#EAF3FB] border-b border-[#C5DCF2] flex items-center justify-between gap-3 text-xs">
            <span className="text-[#3A546E]">Guardado en este navegador.</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="font-semibold text-[#0B5394] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              Crear cuenta gratis
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {savedItems.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-serif text-xl text-[#0B2239]">Tu lista está vacía</p>
              <p className="mt-2 text-sm text-[#3A546E] leading-relaxed">
                Guardá libros, películas, obras de teatro o museos desde el catálogo para armar tu
                agenda cultural.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#DCEBFA]">
              {savedItems.map((item) => {
                const note = notesMap[item.id]?.trim();
                return (
                  <li key={item.id} className="py-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-[#0B5394] font-medium">
                        {CATEGORY_META[item.category].singular} ·{' '}
                        <span className="font-mono tabular-nums text-[#526D88]">
                          {item.yearLabel ?? item.year}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenItem(item.id);
                        }}
                        className="mt-1 text-left font-serif text-xl font-semibold text-[#0B2239] hover:text-[#0B5394] transition-colors cursor-pointer"
                      >
                        {item.title}
                      </button>
                      <p className="text-xs text-[#3A546E]">{item.creator}</p>
                      {note && (
                        <p className="mt-2 text-xs italic text-[#0B2239] bg-[#EAF3FB] px-2.5 py-1.5 rounded-sm">
                          “{note}”
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label={`Quitar ${item.title} de Mi Lista`}
                      className="p-2 text-[#526D88] hover:text-[#991B1B] hover:bg-[#EAF3FB] rounded-sm transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {savedItems.length > 0 && (
          <div className="p-6 border-t border-[#DCEBFA] bg-[#F5F9FD] flex flex-col gap-3">
            <button
              type="button"
              onClick={handleCopyItinerary}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#0B5394] text-white rounded-md hover:bg-[#083D6E] transition-colors cursor-pointer min-h-[42px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#F5B727]" aria-hidden="true" />
                  <span>Itinerario copiado al portapapeles</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>Copiar itinerario en texto</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className="w-full py-2 text-xs font-medium text-[#3A546E] hover:text-[#991B1B] transition-colors cursor-pointer"
            >
              Vaciar lista
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
