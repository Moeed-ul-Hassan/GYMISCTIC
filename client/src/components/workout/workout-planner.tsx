import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import workoutPlansData from '@/data/workout-plans.json';

interface WorkoutPlannerProps {
  onPlanSelect: (planId: string) => void;
  onStartWorkout: (workoutType: string) => void;
}

export function WorkoutPlanner({ onPlanSelect, onStartWorkout }: WorkoutPlannerProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [availableDays, setAvailableDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const plans = workoutPlansData.plans;
  const currentPlan = plans.find(p => p.id === selectedPlan);

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    onPlanSelect(planId);
  };

  const getRecommendedPlan = () => {
    const daysCount = availableDays.length;
    if (daysCount >= 6) return 'push_pull_legs';
    if (daysCount >= 4) return 'bro_split';
    return 'full_body';
  };

  const getTodayWorkout = () => {
    if (!currentPlan) return null;
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const adjustedDay = today === 0 ? 7 : today; // Convert Sunday to 7
    return currentPlan.schedule.find(s => s.day === adjustedDay);
  };

  const todayWorkout = getTodayWorkout();

  return (
    <div className="space-y-6">
      {/* Plan Selection */}
      <Card className="p-6 bg-card-bg border-neon-blue/30">
        <h3 className="text-lg font-semibold text-neon-blue mb-4">Select Workout Plan</h3>
        
        <div className="space-y-4">
          <Select value={selectedPlan} onValueChange={handlePlanSelect}>
            <SelectTrigger className="bg-dark-bg/50 border-gray-600 text-white">
              <SelectValue placeholder="Choose your workout plan" />
            </SelectTrigger>
            <SelectContent>
              {plans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name} ({plan.daysPerWeek} days/week)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!selectedPlan && (
            <div className="p-4 bg-neon-green/10 rounded-lg border border-neon-green/30">
              <p className="text-neon-green text-sm">
                Recommended: <strong>{plans.find(p => p.id === getRecommendedPlan())?.name}</strong> based on your available days
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Today's Workout */}
      {todayWorkout && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 bg-card-bg border-neon-green/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neon-green">Today's Workout</h3>
              <Badge className="bg-neon-green/20 text-neon-green">
                {todayWorkout.name}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white font-medium">Exercises:</h4>
              <div className="grid gap-2">
                {todayWorkout.exercises.map((exerciseId, index) => {
                  const exercise = workoutPlansData.exercises.find(e => e.id === exerciseId);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-dark-bg/30 rounded-lg"
                    >
                      <div>
                        <div className="text-white font-medium">{exercise?.name || exerciseId}</div>
                        <div className="text-xs text-gray-400">
                          {exercise?.muscleGroups.join(', ')}
                        </div>
                      </div>
                      <Badge variant="outline" className="border-neon-blue text-neon-blue">
                        {exercise?.category}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={() => onStartWorkout(todayWorkout.workoutType)}
              className="w-full mt-4 bg-neon-green text-dark-bg font-semibold hover:bg-neon-green/90"
            >
              <i className="fas fa-play mr-2"></i>
              Start Today's Workout
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Weekly Schedule */}
      {currentPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 bg-card-bg border-neon-purple/30">
            <h3 className="text-lg font-semibold text-neon-purple mb-4">Weekly Schedule</h3>
            <p className="text-gray-400 text-sm mb-4">{currentPlan.description}</p>
            
            <div className="space-y-2">
              {currentPlan.schedule.map((workout, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-dark-bg/30 rounded-lg"
                >
                  <div>
                    <div className="text-white font-medium">
                      {dayNames[workout.day - 1]}
                    </div>
                    <div className="text-sm text-gray-400">{workout.name}</div>
                  </div>
                  <div className="text-xs text-neon-purple">
                    {workout.exercises.length} exercises
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Quick Start Options */}
      <Card className="p-6 bg-card-bg border-accent-orange/30">
        <h3 className="text-lg font-semibold text-accent-orange mb-4">Quick Start</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => onStartWorkout('push')}
            className="border-accent-orange text-accent-orange hover:bg-accent-orange/10"
          >
            Push Day
          </Button>
          <Button
            variant="outline"
            onClick={() => onStartWorkout('pull')}
            className="border-accent-orange text-accent-orange hover:bg-accent-orange/10"
          >
            Pull Day
          </Button>
          <Button
            variant="outline"
            onClick={() => onStartWorkout('legs')}
            className="border-accent-orange text-accent-orange hover:bg-accent-orange/10"
          >
            Leg Day
          </Button>
          <Button
            variant="outline"
            onClick={() => onStartWorkout('full_body')}
            className="border-accent-orange text-accent-orange hover:bg-accent-orange/10"
          >
            Full Body
          </Button>
        </div>
      </Card>
    </div>
  );
}
