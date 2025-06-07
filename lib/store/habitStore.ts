import { create } from 'zustand';
import { generateUUID } from '../utils';
import { getDatabase } from '../db';

// Habit tipi tanımı
export type Habit = {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  target?: number;
  current?: number;
  unit?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  weekdays?: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  color: string;
  createdAt: string;
  updatedAt: string;
};

// Store tipi tanımı
interface HabitStore {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  
  // Fonksiyonlar
  fetchHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitCompletion: (id: string) => Promise<void>;
  incrementHabitProgress: (id: string, amount: number) => Promise<void>;
  resetHabitProgress: (id: string) => Promise<void>;
}

// Zustand store
export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  isLoading: false,
  error: null,
  
  // Alışkanlıkları veritabanından yükleme
  fetchHabits: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const db = getDatabase();
      
      const results = db.getAllSync<any>(
        'SELECT * FROM habits ORDER BY updatedAt DESC'
      );
      
      const habits: Habit[] = results.map(item => ({
        ...item,
        completedToday: !!item.completedToday, // boolean'a çevir
        weekdays: item.weekdays ? JSON.parse(item.weekdays) : undefined
      }));
      
      set({ habits, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Yeni alışkanlık ekleme
  addHabit: async (habit) => {
    set({ isLoading: true, error: null });
    
    const newHabit: Habit = {
      ...habit,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      const db = getDatabase();
      
      db.runSync(
        `INSERT INTO habits (
          id, name, streak, completedToday, target, current, unit, 
          frequency, weekdays, color, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newHabit.id,
          newHabit.name,
          newHabit.streak || 0,
          newHabit.completedToday ? 1 : 0,
          newHabit.target,
          newHabit.current,
          newHabit.unit,
          newHabit.frequency,
          newHabit.weekdays ? JSON.stringify(newHabit.weekdays) : null,
          newHabit.color,
          newHabit.createdAt,
          newHabit.updatedAt
        ]
      );
      
      set(state => ({
        habits: [newHabit, ...state.habits],
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Alışkanlık güncelleme
  updateHabit: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    const updatedAt = new Date().toISOString();
    const updatedHabit = { ...updates, updatedAt };
    
    try {
      const db = getDatabase();
      
      // Güncellenecek alanları ve değerlerini hazırlayalım
      const keys = Object.keys(updatedHabit).filter(key => key !== 'id');
      const values = keys.map(key => {
        // Özel işlemler
        if (key === 'weekdays') {
          return JSON.stringify(updatedHabit.weekdays);
        }
        if (key === 'completedToday') {
          return updatedHabit.completedToday ? 1 : 0;
        }
        return (updatedHabit as any)[key];
      });
      
      // SQL sorgusunu oluşturalım
      const setClause = keys.map(key => `${key} = ?`).join(', ');
      
      db.runSync(
        `UPDATE habits SET ${setClause} WHERE id = ?`,
        [...values, id]
      );
      
      set(state => ({
        habits: state.habits.map(habit => 
          habit.id === id 
            ? { ...habit, ...updatedHabit }
            : habit
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Alışkanlık silme
  deleteHabit: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const db = getDatabase();
      
      db.runSync('DELETE FROM habits WHERE id = ?', [id]);
      
      set(state => ({
        habits: state.habits.filter(habit => habit.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Alışkanlık tamamlama durumunu değiştirme
  toggleHabitCompletion: async (id) => {
    const { habits } = get();
    const habit = habits.find(h => h.id === id);
    
    if (!habit) {
      set({ error: 'Alışkanlık bulunamadı' });
      return;
    }
    
    const wasCompleted = habit.completedToday;
    const newStreak = wasCompleted 
      ? habit.streak - 1 
      : habit.streak + 1;
    
    await get().updateHabit(id, {
      completedToday: !wasCompleted,
      streak: Math.max(0, newStreak)
    });
  },
  
  // Alışkanlık ilerleme değerini artırma
  incrementHabitProgress: async (id, amount) => {
    const { habits } = get();
    const habit = habits.find(h => h.id === id);
    
    if (!habit || habit.target === undefined || habit.current === undefined) {
      set({ error: 'Alışkanlık bulunamadı veya hedef/değer tanımlanmamış' });
      return;
    }
    
    // Yeni ilerleme değeri
    const newCurrent = habit.current + amount;
    
    // Tamamlandı olarak işaretleme
    const completedToday = newCurrent >= habit.target;
    
    // Streki güncelleme
    const newStreak = completedToday && !habit.completedToday 
      ? habit.streak + 1 
      : habit.streak;
    
    await get().updateHabit(id, {
      current: newCurrent,
      completedToday,
      streak: newStreak
    });
  },
  
  // Alışkanlık ilerleme değerini sıfırlama
  resetHabitProgress: async (id) => {
    const { habits } = get();
    const habit = habits.find(h => h.id === id);
    
    if (!habit) {
      set({ error: 'Alışkanlık bulunamadı' });
      return;
    }
    
    await get().updateHabit(id, {
      current: 0,
      completedToday: false
    });
  }
})); 