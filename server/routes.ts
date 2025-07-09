import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from root directory
  app.use(express.static(path.join(process.cwd())));
  
  // Serve index.html for root route
  app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
  });
  
  // API routes for Islamic quotes
  app.get('/api/quotes', (req, res) => {
    const quotes = [
      {
        id: 1,
        text: "La hawla wa la quwwata illa billah",
        translation: "There is no power except with Allah",
        category: "strength"
      },
      {
        id: 2,
        text: "Sabr ka phal meetha hota hai",
        translation: "The fruit of patience is sweet",
        category: "sabr"
      },
      {
        id: 3,
        text: "Allah sirf unhi ki madad karta hai jo apni madad karte hain",
        translation: "Allah only helps those who help themselves",
        category: "effort"
      },
      {
        id: 4,
        text: "Jism amanat hai, iska khayal rakho",
        translation: "The body is a trust, take care of it",
        category: "health"
      }
    ];
    res.json(quotes);
  });
  
  // API routes for meal data
  app.get('/api/meals', (req, res) => {
    const meals = {
      breakfast: [
        { id: 1, name: "Aloo Paratha with Dahi", calories: 480, cost: 80, ingredients: ["Potato", "Flour", "Yogurt"] },
        { id: 2, name: "Omelette with Roti", calories: 350, cost: 60, ingredients: ["Eggs", "Wheat Flour", "Oil"] },
        { id: 3, name: "Halwa Puri", calories: 650, cost: 120, ingredients: ["Semolina", "Flour", "Sugar", "Ghee"] }
      ],
      lunch: [
        { id: 4, name: "Chicken Karahi with Rice", calories: 650, cost: 200, ingredients: ["Chicken", "Rice", "Tomatoes", "Spices"] },
        { id: 5, name: "Beef Biryani", calories: 780, cost: 250, ingredients: ["Beef", "Rice", "Spices", "Yogurt"] },
        { id: 6, name: "Daal Chawal with Sabzi", calories: 450, cost: 100, ingredients: ["Lentils", "Rice", "Vegetables"] }
      ],
      dinner: [
        { id: 7, name: "Daal Chawal with Salad", calories: 420, cost: 120, ingredients: ["Lentils", "Rice", "Salad"] },
        { id: 8, name: "Chicken Tikka with Naan", calories: 580, cost: 180, ingredients: ["Chicken", "Flour", "Spices"] },
        { id: 9, name: "Vegetable Curry with Rice", calories: 380, cost: 90, ingredients: ["Mixed Vegetables", "Rice", "Spices"] }
      ],
      snack: [
        { id: 10, name: "Mixed Nuts (30g)", calories: 180, cost: 50, ingredients: ["Almonds", "Cashews", "Pistachios"] },
        { id: 11, name: "Banana with Peanut Butter", calories: 220, cost: 40, ingredients: ["Banana", "Peanut Butter"] },
        { id: 12, name: "Yogurt with Honey", calories: 150, cost: 35, ingredients: ["Yogurt", "Honey"] }
      ]
    };
    res.json(meals);
  });
  
  // API routes for workout data
  app.get('/api/workouts', (req, res) => {
    const workouts = [
      {
        id: 1,
        name: "Push Day",
        type: "push",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8-10", muscle: "chest" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", muscle: "chest" },
          { name: "Tricep Dips", sets: 3, reps: "12-15", muscle: "triceps" },
          { name: "Overhead Press", sets: 4, reps: "8-10", muscle: "shoulders" }
        ]
      },
      {
        id: 2,
        name: "Pull Day",
        type: "pull",
        exercises: [
          { name: "Pull-ups", sets: 4, reps: "6-8", muscle: "back" },
          { name: "Barbell Rows", sets: 4, reps: "8-10", muscle: "back" },
          { name: "Bicep Curls", sets: 3, reps: "12-15", muscle: "biceps" },
          { name: "Face Pulls", sets: 3, reps: "15-20", muscle: "rear_delts" }
        ]
      },
      {
        id: 3,
        name: "Leg Day",
        type: "legs",
        exercises: [
          { name: "Squats", sets: 4, reps: "8-10", muscle: "quads" },
          { name: "Deadlifts", sets: 4, reps: "6-8", muscle: "hamstrings" },
          { name: "Lunges", sets: 3, reps: "12-15", muscle: "glutes" },
          { name: "Calf Raises", sets: 4, reps: "15-20", muscle: "calves" }
        ]
      }
    ];
    res.json(workouts);
  });

  const httpServer = createServer(app);

  return httpServer;
}
