export const NAV_THEME = {
  light: {
    background: 'hsl(0 0% 100%)', // background
    border: 'hsl(240 5.9% 90%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(0 84.2% 60.2%)', // destructive
    primary: 'hsl(240 5.9% 10%)', // primary
    text: 'hsl(240 10% 3.9%)', // foreground
  },
  dark: {
    background: 'hsl(240 10% 3.9%)', // background
    border: 'hsl(240 3.7% 15.9%)', // border
    card: 'hsl(240 10% 3.9%)', // card
    notification: 'hsl(0 72% 51%)', // destructive
    primary: 'hsl(0 0% 98%)', // primary
    text: 'hsl(0 0% 98%)', // foreground
  },
};

// Uygulama genelinde kullanılacak sabitler

export const DATABASE_NAME = 'nexhab.db';
export const DATABASE_VERSION = '1.0';

// Uygulamanın ana renkleri
export const COLORS = {
  primary: 'hsl(221, 83%, 53%)', // Mavi
  secondary: 'hsl(210, 40%, 96%)', // Açık Mavi
  success: 'hsl(142, 76%, 36%)', // Yeşil
  warning: 'hsl(38, 92%, 50%)', // Turuncu
  danger: 'hsl(0, 84%, 60%)', // Kırmızı
  neutral: 'hsl(222, 47%, 11%)', // Koyu Gri
  background: 'hsl(210, 40%, 98%)', // Arka plan
  card: 'hsl(0, 0%, 100%)', // Kart arka planı
  muted: 'hsl(214, 32%, 91%)', // Soluk renk
  mutedForeground: 'hsl(215, 16%, 47%)', // Soluk metin rengi
};

// Alışkanlık kategorileri ve ikonları
export const HABIT_CATEGORIES = [
  { id: 'health', name: 'Sağlık', icon: '🧠', color: 'bg-red-400' },
  { id: 'fitness', name: 'Fitness', icon: '💪', color: 'bg-blue-400' },
  { id: 'productivity', name: 'Üretkenlik', icon: '📝', color: 'bg-yellow-400' },
  { id: 'mindfulness', name: 'Zihinsel', icon: '🧘‍♂️', color: 'bg-purple-400' },
  { id: 'learning', name: 'Öğrenme', icon: '📚', color: 'bg-green-400' },
  { id: 'finance', name: 'Finans', icon: '💰', color: 'bg-emerald-400' },
  { id: 'social', name: 'Sosyal', icon: '👋', color: 'bg-pink-400' },
  { id: 'sleep', name: 'Uyku', icon: '😴', color: 'bg-indigo-400' },
  { id: 'nutrition', name: 'Beslenme', icon: '🥗', color: 'bg-orange-400' },
  { id: 'hydration', name: 'Hidrasyon', icon: '💧', color: 'bg-sky-400' },
  { id: 'custom', name: 'Özel', icon: '✨', color: 'bg-gray-400' },
];

// Alışkanlık ikonları
export const HABIT_ICONS = [
  '💧', '🏃‍♂️', '🧘‍♂️', '🥗', '📚', '💪', '🧠', '💤', '🚰', '💰', '📝', '🎯', '🏆', '🚴‍♂️', '🏋️‍♂️',
  '🧹', '🪴', '🍎', '🥦', '🥕', '🍓', '🌱', '⏰', '📱', '🧠', '🎵', '🎨', '📊', '🌞', '🌙', '🔋'
];

// Frekans seçenekleri
export const FREQUENCY_OPTIONS = [
  { id: 'daily', name: 'Her Gün' },
  { id: 'weekly', name: 'Haftada Birkaç Kez' },
  { id: 'monthly', name: 'Ayda Birkaç Kez' },
  { id: 'custom', name: 'Özel' },
];

// Gün isimleri
export const WEEKDAYS = [
  { id: 'monday', name: 'Pazartesi', short: 'Pzt' },
  { id: 'tuesday', name: 'Salı', short: 'Sal' },
  { id: 'wednesday', name: 'Çarşamba', short: 'Çar' },
  { id: 'thursday', name: 'Perşembe', short: 'Per' },
  { id: 'friday', name: 'Cuma', short: 'Cum' },
  { id: 'saturday', name: 'Cumartesi', short: 'Cmt' },
  { id: 'sunday', name: 'Pazar', short: 'Paz' },
];
