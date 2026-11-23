import { FormEvent, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORY_META } from '../data/cultureCatalog';
import { CultureCategory, CultureEra, CultureItem } from '../types/culture';

interface SuggestModalProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  authorName: string | null;
  onClose: () => void;
  onOpenAuth: () => void;
  onAddRecommendation: (item: CultureItem) => Promise<void>;
}

export function SuggestModal({
  isOpen,
  isAuthenticated,
  authorName,
  onClose,
  onOpenAuth,
  onAddRecommendation,
}: SuggestModalProps) {
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [category, setCategory] = useState<CultureCategory>('libros');
  const [era, setEra] = useState<CultureEra>('contemporaneo');
  const [year, setYear] = useState('2024');
  const [province, setProvince] = useState('CABA');
  const [location, setLocation] = useState('');
  const [genre, setGenre] = useState('');
  const [whereToExperience, setWhereToExperience] = useState('');
  const [summary, setSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onClose();
      onOpenAuth();
      return;
    }

    const cleanTitle = title.trim();
    const cleanCreator = creator.trim();
    const cleanSummary = summary.trim();

    if (cleanTitle.length < 2 || cleanCreator.length < 2 || cleanSummary.length < 5) {
      setError('Completá el título (mín. 2 caracteres), la autoría y una reseña de al menos 5 caracteres.');
      return;
    }

    const parsedYear = Number.parseInt(year, 10);
    const validYear =
      Number.isFinite(parsedYear) && parsedYear >= 1810 && parsedYear <= 2030 ? parsedYear : 2024;
    const prefix = CATEGORY_META[category].codePrefix;

    const newItem: CultureItem = {
      id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      accessionCode: `AR-${prefix}-COM`,
      title: cleanTitle.slice(0, 120),
      creator: cleanCreator.slice(0, 100),
      year: validYear,
      category,
      era,
      genre: (genre.trim() || CATEGORY_META[category].singular).slice(0, 80),
      location: (location.trim() || province.trim() || 'Argentina').slice(0, 80),
      province: (province.trim() || 'Argentina').slice(0, 60),
      summary: cleanSummary.slice(0, 400),
      editorialEssay: cleanSummary.slice(0, 1500),
      whereToExperience: (
        whereToExperience.trim() || 'Consultar programación local, librerías y circuitos culturales.'
      ).slice(0, 250),
      isUserSubmitted: true,
      authorName: (authorName || 'Lector argentino').slice(0, 80),
    };

    setSubmitting(true);
    setError('');
    try {
      await onAddRecommendation(newItem);
      setTitle('');
      setCreator('');
      setLocation('');
      setGenre('');
      setWhereToExperience('');
      setSummary('');
      onClose();
    } catch {
      setError('No se pudo publicar la recomendación en este momento. Verificá tu conexión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2239]/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="suggest-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-[#B4D2EE] rounded-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full flex" aria-hidden="true">
          <span className="flex-1 bg-[#6CB4EE]" />
          <span className="flex-1 bg-white" />
          <span className="flex-1 bg-[#6CB4EE]" />
        </div>

        <div className="px-6 py-4 border-b border-[#DCEBFA] bg-[#F5F9FD] flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#0B5394] font-semibold">
              Archivo Comunitario
            </p>
            <h2 id="suggest-title" className="font-serif text-2xl font-semibold text-[#0B2239]">
              Sugerir una obra argentina
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar formulario"
            className="p-2 text-[#3A546E] hover:text-[#0B2239] rounded-sm cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="p-6 space-y-4">
            <p className="text-sm text-[#3A546E] leading-relaxed">
              Para publicar recomendaciones en el archivo compartido de Meridiano Sur necesitás una
              cuenta gratuita. Así tu aporte queda firmado con tu nombre y podés editarlo o
              eliminarlo cuando quieras.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#3A546E] hover:text-[#0B2239] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-5 py-2.5 text-xs font-semibold bg-[#0B5394] text-white rounded-md hover:bg-[#083D6E] transition-colors cursor-pointer min-h-[40px]"
              >
                Crear cuenta gratis
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <p
                role="alert"
                className="p-3 text-xs font-medium text-[#991B1B] bg-[#FEE2E2]/60 border border-[#FCA5A5] rounded-sm"
              >
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="sug-category"
                  className="block text-xs font-medium text-[#3A546E] mb-1"
                >
                  Disciplina
                </label>
                <select
                  id="sug-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CultureCategory)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#C5DCF2] rounded-sm text-[#0B2239]"
                >
                  <option value="libros">Libros</option>
                  <option value="cine">Cine</option>
                  <option value="teatro">Teatro</option>
                  <option value="musica">Música</option>
                  <option value="espacios">Arte y Espacios</option>
                </select>
              </div>

              <div>
                <label htmlFor="sug-era" className="block text-xs font-medium text-[#3A546E] mb-1">
                  Enfoque
                </label>
                <select
                  id="sug-era"
                  value={era}
                  onChange={(e) => setEra(e.target.value as CultureEra)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#C5DCF2] rounded-sm text-[#0B2239]"
                >
                  <option value="contemporaneo">Contemporáneo</option>
                  <option value="clasicos">Clásico esencial</option>
                  <option value="imperdibles">Imperdible</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="sug-title" className="block text-xs font-medium text-[#3A546E] mb-1">
                Título de la obra o espacio *
              </label>
              <input
                id="sug-title"
                type="text"
                required
                minLength={2}
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Cometierra, Los rubios, Teatro El Círculo..."
                className="w-full px-3 py-2 text-sm bg-white border border-[#C5DCF2] rounded-sm text-[#0B2239]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="sug-creator"
                  className="block text-xs font-medium text-[#3A546E] mb-1"
                >
                  Autoría / Dirección / Artista *
                </label>
                <input
                  id="sug-creator"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  placeholder="Ej. Dolores Reyes"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#C5DCF2] rounded-sm text-[#0B2239]"
                />
              </div>

              <div>
                <label htmlFor="sug-year" className="block text-xs font-medium text-[#3A546E] mb-1">
                  Año
                </label>
                <input
                  id="sug-year"
                  type="number"
                  min={1810}
                  max={2030}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#C5DCF2] rounded-sm text-[#0B2239] font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="sug-province"
                  className="block text-xs font-medium text-[#3A546E] mb-1"
                >
                  Provincia / Ciudad
                </label>
                <input
                  id="sug-province"
                  type="text"
                  maxLength={60}
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="Ej. Santa Fe, Córdoba, CABA"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#C5DCF2] rounded-sm text-[#0B2239]"
                />
              </div>

              <div>
                <label
                  htmlFor="sug-genre"
                  className="block text-xs font-medium text-[#3A546E] mb-1"
                >
                  Género
                </label>
                <input
                  id="sug-genre"
                  type="text"
                  maxLength={80}
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="Ej. Novela, Documental, Drama"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#C5DCF2] rounded-sm text-[#0B2239]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="sug-where" className="block text-xs font-medium text-[#3A546E] mb-1">
                Dónde leer, ver o visitar
              </label>
              <input
                id="sug-where"
                type="text"
                maxLength={250}
                value={whereToExperience}
                onChange={(e) => setWhereToExperience(e.target.value)}
                placeholder="Ej. Librerías independientes, CINE.AR, Teatro San Martín..."
                className="w-full px-3 py-2 text-sm bg-white border border-[#C5DCF2] rounded-sm text-[#0B2239]"
              />
            </div>

            <div>
              <label htmlFor="sug-summary" className="block text-xs font-medium text-[#3A546E] mb-1">
                Por qué la recomendás *
              </label>
              <textarea
                id="sug-summary"
                rows={3}
                required
                minLength={5}
                maxLength={400}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Describí brevemente la obra y qué la hace especial dentro de la cultura argentina..."
                className="w-full px-3 py-2 text-sm bg-white border border-[#C5DCF2] rounded-sm text-[#0B2239]"
              />
            </div>

            <div className="pt-3 border-t border-[#DCEBFA] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#3A546E] hover:text-[#0B2239] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 text-xs font-semibold bg-[#0B5394] text-white rounded-md hover:bg-[#083D6E] disabled:opacity-60 transition-colors cursor-pointer min-h-[40px]"
              >
                {submitting ? 'Publicando...' : 'Publicar en el catálogo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
