import { create } from 'zustand';
import { generateUUID } from '../utils';
import { getDatabase } from '../db';

// Task tipi tanımı
export type Task = {
  id: string;
  name: string;
  completed: boolean;
  date: string;
  time?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

// Store tipi tanımı
interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  
  // Fonksiyonlar
  fetchTasks: (date?: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  fetchTasksByCategory: (category: string) => Promise<void>;
  fetchTasksByPriority: (priority: Task['priority']) => Promise<void>;
}

// Zustand store
export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  
  // Görevleri veritabanından yükleme
  fetchTasks: async (date) => {
    set({ isLoading: true, error: null });
    
    try {
      const db = getDatabase();
      
      let query = 'SELECT * FROM tasks';
      let params: any[] = [];
      
      if (date) {
        query += ' WHERE date = ?';
        params.push(date);
      }
      
      query += ' ORDER BY time ASC, priority DESC';
      
      const result = db.getFirstSync(query, params);
      const tasks: Task[] = [];
      
      if (result && 'rows' in result) {
        for (let i = 0; i < result.rows.length; i++) {
          const item = result.rows.item(i);
          tasks.push({
            ...item,
            completed: !!item.completed,
          });
        }
      }
      
      set({ tasks, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Yeni görev ekleme
  addTask: async (task) => {
    set({ isLoading: true, error: null });
    
    const newTask: Task = {
      ...task,
      id: generateUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      const db = getDatabase();
      
      db.runSync(
        `INSERT INTO tasks (
          id, name, completed, date, time, priority, category, note, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newTask.id,
          newTask.name,
          newTask.completed ? 1 : 0,
          newTask.date,
          newTask.time || null,
          newTask.priority || null,
          newTask.category || null,
          newTask.note || null,
          newTask.createdAt,
          newTask.updatedAt
        ]
      );
      
      set(state => ({
        tasks: [newTask, ...state.tasks],
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Görev güncelleme
  updateTask: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    const updatedAt = new Date().toISOString();
    const updatedTask = { ...updates, updatedAt };
    
    try {
      const db = getDatabase();
      
      // Güncellenecek alanları ve değerlerini hazırlayalım
      const keys = Object.keys(updatedTask).filter(key => key !== 'id');
      const values = keys.map(key => {
        if (key === 'completed') {
          return updatedTask[key] ? 1 : 0;
        }
        return updatedTask[key];
      });
      
      // SQL sorgusunu oluşturalım
      const setClause = keys.map(key => `${key} = ?`).join(', ');
      
      db.runSync(
        `UPDATE tasks SET ${setClause} WHERE id = ?`,
        [...values, id]
      );
      
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === id 
            ? { ...task, ...updatedTask }
            : task
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Görev silme
  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const db = getDatabase();
      
      db.runSync('DELETE FROM tasks WHERE id = ?', [id]);
      
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Görev tamamlama durumunu değiştirme
  toggleTaskCompletion: async (id) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
      set({ error: 'Görev bulunamadı' });
      return;
    }
    
    await get().updateTask(id, {
      completed: !task.completed
    });
  },
  
  // Kategori bazlı görevleri getirme
  fetchTasksByCategory: async (category) => {
    set({ isLoading: true, error: null });
    
    try {
      const db = getDatabase();
      
      const result = db.getFirstSync(
        'SELECT * FROM tasks WHERE category = ? ORDER BY date, time ASC',
        [category]
      );
      
      const tasks: Task[] = [];
      
      if (result && 'rows' in result) {
        for (let i = 0; i < result.rows.length; i++) {
          const item = result.rows.item(i);
          tasks.push({
            ...item,
            completed: !!item.completed,
          });
        }
      }
      
      set({ tasks, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // Öncelik bazlı görevleri getirme
  fetchTasksByPriority: async (priority) => {
    set({ isLoading: true, error: null });
    
    try {
      const db = getDatabase();
      
      const result = db.getFirstSync(
        'SELECT * FROM tasks WHERE priority = ? ORDER BY date, time ASC',
        [priority]
      );
      
      const tasks: Task[] = [];
      
      if (result && 'rows' in result) {
        for (let i = 0; i < result.rows.length; i++) {
          const item = result.rows.item(i);
          tasks.push({
            ...item,
            completed: !!item.completed,
          });
        }
      }
      
      set({ tasks, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  }
})); 