import * as SQLite from 'expo-sqlite';

// Veritabanı bağlantısı
export const getDatabase = () => {
  return SQLite.openDatabaseSync('atomic-habits.db');
};

// Veritabanı tablolarını oluşturma
export const initializeDatabase = async (): Promise<void> => {
  const db = getDatabase();

  // Alışkanlıklar tablosu
  db.execSync(`
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      streak INTEGER DEFAULT 0,
      completedToday INTEGER DEFAULT 0,
      target REAL,
      current REAL,
      unit TEXT,
      frequency TEXT NOT NULL,
      weekdays TEXT,
      color TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  // Görevler tablosu
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      date TEXT NOT NULL,
      time TEXT,
      priority TEXT,
      category TEXT,
      note TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  // Kullanıcı istatistikleri tablosu
  db.execSync(`
    CREATE TABLE IF NOT EXISTS user_stats (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      completedHabits INTEGER DEFAULT 0,
      completedTasks INTEGER DEFAULT 0,
      streakDays INTEGER DEFAULT 0,
      updatedAt TEXT NOT NULL
    )
  `);
};

// Veritabanı işlemleri için yardımcı fonksiyonlar
export const dbHelper = {
  // Veritabanına bağlan
  getDatabase,

  // Sorgu çalıştır ve sonuçları döndür
  executeQuery<T>(query: string, params: any[] = []): T[] {
    const db = this.getDatabase();
    const result = db.execSync(query, params);
    
    if (result && 'rows' in result) {
      return result.rows as unknown as T[];
    }
    
    return [];
  },

  // Tek bir satır getir
  getOne<T>(query: string, params: any[] = []): T | null {
    const results = this.executeQuery<T>(query, params);
    return results.length > 0 ? results[0] : null;
  },

  // Kayıt ekle
  insert(table: string, data: Record<string, any>): number {
    const db = this.getDatabase();
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    const result = db.execSync(query, values);
    
    if (result && 'lastInsertRowId' in result) {
      return result.lastInsertRowId as number;
    }
    
    return 0;
  },

  // Kayıt güncelle
  update(table: string, data: Record<string, any>, whereClause: string, whereParams: any[] = []): number {
    const db = this.getDatabase();
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), ...whereParams];

    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const result = db.execSync(query, values);
    
    if (result && 'changes' in result) {
      return result.changes as number;
    }
    
    return 0;
  },

  // Kayıt sil
  delete(table: string, whereClause: string, whereParams: any[] = []): number {
    const db = this.getDatabase();
    const query = `DELETE FROM ${table} WHERE ${whereClause}`;
    const result = db.execSync(query, whereParams);
    
    if (result && 'changes' in result) {
      return result.changes as number;
    }
    
    return 0;
  }
}; 