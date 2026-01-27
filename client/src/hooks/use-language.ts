import { create } from 'zustand';
import { useEffect } from 'react';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageState {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  "dashboard": { en: "Dashboard", ar: "لوحة القيادة" },
  "market": { en: "Market", ar: "السوق" },
  "reports": { en: "Reports", ar: "التقارير" },
  "settings": { en: "Settings", ar: "الإعدادات" },
  "overview": { en: "Market Overview", ar: "نظرة عامة على السوق" },
  "recent_analysis": { en: "Recent Analysis", ar: "أحدث التحليلات" },
  "create_report": { en: "Create Report", ar: "إنشاء تقرير" },
  "pair": { en: "Pair", ar: "الزوج" },
  "price": { en: "Price", ar: "السعر" },
  "change": { en: "Change (24h)", ar: "تغير (24س)" },
  "high": { en: "High", ar: "الأعلى" },
  "low": { en: "Low", ar: "الأدنى" },
  "sentiment": { en: "Sentiment", ar: "المعنويات" },
  "bullish": { en: "Bullish", ar: "صعودي" },
  "bearish": { en: "Bearish", ar: "هبوطي" },
  "neutral": { en: "Neutral", ar: "محايد" },
  "confidence": { en: "Confidence", ar: "الثقة" },
  "timeframe": { en: "Timeframe", ar: "الإطار الزمني" },
  "search": { en: "Search...", ar: "بحث..." },
  "loading": { en: "Loading market data...", ar: "جار تحميل بيانات السوق..." },
  "no_data": { en: "No data available", ar: "لا توجد بيانات متاحة" },
  "error": { en: "Something went wrong", ar: "حدث خطأ ما" },
  "welcome": { en: "Welcome back", ar: "مرحباً بعودتك" },
  "pipflow": { en: "PIPFLOW", ar: "بيب فلو" },
  "summary": { en: "Summary", ar: "ملخص" },
  "cancel": { en: "Cancel", ar: "إلغاء" },
  "create": { en: "Create", ar: "إنشاء" },
  "title_en": { en: "Title (English)", ar: "العنوان (إنجليزي)" },
  "title_ar": { en: "Title (Arabic)", ar: "العنوان (عربي)" },
  "summary_en": { en: "Summary (English)", ar: "الملخص (إنجليزي)" },
  "summary_ar": { en: "Summary (Arabic)", ar: "الملخص (عربي)" },
};

export const useLanguage = create<LanguageState>((set, get) => ({
  language: 'en',
  direction: 'ltr',
  setLanguage: (lang) => {
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = lang;
    set({ language: lang, direction });
  },
  t: (key) => {
    const lang = get().language;
    return translations[key]?.[lang] || key;
  },
}));

// Initialize helper
export const useLanguageInit = () => {
  const { setLanguage } = useLanguage();
  useEffect(() => {
    // Default to English, but could check localStorage here
    setLanguage('en');
  }, [setLanguage]);
};
