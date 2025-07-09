// GYMistic - Islamic Fitness App JavaScript

// App State
let currentPage = 'home';
let breathingInterval = null;
let breathingPhase = 'inhale';
let breathingCount = 4;
let breathingCycle = 0;
let workoutTimer = null;
let workoutTime = 0;
let restTimer = null;
let restTime = 60;
let offlineStorage = null;

// Islamic Quotes Data
const islamicQuotes = [
    {
        text: "La hawla wa la quwwata illa billah",
        translation: "There is no power except with Allah",
        category: "strength"
    },
    {
        text: "Sabr ka phal meetha hota hai",
        translation: "The fruit of patience is sweet",
        category: "sabr"
    },
    {
        text: "Allah sirf unhi ki madad karta hai jo apni madad karte hain",
        translation: "Allah only helps those who help themselves",
        category: "effort"
    },
    {
        text: "Jism amanat hai, iska khayal rakho",
        translation: "The body is a trust, take care of it",
        category: "health"
    },
    {
        text: "Har subah Allah ki rehmat ka naya din hai",
        translation: "Every morning is a new day of Allah's mercy",
        category: "hope"
    },
    {
        text: "Maqsad se mehnat karo, natija Allah par choro",
        translation: "Work with purpose, leave the result to Allah",
        category: "effort"
    }
];

// Dhikr for breathing exercises
const dhikrList = [
    {
        text: "La hawla wa la quwwata illa billah",
        translation: "There is no power except with Allah"
    },
    {
        text: "Subhan Allah wa bihamdihi",
        translation: "Glory be to Allah and praise be to Him"
    },
    {
        text: "Alhamdulillahi rabbil alameen",
        translation: "All praise is due to Allah, Lord of the worlds"
    },
    {
        text: "La ilaha illa Allah",
        translation: "There is no god but Allah"
    },
    {
        text: "Allah huma salli ala Muhammad",
        translation: "O Allah, send prayers upon Muhammad"
    }
];

// Workout Data
const workoutExercises = [
    {
        id: 1,
        name: "Bench Press",
        sets: 4,
        reps: "8-10",
        muscle: "chest"
    },
    {
        id: 2,
        name: "Incline Dumbbell Press",
        sets: 3,
        reps: "10-12",
        muscle: "chest"
    },
    {
        id: 3,
        name: "Tricep Dips",
        sets: 3,
        reps: "12-15",
        muscle: "triceps"
    },
    {
        id: 4,
        name: "Overhead Press",
        sets: 4,
        reps: "8-10",
        muscle: "shoulders"
    }
];

// Meal Data
const mealData = {
    breakfast: [
        { name: "Aloo Paratha with Dahi", calories: 480, cost: 80 },
        { name: "Omelette with Roti", calories: 350, cost: 60 },
        { name: "Halwa Puri", calories: 650, cost: 120 }
    ],
    lunch: [
        { name: "Chicken Karahi with Rice", calories: 650, cost: 200 },
        { name: "Beef Biryani", calories: 780, cost: 250 },
        { name: "Daal Chawal with Sabzi", calories: 450, cost: 100 }
    ],
    dinner: [
        { name: "Daal Chawal with Salad", calories: 420, cost: 120 },
        { name: "Chicken Tikka with Naan", calories: 580, cost: 180 },
        { name: "Vegetable Curry with Rice", calories: 380, cost: 90 }
    ],
    snack: [
        { name: "Mixed Nuts (30g)", calories: 180, cost: 50 },
        { name: "Banana with Peanut Butter", calories: 220, cost: 40 },
        { name: "Yogurt with Honey", calories: 150, cost: 35 }
    ]
};

// DOM Elements
const preloader = document.getElementById('preloader');
const app = document.getElementById('app');
const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('.nav-btn');
const breathingModal = document.getElementById('breathing-modal');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
    
    // Show preloader animation
    setTimeout(() => {
        preloader.style.display = 'none';
        app.classList.remove('hidden');
        initializeApp();
    }, 4000);
});

async function initializeApp() {
    // Wait for offline storage to be ready
    offlineStorage = window.gymisticStorage;
    
    // Initialize default data if needed
    await initializeDefaultData();
    
    // Set up navigation
    setupNavigation();
    
    // Load daily quote from offline storage
    await loadDailyQuote();
    
    // Initialize mood tracking
    initializeMoodTracking();
    
    // Set up workout timer
    setupWorkoutTimer();
    
    // Load meal data from offline storage
    await loadMealData();
    
    // Load user preferences
    await loadUserPreferences();
    
    // Load today's data
    await loadTodaysData();
    
    // Update progress charts
    updateProgressCharts();
    
    // Show home page
    showPage('home');
    
    // Show offline capabilities
    showOfflineCapabilities();
    
    // Setup offline indicator
    setupOfflineIndicator();
}

// Setup offline indicator
function setupOfflineIndicator() {
    const offlineIndicator = document.getElementById('offline-indicator');
    
    // Show/hide offline indicator based on connection status
    function updateOfflineIndicator() {
        if (navigator.onLine) {
            offlineIndicator.classList.add('hidden');
        } else {
            offlineIndicator.classList.remove('hidden');
        }
    }
    
    // Initial check
    updateOfflineIndicator();
    
    // Listen for online/offline events
    window.addEventListener('online', updateOfflineIndicator);
    window.addEventListener('offline', updateOfflineIndicator);
    
    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data.type === 'SYNC_COMPLETE') {
                showNotification('Data synced successfully!', 'success');
            }
        });
    }
}

// Initialize default data
async function initializeDefaultData() {
    try {
        // Check if we already have quotes
        const quotes = await offlineStorage.getIslamicQuotes();
        if (quotes.length === 0) {
            await offlineStorage.initializeDefaultData();
        }
    } catch (error) {
        console.error('Error initializing default data:', error);
    }
}

// Show offline capabilities notification
function showOfflineCapabilities() {
    const isOffline = !navigator.onLine;
    const message = isOffline ? 
        'App is ready for offline use! All data is saved locally.' :
        'App is ready! Works offline with local data storage.';
    
    setTimeout(() => {
        showNotification(message, 'success');
    }, 1000);
}

// Navigation
function setupNavigation() {
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.dataset.page;
            showPage(page);
            updateNavigation(page);
        });
    });
}

function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId + '-page') {
            page.classList.add('active');
        }
    });
    currentPage = pageId;
    
    // Trigger page-specific animations
    animatePageTransition();
}

function updateNavigation(activePageId) {
    navButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.page === activePageId) {
            button.classList.add('active');
        }
    });
}

function animatePageTransition() {
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        activePage.style.animation = 'fadeIn 0.3s ease';
    }
}

// Daily Quote
async function loadDailyQuote() {
    try {
        const quotes = await offlineStorage.getIslamicQuotes();
        const today = new Date().getDay();
        const quote = quotes[today % quotes.length] || islamicQuotes[today % islamicQuotes.length];
        
        document.getElementById('daily-quote').textContent = quote.text || quote.romanUrdu;
        document.getElementById('quote-translation').textContent = quote.translation;
        
        // Animate quote appearance
        const quoteCard = document.querySelector('.quote-card');
        quoteCard.style.animation = 'slideUp 0.5s ease';
    } catch (error) {
        console.error('Error loading daily quote:', error);
        // Fallback to static quotes
        const today = new Date().getDay();
        const quote = islamicQuotes[today % islamicQuotes.length];
        document.getElementById('daily-quote').textContent = quote.text;
        document.getElementById('quote-translation').textContent = quote.translation;
    }
}

// Mood Tracking
function initializeMoodTracking() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            moodButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const mood = button.dataset.mood;
            saveMood(mood);
            
            // Animate button
            button.style.animation = 'pulse 0.5s ease';
        });
    });
}

async function saveMood(mood) {
    const today = new Date().toISOString().split('T')[0];
    
    // Save to offline storage
    const moodData = {
        date: today,
        mood: mood,
        moodScore: getMoodScore(mood),
        timestamp: new Date().toISOString()
    };
    
    try {
        await offlineStorage.saveMoodLog(moodData);
        showNotification('Mood saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving mood:', error);
        // Fallback to localStorage
        localStorage.setItem(`mood_${today}`, mood);
    }
    
    // Update mood display
    const moodEmojis = {
        happy: '😊',
        good: '😌',
        neutral: '😐',
        stressed: '😰',
        sad: '😢'
    };
    
    // Update stats if exists
    const moodStat = document.querySelector('.stat-card .stat-value');
    if (moodStat && moodStat.textContent.match(/[😊😌😐😰😢]/)) {
        moodStat.textContent = moodEmojis[mood];
    }
}

function getMoodScore(mood) {
    const scores = {
        happy: 5,
        good: 4,
        neutral: 3,
        stressed: 2,
        sad: 1
    };
    return scores[mood] || 3;
}

// Workout Functions
function setupWorkoutTimer() {
    const timerBtn = document.getElementById('timer-btn');
    const timerDisplay = document.getElementById('workout-time');
    
    if (timerBtn) {
        timerBtn.addEventListener('click', () => {
            if (workoutTimer) {
                pauseWorkout();
            } else {
                startWorkout();
            }
        });
    }
}

function startWorkout() {
    const timerBtn = document.getElementById('timer-btn');
    const timerDisplay = document.getElementById('workout-time');
    
    workoutTimer = setInterval(() => {
        workoutTime++;
        const minutes = Math.floor(workoutTime / 60);
        const seconds = workoutTime % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
    
    timerBtn.innerHTML = '<i class="fas fa-pause"></i>';
    timerBtn.classList.add('active');
    
    // Animate timer start
    timerDisplay.style.animation = 'pulse 1s ease';
}

function pauseWorkout() {
    clearInterval(workoutTimer);
    workoutTimer = null;
    
    const timerBtn = document.getElementById('timer-btn');
    timerBtn.innerHTML = '<i class="fas fa-play"></i>';
    timerBtn.classList.remove('active');
}

function completeSet() {
    const repsInput = document.getElementById('reps-input');
    const weightInput = document.getElementById('weight-input');
    const restTimerEl = document.getElementById('rest-timer');
    
    if (repsInput && weightInput && restTimerEl) {
        const reps = repsInput.value;
        const weight = weightInput.value;
        
        // Save set data
        saveSetData(reps, weight);
        
        // Show rest timer
        showRestTimer();
        
        // Update progress
        updateWorkoutProgress();
        
        // Show success animation
        const completeBtn = document.querySelector('.complete-set-btn');
        completeBtn.style.animation = 'pulse 0.5s ease';
        completeBtn.innerHTML = '<i class="fas fa-check"></i> Set Completed!';
        
        setTimeout(() => {
            completeBtn.innerHTML = '<i class="fas fa-check"></i> Complete Set';
        }, 2000);
    }
}

async function saveSetData(reps, weight) {
    const today = new Date().toISOString().split('T')[0];
    const setData = {
        date: today,
        reps: parseInt(reps),
        weight: parseFloat(weight),
        exercise: document.getElementById('current-exercise-name').textContent,
        timestamp: new Date().toISOString(),
        workoutType: 'push' // This would be dynamic based on current workout
    };
    
    try {
        // Get existing workout session for today or create new one
        let workoutSession = await offlineStorage.getTodaysWorkout();
        
        if (!workoutSession) {
            workoutSession = {
                date: today,
                type: 'push',
                sets: [],
                startTime: new Date().toISOString(),
                completed: false
            };
        }
        
        // Add set to workout session
        workoutSession.sets.push(setData);
        workoutSession.updatedAt = new Date().toISOString();
        
        await offlineStorage.saveWorkoutSession(workoutSession);
        showNotification('Set saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving set data:', error);
        // Fallback to localStorage
        let workoutData = JSON.parse(localStorage.getItem('workoutData') || '[]');
        workoutData.push(setData);
        localStorage.setItem('workoutData', JSON.stringify(workoutData));
    }
}

function showRestTimer() {
    const restTimerEl = document.getElementById('rest-timer');
    const restTimeEl = document.getElementById('rest-time');
    const restQuoteEl = document.getElementById('rest-quote');
    
    restTimerEl.classList.remove('hidden');
    restTime = 60;
    
    // Random motivational quote
    const quotes = [
        { text: "Sabr ka phal meetha hota hai", translation: "The fruit of patience is sweet" },
        { text: "Mushkil waqt mein Allah yaad karo", translation: "Remember Allah in difficult times" },
        { text: "Mehnat rang layegi", translation: "Hard work will pay off" }
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    restQuoteEl.textContent = randomQuote.text;
    restQuoteEl.nextElementSibling.textContent = randomQuote.translation;
    
    // Start rest countdown
    restTimer = setInterval(() => {
        restTime--;
        restTimeEl.textContent = restTime;
        
        if (restTime <= 0) {
            clearInterval(restTimer);
            restTimerEl.classList.add('hidden');
            
            // Play notification sound (if available)
            playNotificationSound();
        }
    }, 1000);
    
    // Animate rest timer
    restTimerEl.style.animation = 'slideUp 0.5s ease';
}

function updateWorkoutProgress() {
    const progressBar = document.querySelector('.workout-progress-bar .progress-fill');
    if (progressBar) {
        // Simulate progress increment
        const currentWidth = parseInt(progressBar.style.width) || 0;
        const newWidth = Math.min(currentWidth + 15, 100);
        progressBar.style.width = newWidth + '%';
    }
}

// Breathing Exercise
function openBreathingTimer() {
    breathingModal.classList.add('active');
    resetBreathingTimer();
}

function closeBreathingTimer() {
    breathingModal.classList.remove('active');
    stopBreathingExercise();
}

function resetBreathingTimer() {
    breathingPhase = 'inhale';
    breathingCount = 4;
    breathingCycle = 0;
    
    updateBreathingDisplay();
    updateDhikrText();
    updateBreathingProgress();
}

function startBreathingExercise() {
    const startBtn = document.getElementById('start-breathing');
    const stopBtn = document.getElementById('stop-breathing');
    const breathingCircle = document.getElementById('breathing-circle');
    
    startBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');
    
    breathingInterval = setInterval(() => {
        breathingCount--;
        
        if (breathingCount <= 0) {
            // Switch phase
            if (breathingPhase === 'inhale') {
                breathingPhase = 'hold';
                breathingCount = 4;
            } else if (breathingPhase === 'hold') {
                breathingPhase = 'exhale';
                breathingCount = 4;
            } else {
                breathingPhase = 'inhale';
                breathingCount = 4;
                breathingCycle++;
                updateDhikrText();
                updateBreathingProgress();
                
                if (breathingCycle >= 5) {
                    stopBreathingExercise();
                    showCompletionMessage();
                    return;
                }
            }
        }
        
        updateBreathingDisplay();
        updateBreathingAnimation();
    }, 1000);
}

function stopBreathingExercise() {
    if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingInterval = null;
    }
    
    const startBtn = document.getElementById('start-breathing');
    const stopBtn = document.getElementById('stop-breathing');
    const breathingCircle = document.getElementById('breathing-circle');
    
    startBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
    
    breathingCircle.className = 'breathing-circle';
}

function updateBreathingDisplay() {
    const phaseEl = document.getElementById('breath-phase');
    const countEl = document.getElementById('breath-count');
    
    const phaseText = {
        inhale: 'Breathe In',
        hold: 'Hold',
        exhale: 'Breathe Out'
    };
    
    phaseEl.textContent = phaseText[breathingPhase];
    countEl.textContent = breathingCount;
}

function updateBreathingAnimation() {
    const breathingCircle = document.getElementById('breathing-circle');
    
    breathingCircle.className = 'breathing-circle';
    
    if (breathingPhase === 'inhale') {
        breathingCircle.classList.add('inhale');
    } else if (breathingPhase === 'exhale') {
        breathingCircle.classList.add('exhale');
    }
}

function updateDhikrText() {
    const dhikrTextEl = document.getElementById('dhikr-text');
    const dhikr = dhikrList[breathingCycle % dhikrList.length];
    
    dhikrTextEl.innerHTML = `
        <p>${dhikr.text}</p>
        <small>${dhikr.translation}</small>
    `;
    
    // Animate dhikr change
    dhikrTextEl.style.animation = 'fadeIn 0.5s ease';
}

function updateBreathingProgress() {
    const progressFill = document.getElementById('breathing-progress');
    const cycleCount = document.getElementById('cycle-count');
    
    const progressPercentage = (breathingCycle / 5) * 100;
    progressFill.style.width = progressPercentage + '%';
    cycleCount.textContent = breathingCycle;
}

function showCompletionMessage() {
    const dhikrTextEl = document.getElementById('dhikr-text');
    dhikrTextEl.innerHTML = `
        <p>Masha Allah! Exercise completed</p>
        <small>May Allah grant you peace and strength</small>
    `;
    
    // Save completion to localStorage
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`breathing_${today}`, 'completed');
    
    // Play completion sound
    playNotificationSound();
    
    // Auto-close after 3 seconds
    setTimeout(() => {
        closeBreathingTimer();
    }, 3000);
}

// Meal Functions
async function loadMealData() {
    try {
        // Load today's meal plan from offline storage
        const todaysMealPlan = await offlineStorage.getTodaysMealPlan();
        
        if (todaysMealPlan) {
            updateMealDisplay(todaysMealPlan);
        } else {
            // Generate new meal plan for today
            await generateTodaysMealPlan();
        }
    } catch (error) {
        console.error('Error loading meal data:', error);
        // Fallback to static data
        updateMealDisplay();
    }
}

async function generateTodaysMealPlan() {
    const today = new Date().toISOString().split('T')[0];
    const dailyBudget = 1000; // PKR
    
    const mealPlan = {
        date: today,
        dailyBudget: dailyBudget,
        meals: {
            breakfast: mealData.breakfast[0],
            lunch: mealData.lunch[0],
            dinner: mealData.dinner[0],
            snack: mealData.snack[0]
        },
        totalCalories: 0,
        totalCost: 0
    };
    
    // Calculate totals
    Object.values(mealPlan.meals).forEach(meal => {
        mealPlan.totalCalories += meal.calories;
        mealPlan.totalCost += meal.cost;
    });
    
    try {
        await offlineStorage.saveMealPlan(mealPlan);
        updateMealDisplay(mealPlan);
        showNotification('Today\'s meal plan generated!', 'success');
    } catch (error) {
        console.error('Error saving meal plan:', error);
        updateMealDisplay();
    }
}

function updateMealDisplay(mealPlan = null) {
    const mealSections = document.querySelectorAll('.meal-section');
    
    mealSections.forEach(section => {
        const mealType = section.querySelector('h3').textContent.toLowerCase();
        const mealCard = section.querySelector('.meal-card');
        const mealInfo = mealCard.querySelector('.meal-info');
        
        let meal;
        if (mealPlan && mealPlan.meals[mealType]) {
            meal = mealPlan.meals[mealType];
        } else if (mealData[mealType] && mealData[mealType].length > 0) {
            meal = mealData[mealType][0];
        }
        
        if (meal) {
            mealInfo.innerHTML = `
                <h4>${meal.name}</h4>
                <p>${meal.calories} calories • PKR ${meal.cost}</p>
            `;
        }
    });
    
    // Update budget display
    if (mealPlan) {
        const budgetUsed = document.querySelector('.budget-used');
        if (budgetUsed) {
            budgetUsed.textContent = `Used: PKR ${mealPlan.totalCost}`;
        }
    }
}

// Progress Functions
async function updateProgressCharts() {
    try {
        // Get data from offline storage
        const bodyStats = await offlineStorage.getBodyStats();
        const workoutSessions = await offlineStorage.getWorkoutSessions();
        const moodLogs = await offlineStorage.getMoodLogs();
        
        // Update weight chart with real data
        const weightChart = document.getElementById('weight-chart');
        if (weightChart && bodyStats.length > 0) {
            const ctx = weightChart.getContext('2d');
            ctx.clearRect(0, 0, weightChart.width, weightChart.height);
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            
            // Use actual weight data
            const weights = bodyStats.slice(0, 7).reverse(); // Last 7 entries
            const maxWeight = Math.max(...weights.map(s => s.weight));
            const minWeight = Math.min(...weights.map(s => s.weight));
            const range = maxWeight - minWeight || 1;
            
            ctx.beginPath();
            weights.forEach((stat, i) => {
                const x = (i * (weightChart.width / (weights.length - 1))) || 0;
                const y = weightChart.height - ((stat.weight - minWeight) / range) * (weightChart.height - 20) - 10;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
            
            // Add dots for data points
            ctx.fillStyle = '#00ff88';
            weights.forEach((stat, i) => {
                const x = (i * (weightChart.width / (weights.length - 1))) || 0;
                const y = weightChart.height - ((stat.weight - minWeight) / range) * (weightChart.height - 20) - 10;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
        
        // Update progress stats
        updateProgressStats(bodyStats, workoutSessions, moodLogs);
        
    } catch (error) {
        console.error('Error updating progress charts:', error);
        // Fallback to basic chart
        const weightChart = document.getElementById('weight-chart');
        if (weightChart) {
            const ctx = weightChart.getContext('2d');
            ctx.clearRect(0, 0, weightChart.width, weightChart.height);
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(0, 100);
            ctx.lineTo(50, 90);
            ctx.lineTo(100, 85);
            ctx.lineTo(150, 80);
            ctx.lineTo(200, 75);
            ctx.lineTo(250, 70);
            ctx.lineTo(300, 65);
            ctx.stroke();
            
            // Add dots
            ctx.fillStyle = '#00ff88';
            [0, 50, 100, 150, 200, 250, 300].forEach((x, i) => {
                const y = 100 - (i * 5);
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
    }
}

function updateProgressStats(bodyStats, workoutSessions, moodLogs) {
    // Update weight progress
    const weightProgress = document.querySelector('.weight-progress');
    if (weightProgress && bodyStats.length > 0) {
        const latest = bodyStats[0];
        const previous = bodyStats[1];
        if (previous) {
            const change = latest.weight - previous.weight;
            const symbol = change > 0 ? '↑' : change < 0 ? '↓' : '→';
            weightProgress.textContent = `${previous.weight}kg ${symbol} ${latest.weight}kg`;
        } else {
            weightProgress.textContent = `${latest.weight}kg`;
        }
    }
    
    // Update workout streak
    const workoutStreak = document.querySelector('.workout-streak');
    if (workoutStreak) {
        const streak = calculateWorkoutStreak(workoutSessions);
        workoutStreak.textContent = `${streak} days`;
    }
    
    // Update mood trend
    const moodTrend = document.querySelector('.mood-trend');
    if (moodTrend && moodLogs.length > 0) {
        const averageMood = moodLogs.reduce((sum, log) => sum + log.moodScore, 0) / moodLogs.length;
        const moodText = averageMood > 4 ? 'Excellent' : averageMood > 3 ? 'Good' : averageMood > 2 ? 'Fair' : 'Needs Attention';
        moodTrend.textContent = moodText;
    }
    
    // Update progress bars
    updateProgressBars(bodyStats, workoutSessions, moodLogs);
}

function calculateWorkoutStreak(workoutSessions) {
    if (workoutSessions.length === 0) return 0;
    
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateString = checkDate.toISOString().split('T')[0];
        
        const hasWorkout = workoutSessions.some(session => session.date === dateString);
        
        if (hasWorkout) {
            streak++;
        } else if (i === 0) {
            // If no workout today, check yesterday
            continue;
        } else {
            break;
        }
    }
    
    return streak;
}

function updateProgressBars(bodyStats, workoutSessions, moodLogs) {
    // Update workout frequency
    const workoutFrequencyBar = document.querySelector('.workout-frequency-bar');
    if (workoutFrequencyBar) {
        const thisWeekSessions = workoutSessions.filter(session => {
            const sessionDate = new Date(session.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return sessionDate >= weekAgo;
        });
        
        const progress = Math.min((thisWeekSessions.length / 4) * 100, 100); // Target: 4 sessions per week
        workoutFrequencyBar.style.width = progress + '%';
    }
    
    // Update mood consistency
    const moodConsistencyBar = document.querySelector('.mood-consistency-bar');
    if (moodConsistencyBar && moodLogs.length > 0) {
        const recentMoods = moodLogs.slice(0, 7); // Last 7 days
        const averageMood = recentMoods.reduce((sum, log) => sum + log.moodScore, 0) / recentMoods.length;
        const progress = (averageMood / 5) * 100;
        moodConsistencyBar.style.width = progress + '%';
    }
}

// Settings Functions
async function initializeSettings() {
    // Load user preferences from offline storage
    await loadUserPreferences();
    
    // Setup toggle switches
    setupToggleSwitches();
    
    // Setup budget calculation
    setupBudgetCalculation();
    
    // Setup data management
    setupDataManagement();
}

async function loadUserPreferences() {
    try {
        const preferences = await offlineStorage.getUserPreferences();
        
        if (preferences) {
            // Set form values
            Object.keys(preferences).forEach(key => {
                const element = document.querySelector(`[name="${key}"]`);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = preferences[key];
                    } else {
                        element.value = preferences[key];
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading user preferences:', error);
        // Fallback to localStorage
        const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
        Object.keys(preferences).forEach(key => {
            const element = document.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = preferences[key];
                } else {
                    element.value = preferences[key];
                }
            }
        });
    }
}

function setupToggleSwitches() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', async function() {
            const setting = this.id.replace('-', '_');
            
            try {
                let preferences = await offlineStorage.getUserPreferences() || {};
                preferences[setting] = this.checked;
                await offlineStorage.saveUserPreferences(preferences);
                
                showNotification('Settings saved successfully!', 'success');
            } catch (error) {
                console.error('Error saving preferences:', error);
                // Fallback to localStorage
                const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
                preferences[setting] = this.checked;
                localStorage.setItem('userPreferences', JSON.stringify(preferences));
            }
            
            // Animate toggle
            this.parentElement.style.animation = 'pulse 0.3s ease';
        });
    });
}

function setupBudgetCalculation() {
    const monthlyBudget = document.querySelector('input[value="30000"]');
    const dailyBudget = document.querySelector('input[value="1000"]');
    
    if (monthlyBudget && dailyBudget) {
        monthlyBudget.addEventListener('input', function() {
            const daily = Math.round(this.value / 30);
            dailyBudget.value = daily;
        });
    }
}

function setupDataManagement() {
    // Add data management section to settings
    const settingsContainer = document.querySelector('.settings-sections');
    
    // Only add if not already present
    if (settingsContainer && !document.querySelector('.data-management-section')) {
        const dataManagementSection = document.createElement('div');
        dataManagementSection.className = 'settings-section data-management-section';
        dataManagementSection.innerHTML = `
            <h3>Data Management</h3>
            <div class="data-management-actions">
                <button class="data-action-btn" onclick="exportData()">
                    <i class="fas fa-download"></i>
                    Export Data
                </button>
                <button class="data-action-btn" onclick="importData()">
                    <i class="fas fa-upload"></i>
                    Import Data
                </button>
                <button class="data-action-btn" onclick="clearAllData()">
                    <i class="fas fa-trash"></i>
                    Clear All Data
                </button>
                <button class="data-action-btn" onclick="showStorageUsage()">
                    <i class="fas fa-info-circle"></i>
                    Storage Usage
                </button>
            </div>
            <div class="storage-info" id="storage-info"></div>
            <input type="file" id="import-file" accept=".json" style="display: none;">
        `;
        
        settingsContainer.appendChild(dataManagementSection);
    }
}

// Data Management Functions
async function exportData() {
    try {
        const exportData = await offlineStorage.exportAllData();
        const blob = new Blob([exportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `gymistic-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        showNotification('Data exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting data:', error);
        showNotification('Error exporting data!', 'error');
    }
}

function importData() {
    const fileInput = document.getElementById('import-file');
    fileInput.click();
    
    fileInput.onchange = async function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            await offlineStorage.importAllData(text);
            showNotification('Data imported successfully!', 'success');
            
            // Refresh the app with new data
            setTimeout(() => {
                location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error importing data:', error);
            showNotification('Error importing data!', 'error');
        }
    };
}

async function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        try {
            await offlineStorage.clearAllData();
            localStorage.clear();
            showNotification('All data cleared successfully!', 'success');
            
            // Reload the app
            setTimeout(() => {
                location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error clearing data:', error);
            showNotification('Error clearing data!', 'error');
        }
    }
}

async function showStorageUsage() {
    try {
        const usage = await offlineStorage.getStorageUsage();
        const storageInfo = document.getElementById('storage-info');
        
        if (usage) {
            storageInfo.innerHTML = `
                <div class="storage-usage">
                    <h4>Storage Usage</h4>
                    <p><strong>Used:</strong> ${usage.usedMB} MB of ${usage.quotaMB} MB</p>
                    <p><strong>Available:</strong> ${usage.quotaMB - usage.usedMB} MB</p>
                    <div class="usage-bar">
                        <div class="usage-fill" style="width: ${usage.usagePercentage}%"></div>
                    </div>
                    <p><small>Usage: ${usage.usagePercentage}%</small></p>
                </div>
            `;
        } else {
            storageInfo.innerHTML = '<p>Storage usage information not available.</p>';
        }
    } catch (error) {
        console.error('Error getting storage usage:', error);
        showNotification('Error getting storage usage!', 'error');
    }
}

// Load today's data
async function loadTodaysData() {
    try {
        // Load today's mood
        const todaysMood = await offlineStorage.getTodaysMood();
        if (todaysMood) {
            const moodButtons = document.querySelectorAll('.mood-btn');
            moodButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.mood === todaysMood.mood) {
                    btn.classList.add('active');
                }
            });
        }
        
        // Load today's calories
        const todaysCalories = await offlineStorage.getTodaysCalories();
        if (todaysCalories) {
            // Update calorie display
            const caloriesElement = document.getElementById('calories-consumed');
            if (caloriesElement) {
                caloriesElement.textContent = todaysCalories.consumed || 0;
            }
        }
        
        // Load today's workout
        const todaysWorkout = await offlineStorage.getTodaysWorkout();
        if (todaysWorkout) {
            // Update workout progress
            const progressPercentage = (todaysWorkout.sets.length / 16) * 100; // Assuming 16 sets total
            const progressElement = document.querySelector('.workout-progress-bar .progress-fill');
            if (progressElement) {
                progressElement.style.width = Math.min(progressPercentage, 100) + '%';
            }
        }
    } catch (error) {
        console.error('Error loading today\'s data:', error);
    }
}

// Utility Functions
function playNotificationSound() {
    // Simple beep sound using Web Audio API
    if (typeof(Audio) !== "undefined") {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key, defaultValue = null) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--neon-green)' : 'var(--accent-orange)'};
        color: var(--primary-bg);
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize settings when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeSettings();
    }, 4100);
});

// Add CSS animation for slideIn
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Service Worker Registration (for offline capability)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Export functions for global access
window.startWorkout = startWorkout;
window.completeSet = completeSet;
window.openBreathingTimer = openBreathingTimer;
window.closeBreathingTimer = closeBreathingTimer;
window.startBreathingExercise = startBreathingExercise;
window.stopBreathingExercise = stopBreathingExercise;