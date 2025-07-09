import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface GymisticDB extends DBSchema {
  workoutSessions: {
    key: string;
    value: any;
  };
  bodyStats: {
    key: string;
    value: any;
  };
  mealPlans: {
    key: string;
    value: any;
  };
  moodLogs: {
    key: string;
    value: any;
  };
  userPreferences: {
    key: string;
    value: any;
  };
  calorieTracking: {
    key: string;
    value: any;
  };
}

class IndexedDBManager {
  private db: IDBPDatabase<GymisticDB> | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<GymisticDB>('gymistic-db', 1, {
      upgrade(db) {
        // Create object stores
        if (!db.objectStoreNames.contains('workoutSessions')) {
          db.createObjectStore('workoutSessions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('bodyStats')) {
          db.createObjectStore('bodyStats', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('mealPlans')) {
          db.createObjectStore('mealPlans', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('moodLogs')) {
          db.createObjectStore('moodLogs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('userPreferences')) {
          db.createObjectStore('userPreferences', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('calorieTracking')) {
          db.createObjectStore('calorieTracking', { keyPath: 'id' });
        }
      },
    });
  }

  async get<T>(storeName: keyof GymisticDB, key: string): Promise<T | undefined> {
    await this.init();
    return this.db!.get(storeName, key);
  }

  async getAll<T>(storeName: keyof GymisticDB): Promise<T[]> {
    await this.init();
    return this.db!.getAll(storeName);
  }

  async set<T>(storeName: keyof GymisticDB, value: T): Promise<void> {
    await this.init();
    await this.db!.put(storeName, value);
  }

  async delete(storeName: keyof GymisticDB, key: string): Promise<void> {
    await this.init();
    await this.db!.delete(storeName, key);
  }

  async clear(storeName: keyof GymisticDB): Promise<void> {
    await this.init();
    await this.db!.clear(storeName);
  }

  async exportData(): Promise<Record<string, any[]>> {
    await this.init();
    const data: Record<string, any[]> = {};
    
    const storeNames: (keyof GymisticDB)[] = [
      'workoutSessions',
      'bodyStats',
      'mealPlans',
      'moodLogs',
      'userPreferences',
      'calorieTracking'
    ];

    for (const storeName of storeNames) {
      data[storeName] = await this.getAll(storeName);
    }

    return data;
  }

  async importData(data: Record<string, any[]>): Promise<void> {
    await this.init();
    
    for (const [storeName, items] of Object.entries(data)) {
      if (storeName in this.db!.objectStoreNames) {
        await this.clear(storeName as keyof GymisticDB);
        for (const item of items) {
          await this.set(storeName as keyof GymisticDB, item);
        }
      }
    }
  }
}

export const indexedDB = new IndexedDBManager();
