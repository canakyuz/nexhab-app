import { create } from 'zustand';
import { generateUUID } from '../utils';
import { getDatabase } from '../db';

// UserStats tipi tanımı
export type UserStats = {
  id: string;
  date: string;
  completedHabits: number;
  completedTasks: number;
  streakDays: number;
  updatedAt: string;
};

// Store tipi tanımı
interface StatsStore {
  stats: UserStats | null;
  weeklyStats: UserStats[];
  monthlyStats: UserStats[];
  isLoading: boolean;
  error: string | null;
  
  // Fonksiyonlar
  fetchTodayStats: () => Promise<void>;
  fetchWeeklyStats: () => Promise<void>;
  fetchMonthlyStats: () => Promise<void>;
  updateStats: (updates: Partial<Omit<UserStats, 'id' | 'date' | 'updatedAt'>>) => Promise<void>;
  incrementCompletedHabits: () => Promise<void>;
  incrementCompletedTasks: () => Promise<void>;
  incrementStreakDays: () => Promise<void>;
}

// Bugünün tarihini YYYY-MM-DD formatında alma
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// İlk günün YYYY-MM-DD formatında hesaplanması
const getStartOfWeek = () => {
  const date = new Date();
  const day = date.getDay(); // 0 - Pazar, 1 - Pazartesi, ..., 6 - Cumartesi
  const diff = date.getDate() - day; // Haftanın başlangıcını (Pazar) hesapla
  const startOfWeek = new Date(date.setDate(diff));
  return startOfWeek.toISOString().split('T')[0];
};

// Ayın ilk gününü YYYY-MM-DD formatında hesaplama
const getStartOfMonth = () => {
  const date = new Date();
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  return startOfMonth.toISOString().split('T')[0];
};

// Zustand store
export const useStatsStore = create<StatsStore>((set, get) => ({
  stats: null,
  weeklyStats: [],
  monthlyStats: [],
  isLoading: false,
  error: null,
  
  // Bugünün istatistiklerini getirme
  fetchTodayStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const db = getDatabase();
      const today = getTodayDate();
      
      const result = db.getFirstSync<UserStats>(
        'SELECT * FROM user_stats WHERE date = ?',
        [today]
      );
      
      if (result) {
        set({ stats: result, isLoading: false });
      } else {
        // Bugün için kayıt yoksa oluştur
        const newStats: UserStats = {
          id: generateUUID(),
          date: today,
          completedHabits: 0,
          completedTasks: 0,
          streakDays: 0,
          updatedAt: new Date().toISOString()
        };
        
        db.runSync(
          `INSERT INTO user_stats (
            id, date, completedHabits, completedTasks, streakDays, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            newStats.id,
            newStats.date,
            newStats.completedHabits,
            newStats.completedTasks,
            newStats.streakDays,
            newStats.updatedAt
          ]
        );
        
        set({ stats: newStats, isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Haftalık istatistikleri getirme
  fetchWeeklyStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const db = getDatabase();
      const startDate = getStartOfWeek();
      
      const results = db.getAllSync<UserStats>(
        'SELECT * FROM user_stats WHERE date >= ? ORDER BY date ASC',
        [startDate]
      );
      
      set({ weeklyStats: results || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Aylık istatistikleri getirme
  fetchMonthlyStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const db = getDatabase();
      const startDate = getStartOfMonth();
      
      const results = db.getAllSync<UserStats>(
        'SELECT * FROM user_stats WHERE date >= ? ORDER BY date ASC',
        [startDate]
      );
      
      set({ monthlyStats: results || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // İstatistikleri güncelleme
  updateStats: async (updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const { stats } = get();
      if (!stats) {
        await get().fetchTodayStats();
        return;
      }
      
      const db = getDatabase();
      const updatedAt = new Date().toISOString();
      
      // Güncellenecek alanları ve değerlerini hazırlayalım
      const keys = Object.keys(updates);
      const values = keys.map(key => (updates as any)[key]);
      
      // SQL sorgusunu oluşturalım
      const setClause = keys.map(key => `${key} = ?`).join(', ');
      
      db.runSync(
        `UPDATE user_stats SET ${setClause}, updatedAt = ? WHERE id = ?`,
        [...values, updatedAt, stats.id]
      );
      
      set({ 
        stats: { 
          ...stats, 
          ...updates, 
          updatedAt 
        },
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Tamamlanan alışkanlık sayısını artırma
  incrementCompletedHabits: async () => {
    const { stats } = get();
    if (!stats) {
      await get().fetchTodayStats();
      return get().incrementCompletedHabits();
    }
    
    await get().updateStats({
      completedHabits: stats.completedHabits + 1
    });
  },
  
  // Tamamlanan görev sayısını artırma
  incrementCompletedTasks: async () => {
    const { stats } = get();
    if (!stats) {
      await get().fetchTodayStats();
      return get().incrementCompletedTasks();
    }
    
    await get().updateStats({
      completedTasks: stats.completedTasks + 1
    });
  },
  
  // Streak gün sayısını artırma
  incrementStreakDays: async () => {
    const { stats } = get();
    if (!stats) {
      await get().fetchTodayStats();
      return get().incrementStreakDays();
    }
    
    await get().updateStats({
      streakDays: stats.streakDays + 1
    });
  }
})); 