import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export function EditorialImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'Archivo Cultural',
  fallbackSubtitle = 'Meridiano Sur',
}: EditorialImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EAF3FB] text-[#3A546E] p-6 text-center border border-[#C5DCF2] ${className}`}
        role="img"
        aria-label={alt}
      >
        <BookOpen className="w-7 h-7 text-[#0B5394] mb-3 opacity-85" strokeWidth={1.5} />
        <p className="font-serif text-lg font-medium text-[#0B2239] leading-snug">{fallbackTitle}</p>
        <p className="text-xs tracking-wider uppercase text-[#526D88] mt-1">{fallbackSubtitle}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
