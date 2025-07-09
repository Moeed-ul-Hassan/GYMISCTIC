// GYMistic Offline Storage Manager
// Complete offline functionality with IndexedDB and localStorage

class GymisticOfflineStorage {
    constructor() {
        this.dbName = 'GymisticDB';
        this.version = 1;
        this.db = null;
        this.isOnline = navigator.onLine;
        this.syncQueue = [];
        
        // Initialize offline capabilities
        this.initDB();
        this.setupOfflineDetection();
        this.setupBackgroundSync();
    }

    // Initialize IndexedDB
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores for different data types
                const stores = [
                    'workoutSessions',
                    'bodyStats',
                    'mealPlans',
                    'moodLogs',
                    'userPreferences',
                    'calorieTracking',
                    'islamicQuotes',
                    'exerciseData',
                    'progressData'
                ];
                
                stores.forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        const store = db.createObjectStore(storeName, { keyPath: 'id' });
                        store.createIndex('date', 'date', { unique: false });
                        store.createIndex('type', 'type', { unique: false });
                    }
                });
            };
        });
    }

    // Setup offline detection
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showConnectionStatus('Online', 'success');
            this.syncPendingData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showConnectionStatus('Offline Mode', 'warning');
        });
    }

    // Background sync setup
    setupBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                return registration.sync.register('background-sync');
            });
        }
    }

    // Show connection status
    showConnectionStatus(message, type) {
        const statusDiv = document.createElement('div');
        statusDiv.className = `connection-status ${type}`;
        statusDiv.textContent = message;
        statusDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--neon-green)' : 'var(--accent-orange)'};
            color: var(--primary-bg);
            padding: 10px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-weight: 600;
            font-size: 0.9rem;
        `;
        
        document.body.appendChild(statusDiv);
        
        setTimeout(() => {
            statusDiv.remove();
        }, 3000);
    }

    // Generic save method
    async save(storeName, data) {
        try {
            if (!this.db) await this.initDB();
            
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            // Add timestamp and ID if not present
            if (!data.id) {
                data.id = this.generateId();
            }
            if (!data.createdAt) {
                data.createdAt = new Date().toISOString();
            }
            data.updatedAt = new Date().toISOString();
            
            const request = store.put(data);
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(data);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Error saving data:', error);
            throw error;
        }
    }

    // Generic get method
    async get(storeName, id) {
        try {
            if (!this.db) await this.initDB();
            
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Error getting data:', error);
            throw error;
        }
    }

    // Generic getAll method
    async getAll(storeName, filter = null) {
        try {
            if (!this.db) await this.initDB();
            
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    let results = request.result;
                    if (filter) {
                        results = results.filter(filter);
                    }
                    resolve(results);
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Error getting all data:', error);
            throw error;
        }
    }

    // Generic delete method
    async delete(storeName, id) {
        try {
            if (!this.db) await this.initDB();
            
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Error deleting data:', error);
            throw error;
        }
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Get today's date string
    getTodayString() {
        return new Date().toISOString().split('T')[0];
    }

    // Workout Session Methods
    async saveWorkoutSession(sessionData) {
        sessionData.type = 'workout';
        return await this.save('workoutSessions', sessionData);
    }

    async getWorkoutSessions(limit = 50) {
        const sessions = await this.getAll('workoutSessions');
        return sessions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
    }

    async getTodaysWorkout() {
        const today = this.getTodayString();
        const sessions = await this.getAll('workoutSessions', 
            session => session.date === today
        );
        return sessions.length > 0 ? sessions[0] : null;
    }

    // Body Stats Methods
    async saveBodyStats(statsData) {
        statsData.type = 'bodyStats';
        return await this.save('bodyStats', statsData);
    }

    async getBodyStats(limit = 30) {
        const stats = await this.getAll('bodyStats');
        return stats.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
    }

    async getLatestBodyStats() {
        const stats = await this.getBodyStats(1);
        return stats.length > 0 ? stats[0] : null;
    }

    // Meal Plan Methods
    async saveMealPlan(mealData) {
        mealData.type = 'mealPlan';
        return await this.save('mealPlans', mealData);
    }

    async getMealPlans(limit = 30) {
        const meals = await this.getAll('mealPlans');
        return meals.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
    }

    async getTodaysMealPlan() {
        const today = this.getTodayString();
        const meals = await this.getAll('mealPlans', 
            meal => meal.date === today
        );
        return meals.length > 0 ? meals[0] : null;
    }

    // Mood Log Methods
    async saveMoodLog(moodData) {
        moodData.type = 'moodLog';
        return await this.save('moodLogs', moodData);
    }

    async getMoodLogs(limit = 30) {
        const moods = await this.getAll('moodLogs');
        return moods.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
    }

    async getTodaysMood() {
        const today = this.getTodayString();
        const moods = await this.getAll('moodLogs', 
            mood => mood.date === today
        );
        return moods.length > 0 ? moods[0] : null;
    }

    // User Preferences Methods
    async saveUserPreferences(preferencesData) {
        preferencesData.id = 'userPreferences';
        preferencesData.type = 'preferences';
        return await this.save('userPreferences', preferencesData);
    }

    async getUserPreferences() {
        return await this.get('userPreferences', 'userPreferences');
    }

    // Calorie Tracking Methods
    async saveCalorieTracking(calorieData) {
        calorieData.type = 'calorieTracking';
        return await this.save('calorieTracking', calorieData);
    }

    async getCalorieTracking(limit = 30) {
        const calories = await this.getAll('calorieTracking');
        return calories.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
    }

    async getTodaysCalories() {
        const today = this.getTodayString();
        const calories = await this.getAll('calorieTracking', 
            calorie => calorie.date === today
        );
        return calories.length > 0 ? calories[0] : null;
    }

    // Progress Data Methods
    async saveProgressData(progressData) {
        progressData.type = 'progress';
        return await this.save('progressData', progressData);
    }

    async getProgressData(limit = 50) {
        const progress = await this.getAll('progressData');
        return progress.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
    }

    // Islamic Quotes Methods
    async saveIslamicQuote(quoteData) {
        quoteData.type = 'islamicQuote';
        return await this.save('islamicQuotes', quoteData);
    }

    async getIslamicQuotes() {
        return await this.getAll('islamicQuotes');
    }

    // Exercise Data Methods
    async saveExerciseData(exerciseData) {
        exerciseData.type = 'exercise';
        return await this.save('exerciseData', exerciseData);
    }

    async getExerciseData() {
        return await this.getAll('exerciseData');
    }

    // Data Export/Import Methods
    async exportAllData() {
        const exportData = {
            workoutSessions: await this.getAll('workoutSessions'),
            bodyStats: await this.getAll('bodyStats'),
            mealPlans: await this.getAll('mealPlans'),
            moodLogs: await this.getAll('moodLogs'),
            userPreferences: await this.getAll('userPreferences'),
            calorieTracking: await this.getAll('calorieTracking'),
            progressData: await this.getAll('progressData'),
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(exportData, null, 2);
    }

    async importAllData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            // Import each data type
            const stores = [
                'workoutSessions', 'bodyStats', 'mealPlans', 'moodLogs',
                'userPreferences', 'calorieTracking', 'progressData'
            ];
            
            for (const storeName of stores) {
                if (data[storeName]) {
                    for (const item of data[storeName]) {
                        await this.save(storeName, item);
                    }
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            throw error;
        }
    }

    // Clear all data
    async clearAllData() {
        const stores = [
            'workoutSessions', 'bodyStats', 'mealPlans', 'moodLogs',
            'userPreferences', 'calorieTracking', 'progressData', 'islamicQuotes', 'exerciseData'
        ];
        
        for (const storeName of stores) {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            await store.clear();
        }
    }

    // Sync pending data (when back online)
    async syncPendingData() {
        if (this.syncQueue.length > 0) {
            console.log('Syncing pending data...');
            
            for (const item of this.syncQueue) {
                try {
                    // Process sync queue items
                    await this.processSyncItem(item);
                } catch (error) {
                    console.error('Error syncing item:', error);
                }
            }
            
            this.syncQueue = [];
            this.showConnectionStatus('Data synced successfully', 'success');
        }
    }

    // Process individual sync item
    async processSyncItem(item) {
        // This would typically sync with a server
        // For now, we'll just log it
        console.log('Processing sync item:', item);
    }

    // Get storage usage
    async getStorageUsage() {
        if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate();
            return {
                used: estimate.usage,
                quota: estimate.quota,
                usedMB: Math.round(estimate.usage / 1024 / 1024),
                quotaMB: Math.round(estimate.quota / 1024 / 1024),
                usagePercentage: Math.round((estimate.usage / estimate.quota) * 100)
            };
        }
        return null;
    }

    // Initialize default data
    async initializeDefaultData() {
        // Add default Islamic quotes
        const defaultQuotes = [
            {
                id: 'quote1',
                text: 'La hawla wa la quwwata illa billah',
                translation: 'There is no power except with Allah',
                category: 'strength',
                romanUrdu: 'La hawla wa la quwwata illa billah'
            },
            {
                id: 'quote2',
                text: 'Sabr ka phal meetha hota hai',
                translation: 'The fruit of patience is sweet',
                category: 'sabr',
                romanUrdu: 'Sabr ka phal meetha hota hai'
            },
            {
                id: 'quote3',
                text: 'Allah sirf unhi ki madad karta hai jo apni madad karte hain',
                translation: 'Allah only helps those who help themselves',
                category: 'effort',
                romanUrdu: 'Allah sirf unhi ki madad karta hai jo apni madad karte hain'
            },
            {
                id: 'quote4',
                text: 'Jism amanat hai, iska khayal rakho',
                translation: 'The body is a trust, take care of it',
                category: 'health',
                romanUrdu: 'Jism amanat hai, iska khayal rakho'
            },
            {
                id: 'quote5',
                text: 'Har subah Allah ki rehmat ka naya din hai',
                translation: 'Every morning is a new day of Allah\'s mercy',
                category: 'hope',
                romanUrdu: 'Har subah Allah ki rehmat ka naya din hai'
            }
        ];

        // Save default quotes
        for (const quote of defaultQuotes) {
            await this.saveIslamicQuote(quote);
        }

        // Add default exercise data
        const defaultExercises = [
            {
                id: 'ex1',
                name: 'Bench Press',
                category: 'chest',
                equipment: ['Barbell', 'Bench'],
                instructions: ['Lie on bench', 'Grip barbell', 'Lower to chest', 'Press up'],
                muscleGroups: ['Chest', 'Triceps', 'Shoulders']
            },
            {
                id: 'ex2',
                name: 'Squats',
                category: 'legs',
                equipment: ['Barbell', 'Squat Rack'],
                instructions: ['Stand with feet shoulder-width', 'Lower down', 'Keep chest up', 'Return to start'],
                muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings']
            },
            {
                id: 'ex3',
                name: 'Pull-ups',
                category: 'back',
                equipment: ['Pull-up Bar'],
                instructions: ['Hang from bar', 'Pull chest to bar', 'Lower with control', 'Repeat'],
                muscleGroups: ['Latissimus Dorsi', 'Biceps', 'Rhomboids']
            }
        ];

        // Save default exercises
        for (const exercise of defaultExercises) {
            await this.saveExerciseData(exercise);
        }

        console.log('Default data initialized');
    }
}

// Initialize the storage system
const gymisticStorage = new GymisticOfflineStorage();

// Export for global use
window.gymisticStorage = gymisticStorage;