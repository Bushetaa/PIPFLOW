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
  "pipflow": { en: "PIPFLOW", ar: "PIPFLOW" },
  "summary": { en: "Summary", ar: "ملخص" },
  "status": { en: "Status", ar: "الحالة" },
  "cancel": { en: "Cancel", ar: "إلغاء" },
  "create": { en: "Create", ar: "إنشاء" },
  "title_en": { en: "Title (English)", ar: "العنوان (إنجليزي)" },
  "title_ar": { en: "Title (Arabic)", ar: "العنوان (عربي)" },
  "summary_en": { en: "Summary (English)", ar: "الملخص (إنجليزي)" },
  "summary_ar": { en: "Summary (Arabic)", ar: "الملخص (عربي)" },
  "platform_tagline": { en: "Market Analysis Platform", ar: "منصة تحليل السوق" },
  "market_insights": { en: "Professional real-time market insights and automated technical analysis for top financial pairs.", ar: "رؤى احترافية لحظية للسوق وتحليل فني آلي لأهم الأزواج المالية." },
  "strategy": { en: "Strategy", ar: "استراتيجية" },
  "not_found_title": { en: "404 Page Not Found", ar: "404 الصفحة غير موجودة" },
  "not_found_hint": { en: "Did you forget to add the page to the router?", ar: "هل نسيت إضافة الصفحة إلى نظام التوجيه؟" },
  "english_content": { en: "English Content", ar: "المحتوى الإنجليزي" },
  "arabic_content": { en: "Arabic Content", ar: "المحتوى العربي" },
  "select_timeframe": { en: "Select timeframe", ar: "اختر الإطار الزمني" },
  "select_sentiment": { en: "Select sentiment", ar: "اختر الحالة" },
  "success": { en: "Success", ar: "نجاح" },
  "report_created": { en: "Report created successfully", ar: "تم إنشاء التقرير بنجاح" },
  "discussion": { en: "Discussion", ar: "المناقشة" },
  "decision": { en: "Decision", ar: "القرار" },
  "discussion_decision": { en: "Discussion & Decision", ar: "المناقشة والقرار" },
  "no_discussion_available": { en: "No discussion available for this report.", ar: "لا توجد مناقشة متاحة لهذا التقرير." },
  "decision_placeholder": { en: "Strategic decision and action plan will be displayed here based on the analysis.", ar: "سيتم عرض القرار الاستراتيجي وخطة العمل هنا بناءً على التحليل." },
  "home": { en: "Home", ar: "الصفحة الرئيسية" },
  "back": { en: "Back", ar: "رجوع" },
  "back_to_home": { en: "Back to Home", ar: "الرجوع للصفحة الرئيسية" },
};

export const useLanguage = create<LanguageState>((set, get) => ({
  language: 'en',
  direction: 'ltr',
  setLanguage: (lang) => {
    document.documentElement.lang = lang;
    set({ language: lang, direction: 'ltr' });
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
