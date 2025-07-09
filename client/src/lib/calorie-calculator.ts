export class CalorieCalculator {
  // Calculate BMR using Mifflin-St Jeor Equation
  static calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female'): number {
    const baseMetabolism = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'male' ? baseMetabolism + 5 : baseMetabolism - 161;
  }

  // Calculate TDEE based on activity level
  static calculateTDEE(bmr: number, activityLevel: string): number {
    const multipliers: { [key: string]: number } = {
      sedentary: 1.2,          // Little or no exercise
      lightly_active: 1.375,   // Light exercise 1-3 days/week
      moderately_active: 1.55, // Moderate exercise 3-5 days/week
      very_active: 1.725,      // Hard exercise 6-7 days/week
      extra_active: 1.9        // Very hard exercise, physical job
    };
    return bmr * (multipliers[activityLevel] || 1.2);
  }

  // Calculate target calories based on goal
  static calculateTargetCalories(tdee: number, goal: string): number {
    const adjustments: { [key: string]: number } = {
      lose_weight: -500,    // 500 calorie deficit for ~1 lb/week loss
      maintain: 0,          // Maintain current weight
      gain_weight: 300,     // 300 calorie surplus for gradual gain
      build_muscle: 200     // Slight surplus for muscle building
    };
    return tdee + (adjustments[goal] || 0);
  }

  // Calculate BMI
  static calculateBMI(weight: number, height: number): number {
    return weight / Math.pow(height / 100, 2);
  }

  // Get BMI category
  static getBMICategory(bmi: number): { category: string; color: string; recommendation: string } {
    if (bmi < 18.5) {
      return {
        category: 'Underweight',
        color: 'text-blue-400',
        recommendation: 'Consider increasing calorie intake and strength training'
      };
    }
    if (bmi < 25) {
      return {
        category: 'Normal Weight',
        color: 'text-neon-green',
        recommendation: 'Maintain current weight with balanced diet and exercise'
      };
    }
    if (bmi < 30) {
      return {
        category: 'Overweight',
        color: 'text-yellow-400',
        recommendation: 'Consider moderate calorie deficit and increased activity'
      };
    }
    return {
      category: 'Obese',
      color: 'text-red-400',
      recommendation: 'Consult healthcare provider for weight management plan'
    };
  }

  // Calculate ideal weight range (using BMI 18.5-25)
  static calculateIdealWeightRange(height: number): { min: number; max: number } {
    const heightInM = height / 100;
    return {
      min: Math.round(18.5 * heightInM * heightInM),
      max: Math.round(25 * heightInM * heightInM)
    };
  }

  // Calculate macronutrient distribution
  static calculateMacros(calories: number, goal: string): { protein: number; carbs: number; fat: number } {
    let proteinRatio: number, fatRatio: number, carbRatio: number;

    switch (goal) {
      case 'lose_weight':
        proteinRatio = 0.30; // Higher protein for satiety and muscle preservation
        fatRatio = 0.25;
        carbRatio = 0.45;
        break;
      case 'build_muscle':
        proteinRatio = 0.25; // High protein for muscle synthesis
        fatRatio = 0.25;
        carbRatio = 0.50; // More carbs for energy
        break;
      case 'gain_weight':
        proteinRatio = 0.20;
        fatRatio = 0.30; // Higher fat for calorie density
        carbRatio = 0.50;
        break;
      default: // maintain
        proteinRatio = 0.20;
        fatRatio = 0.25;
        carbRatio = 0.55;
    }

    return {
      protein: Math.round((calories * proteinRatio) / 4), // 4 calories per gram
      carbs: Math.round((calories * carbRatio) / 4),      // 4 calories per gram
      fat: Math.round((calories * fatRatio) / 9)          // 9 calories per gram
    };
  }

  // Calculate calories burned during exercise (simplified)
  static calculateExerciseCalories(
    activityType: string,
    durationMinutes: number,
    weight: number
  ): number {
    // MET (Metabolic Equivalent) values for different activities
    const metValues: { [key: string]: number } = {
      walking: 3.5,
      running: 8.0,
      cycling: 6.0,
      weightlifting: 6.0,
      yoga: 2.5,
      swimming: 8.0,
      basketball: 8.0,
      football: 8.0
    };

    const met = metValues[activityType] || 4.0; // Default MET value
    const caloriesPerMinute = (met * weight * 3.5) / 200;
    return Math.round(caloriesPerMinute * durationMinutes);
  }

  // Calculate water intake recommendation
  static calculateWaterIntake(weight: number, activityLevel: string): number {
    const baseIntake = weight * 35; // 35ml per kg body weight
    const activityMultiplier = activityLevel === 'very_active' || activityLevel === 'extra_active' ? 1.2 : 1.0;
    return Math.round(baseIntake * activityMultiplier);
  }

  // Get Islamic dietary recommendations
  static getIslamicDietaryGuidance(): string[] {
    return [
      "Eat in moderation - 'The son of Adam fills no worse vessel than his stomach' - Prophet Muhammad (SAW)",
      "Start meals with Bismillah and end with Alhamdulillah",
      "Consume halal and tayyib (pure) foods only",
      "Avoid overeating - divide stomach into 1/3 food, 1/3 water, 1/3 air",
      "Fast regularly as recommended in Sunnah for spiritual and physical benefits",
      "Be grateful for Allah's provision and avoid waste"
    ];
  }

  // Calculate Ramadan fasting adjustments
  static calculateRamadanCalories(tdee: number): { sahur: number; iftar: number; total: number } {
    // Adjust for fasting period - slightly reduce total calories
    const fasting_tdee = tdee * 0.9;
    
    return {
      sahur: Math.round(fasting_tdee * 0.4), // 40% at pre-dawn meal
      iftar: Math.round(fasting_tdee * 0.6), // 60% at breaking fast
      total: Math.round(fasting_tdee)
    };
  }
}
