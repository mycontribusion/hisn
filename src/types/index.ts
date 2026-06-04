export interface Dua {
  id: string;
  categoryId: string;
  number: number;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  virtue?: string;
  audioUrl?: string;
  repeat?: number;
  footnoteAr?: string;
}

export interface Category {
  id: string;
  name: string;
  nameArabic: string;
  icon: string;
  description: string;
  color: string;
  chapterId?: number;
  audioUrl?: string;
}

export interface Bookmark {
  duaId: string;
  addedAt: string;
}

export interface BookmarkedCategory {
  categoryId: string;
  addedAt: string;
}

export interface UserProgress {
  totalRead: number;
  lastReadDate: string;
  streak: number;
  readToday: boolean;
}

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'ar' | 'both';
