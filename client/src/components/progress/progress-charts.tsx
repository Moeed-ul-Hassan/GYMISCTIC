import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBodyStats } from '@/hooks/use-storage';

export function ProgressCharts() {
  const { stats } = useBodyStats();
  const [selectedPeriod, setSelectedPeriod] = useState<'1m' | '3m' | '6m' | '1y'>('3m');

  const getFilteredStats = () => {
    const now = new Date();
    const periods = {
      '1m': 30,
      '3m': 90,
      '6m': 180,
      '1y': 365
    };
    
    const cutoffDate = new Date(now.getTime() - periods[selectedPeriod] * 24 * 60 * 60 * 1000);
    return stats
      .filter(stat => new Date(stat.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const filteredStats = getFilteredStats();

  const getWeightProgress = () => {
    if (filteredStats.length < 2) return null;
    const first = filteredStats[0];
    const last = filteredStats[filteredStats.length - 1];
    const change = last.weight - first.weight;
    const percentage = ((change / first.weight) * 100).toFixed(1);
    return { change: change.toFixed(1), percentage };
  };

  const weightProgress = getWeightProgress();

  const SimpleLineChart = ({ data, label, color }: { data: number[], label: string, color: string }) => {
    if (data.length === 0) return null;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="h-32 relative">
        <div className="absolute inset-0 flex items-end justify-between px-2">
          {data.map((value, index) => {
            const height = ((value - min) / range) * 80 + 20;
            return (
              <motion.div
                key={index}
                className={`w-2 rounded-t ${color} relative`}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                  {value}
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="absolute bottom-0 left-0 text-xs text-gray-500">{label}</div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <Card className="p-6 bg-card-bg border-neon-blue/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neon-blue">Progress Charts</h3>
          <div className="flex space-x-2">
            {(['1m', '3m', '6m', '1y'] as const).map((period) => (
              <Button
                key={period}
                size="sm"
                variant={selectedPeriod === period ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod(period)}
                className={selectedPeriod === period 
                  ? 'bg-neon-blue text-white' 
                  : 'border-gray-600 text-gray-400 hover:text-white'
                }
              >
                {period.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {filteredStats.length > 0 ? (
          <Tabs defaultValue="weight" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-dark-bg/50">
              <TabsTrigger value="weight" className="data-[state=active]:bg-neon-blue/20">
                Weight
              </TabsTrigger>
              <TabsTrigger value="measurements" className="data-[state=active]:bg-neon-blue/20">
                Measurements
              </TabsTrigger>
              <TabsTrigger value="composition" className="data-[state=active]:bg-neon-blue/20">
                Body Comp
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weight" className="mt-6">
              <div className="space-y-4">
                {weightProgress && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-dark-bg/30 rounded-lg">
                      <div className={`text-2xl font-bold ${Number(weightProgress.change) >= 0 ? 'text-red-400' : 'text-neon-green'}`}>
                        {Number(weightProgress.change) >= 0 ? '+' : ''}{weightProgress.change} kg
                      </div>
                      <div className="text-xs text-gray-400">Weight Change</div>
                    </div>
                    <div className="text-center p-4 bg-dark-bg/30 rounded-lg">
                      <div className={`text-2xl font-bold ${Number(weightProgress.percentage) >= 0 ? 'text-red-400' : 'text-neon-green'}`}>
                        {Number(weightProgress.percentage) >= 0 ? '+' : ''}{weightProgress.percentage}%
                      </div>
                      <div className="text-xs text-gray-400">Percentage Change</div>
                    </div>
                  </div>
                )}
                
                <div className="bg-dark-bg/30 rounded-lg p-4">
                  <SimpleLineChart 
                    data={filteredStats.map(s => s.weight)} 
                    label="Weight (kg)" 
                    color="bg-neon-green"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="measurements" className="mt-6">
              <div className="space-y-4">
                {filteredStats.some(s => s.chest) && (
                  <div className="bg-dark-bg/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-white mb-2">Chest (cm)</h4>
                    <SimpleLineChart 
                      data={filteredStats.filter(s => s.chest).map(s => s.chest!)} 
                      label="Chest" 
                      color="bg-neon-purple"
                    />
                  </div>
                )}
                
                {filteredStats.some(s => s.waist) && (
                  <div className="bg-dark-bg/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-white mb-2">Waist (cm)</h4>
                    <SimpleLineChart 
                      data={filteredStats.filter(s => s.waist).map(s => s.waist!)} 
                      label="Waist" 
                      color="bg-accent-orange"
                    />
                  </div>
                )}
                
                {filteredStats.some(s => s.arms) && (
                  <div className="bg-dark-bg/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-white mb-2">Arms (cm)</h4>
                    <SimpleLineChart 
                      data={filteredStats.filter(s => s.arms).map(s => s.arms!)} 
                      label="Arms" 
                      color="bg-neon-blue"
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="composition" className="mt-6">
              <div className="space-y-4">
                {filteredStats.some(s => s.bodyFat) ? (
                  <div className="bg-dark-bg/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-white mb-2">Body Fat (%)</h4>
                    <SimpleLineChart 
                      data={filteredStats.filter(s => s.bodyFat).map(s => s.bodyFat!)} 
                      label="Body Fat %" 
                      color="bg-red-400"
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <i className="fas fa-chart-line text-4xl mb-4 opacity-50"></i>
                    <p>No body composition data yet</p>
                    <p className="text-sm">Add body fat measurements to see progress</p>
                  </div>
                )}
                
                {/* BMI Chart */}
                {filteredStats.some(s => s.height) && (
                  <div className="bg-dark-bg/30 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-white mb-2">BMI</h4>
                    <SimpleLineChart 
                      data={filteredStats
                        .filter(s => s.height)
                        .map(s => Number((s.weight / Math.pow(s.height! / 100, 2)).toFixed(1)))} 
                      label="BMI" 
                      color="bg-yellow-400"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-chart-line text-6xl text-gray-600 mb-4"></i>
            <h4 className="text-xl font-semibold text-white mb-2">No Data for Charts</h4>
            <p className="text-gray-400">Add more measurements to see your progress trends</p>
          </div>
        )}
      </Card>

      {/* Progress Insights */}
      {filteredStats.length > 1 && (
        <Card className="p-6 bg-card-bg border-neon-green/30">
          <h3 className="text-lg font-semibold text-neon-green mb-4">Progress Insights</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <i className="fas fa-calendar text-neon-green"></i>
              <span className="text-gray-400">
                Tracking for {Math.ceil((new Date(filteredStats[filteredStats.length - 1].date).getTime() - new Date(filteredStats[0].date).getTime()) / (1000 * 60 * 60 * 24))} days
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <i className="fas fa-clipboard-check text-neon-green"></i>
              <span className="text-gray-400">
                {filteredStats.length} measurements recorded
              </span>
            </div>
            
            {weightProgress && (
              <div className="flex items-center space-x-2">
                <i className={`fas ${Number(weightProgress.change) >= 0 ? 'fa-arrow-up text-red-400' : 'fa-arrow-down text-neon-green'}`}></i>
                <span className="text-gray-400">
                  {Number(weightProgress.change) >= 0 ? 'Gained' : 'Lost'} {Math.abs(Number(weightProgress.change))} kg in this period
                </span>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
