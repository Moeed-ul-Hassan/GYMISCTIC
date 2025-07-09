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
    // Show preloader animation
    setTimeout(() => {
        preloader.style.display = 'none';
        app.classList.remove('hidden');
        initializeApp();
    }, 4000);
});

function initializeApp() {
    // Set up navigation
    setupNavigation();
    
    // Load daily quote
    loadDailyQuote();
    
    // Initialize mood tracking
    initializeMoodTracking();
    
    // Set up workout timer
    setupWorkoutTimer();
    
    // Load meal data
    loadMealData();
    
    // Update progress charts
    updateProgressCharts();
    
    // Show home page
    showPage('home');
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
function loadDailyQuote() {
    const today = new Date().getDay();
    const quote = islamicQuotes[today % islamicQuotes.length];
    
    document.getElementById('daily-quote').textContent = quote.text;
    document.getElementById('quote-translation').textContent = quote.translation;
    
    // Animate quote appearance
    const quoteCard = document.querySelector('.quote-card');
    quoteCard.style.animation = 'slideUp 0.5s ease';
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

function saveMood(mood) {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`mood_${today}`, mood);
    
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

function saveSetData(reps, weight) {
    const today = new Date().toISOString().split('T')[0];
    const setData = {
        date: today,
        reps: parseInt(reps),
        weight: parseFloat(weight),
        exercise: document.getElementById('current-exercise-name').textContent
    };
    
    let workoutData = JSON.parse(localStorage.getItem('workoutData') || '[]');
    workoutData.push(setData);
    localStorage.setItem('workoutData', JSON.stringify(workoutData));
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
function loadMealData() {
    // This would typically load from localStorage or API
    // For now, we'll use the static data
    updateMealDisplay();
}

function updateMealDisplay() {
    // Update meal cards with current data
    const mealSections = document.querySelectorAll('.meal-section');
    
    mealSections.forEach(section => {
        const mealType = section.querySelector('h3').textContent.toLowerCase();
        const mealCard = section.querySelector('.meal-card');
        
        if (mealData[mealType] && mealData[mealType].length > 0) {
            const meal = mealData[mealType][0]; // Get first meal as example
            const mealInfo = mealCard.querySelector('.meal-info');
            
            mealInfo.innerHTML = `
                <h4>${meal.name}</h4>
                <p>${meal.calories} calories • PKR ${meal.cost}</p>
            `;
        }
    });
}

// Progress Functions
function updateProgressCharts() {
    // Update weight chart (simplified)
    const weightChart = document.getElementById('weight-chart');
    if (weightChart) {
        const ctx = weightChart.getContext('2d');
        
        // Simple line chart simulation
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

// Settings Functions
function initializeSettings() {
    // Load user preferences
    loadUserPreferences();
    
    // Setup toggle switches
    setupToggleSwitches();
    
    // Setup budget calculation
    setupBudgetCalculation();
}

function loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    
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

function setupToggleSwitches() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const setting = this.id.replace('-', '_');
            const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
            preferences[setting] = this.checked;
            localStorage.setItem('userPreferences', JSON.stringify(preferences));
            
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