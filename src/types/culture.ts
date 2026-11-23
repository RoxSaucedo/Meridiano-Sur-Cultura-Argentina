export type CultureCategory = 'libros' | 'cine' | 'teatro' | 'musica' | 'espacios';

export type CultureEra = 'clasicos' | 'contemporaneo' | 'imperdibles';

export interface CultureItem {
  id: string;
  accessionCode: string;
  title: string;
  creator: string;
  year: number;
  yearLabel?: string;
  category: CultureCategory;
  era: CultureEra;
  genre: string;
  location: string;
  province: string;
  summary: string;
  editorialEssay: string;
  whereToExperience: string;
  pullQuote?: string;
  quoteAttribution?: string;
  image?: string;
  imageAlt?: string;
  isUserSubmitted?: boolean;
  authorUid?: string;
  authorName?: string;
}

export interface CulturalDossier {
  id: string;
  figureLabel: string;
  kicker: string;
  title: string;
  deck: string;
  category: CultureCategory;
  image: string;
  imageAlt: string;
  caption: string;
  featuredItemId: string;
}

export interface FederalRoute {
  id: string;
  regionName: string;
  cityLabel: string;
  indexNumber: string;
  title: string;
  overview: string;
  highlights: {
    label: string;
    detail: string;
  }[];
  relatedItemIds: string[];
}

export interface UserProfile {
  uid: string;
  displayName: string;
  province: string;
  favoriteDiscipline: CultureCategory;
}
