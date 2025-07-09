import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useBodyStats } from '@/hooks/use-storage';
import { BodyStats } from '@shared/schema';

export function BodyStatsComponent() {
  const { stats, latestStats, saveStats, isLoading } = useBodyStats();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    chest: '',
    waist: '',
    arms: '',
    thighs: '',
    bodyFat: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const today = new Date().toISOString().split('T')[0];
    const newStats: BodyStats = {
      id: `stats-${Date.now()}`,
      date: today,
      weight: Number(formData.weight),
      height: formData.height ? Number(formData.height) : undefined,
      chest: formData.chest ? Number(formData.chest) : undefined,
      waist: formData.waist ? Number(formData.waist) : undefined,
      arms: formData.arms ? Number(formData.arms) : undefined,
      thighs: formData.thighs ? Number(formData.thighs) : undefined,
      bodyFat: formData.bodyFat ? Number(formData.bodyFat) : undefined,
      notes: formData.notes || undefined
    };

    await saveStats(newStats);
    setIsDialogOpen(false);
    setFormData({
      weight: '',
      height: '',
      chest: '',
      waist: '',
      arms: '',
      thighs: '',
      bodyFat: '',
      notes: ''
    });
  };

  const calculateBMI = (weight: number, height: number) => {
    return (weight / Math.pow(height / 100, 2)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { category: 'Normal', color: 'text-neon-green' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-400' };
    return { category: 'Obese', color: 'text-red-400' };
  };

  const getRecentProgress = () => {
    if (stats.length < 2) return null;
    const sortedStats = [...stats].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = sortedStats[0];
    const previous = sortedStats[1];
    
    return {
      weightChange: latest.weight - previous.weight,
      timeframe: 'since last measurement'
    };
  };

  const progress = getRecentProgress();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-neon-purple">Loading stats...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Stats Overview */}
      <Card className="p-6 bg-card-bg border-neon-purple/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neon-purple">Body Statistics</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-neon-purple text-white hover:bg-neon-purple/90">
                <i className="fas fa-plus mr-2"></i>
                Add Measurement
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card-bg border-neon-purple/30">
              <DialogHeader>
                <DialogTitle className="text-neon-purple">Add New Measurements</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Weight (kg) *</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      className="bg-dark-bg/50 border-gray-600 text-white"
                      placeholder="70.5"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Height (cm)</label>
                    <Input
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      className="bg-dark-bg/50 border-gray-600 text-white"
                      placeholder="175"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Chest (cm)</label>
                    <Input
                      type="number"
                      value={formData.chest}
                      onChange={(e) => handleInputChange('chest', e.target.value)}
                      className="bg-dark-bg/50 border-gray-600 text-white"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Waist (cm)</label>
                    <Input
                      type="number"
                      value={formData.waist}
                      onChange={(e) => handleInputChange('waist', e.target.value)}
                      className="bg-dark-bg/50 border-gray-600 text-white"
                      placeholder="85"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Arms (cm)</label>
                    <Input
                      type="number"
                      value={formData.arms}
                      onChange={(e) => handleInputChange('arms', e.target.value)}
                      className="bg-dark-bg/50 border-gray-600 text-white"
                      placeholder="35"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Thighs (cm)</label>
                    <Input
                      type="number"
                      value={formData.thighs}
                      onChange={(e) => handleInputChange('thighs', e.target.value)}
                      className="bg-dark-bg/50 border-gray-600 text-white"
                      placeholder="55"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Body Fat (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.bodyFat}
                    onChange={(e) => handleInputChange('bodyFat', e.target.value)}
                    className="bg-dark-bg/50 border-gray-600 text-white"
                    placeholder="15.5"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Notes</label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="bg-dark-bg/50 border-gray-600 text-white"
                    placeholder="Feeling strong today..."
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!formData.weight}
                  className="w-full bg-neon-purple text-white hover:bg-neon-purple/90"
                >
                  Save Measurements
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {latestStats ? (
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div 
                className="text-center p-4 bg-dark-bg/30 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-2xl font-bold text-neon-purple">{latestStats.weight}</div>
                <div className="text-xs text-gray-400">Weight (kg)</div>
                {progress && (
                  <div className={`text-xs mt-1 ${progress.weightChange >= 0 ? 'text-red-400' : 'text-neon-green'}`}>
                    {progress.weightChange >= 0 ? '↑' : '↓'} {Math.abs(progress.weightChange).toFixed(1)}kg
                  </div>
                )}
              </motion.div>

              {latestStats.height && (
                <motion.div 
                  className="text-center p-4 bg-dark-bg/30 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-2xl font-bold text-neon-blue">
                    {calculateBMI(latestStats.weight, latestStats.height)}
                  </div>
                  <div className="text-xs text-gray-400">BMI</div>
                  <div className={`text-xs mt-1 ${getBMICategory(Number(calculateBMI(latestStats.weight, latestStats.height))).color}`}>
                    {getBMICategory(Number(calculateBMI(latestStats.weight, latestStats.height))).category}
                  </div>
                </motion.div>
              )}

              {latestStats.chest && (
                <motion.div 
                  className="text-center p-4 bg-dark-bg/30 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-2xl font-bold text-neon-green">{latestStats.chest}</div>
                  <div className="text-xs text-gray-400">Chest (cm)</div>
                </motion.div>
              )}

              {latestStats.waist && (
                <motion.div 
                  className="text-center p-4 bg-dark-bg/30 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-2xl font-bold text-accent-orange">{latestStats.waist}</div>
                  <div className="text-xs text-gray-400">Waist (cm)</div>
                </motion.div>
              )}
            </div>

            {/* Last Measurement Date */}
            <div className="text-center p-3 bg-neon-purple/10 rounded-lg">
              <div className="text-sm text-gray-400">
                Last measured on {new Date(latestStats.date).toLocaleDateString()}
              </div>
              {latestStats.notes && (
                <div className="text-sm text-white mt-1">"{latestStats.notes}"</div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-weight-scale text-6xl text-gray-600 mb-4"></i>
            <h4 className="text-xl font-semibold text-white mb-2">No Measurements Yet</h4>
            <p className="text-gray-400 mb-6">Start tracking your progress by adding your first measurement</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-neon-purple text-white hover:bg-neon-purple/90"
            >
              Add First Measurement
            </Button>
          </div>
        )}
      </Card>

      {/* Recent History */}
      {stats.length > 0 && (
        <Card className="p-6 bg-card-bg border-neon-green/30">
          <h3 className="text-lg font-semibold text-neon-green mb-4">Recent Measurements</h3>
          
          <div className="space-y-3">
            {stats
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-dark-bg/30 rounded-lg"
                >
                  <div>
                    <div className="text-white font-medium">
                      {new Date(stat.date).toLocaleDateString()}
                    </div>
                    {stat.notes && (
                      <div className="text-xs text-gray-400">"{stat.notes}"</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-neon-green font-semibold">{stat.weight} kg</div>
                    {stat.height && (
                      <div className="text-xs text-gray-400">
                        BMI: {calculateBMI(stat.weight, stat.height)}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
