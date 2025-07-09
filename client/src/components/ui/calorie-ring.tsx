import { motion } from 'framer-motion';

interface CalorieRingProps {
  consumed: number;
  target: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function CalorieRing({ consumed, target, size = 'md', showLabel = true }: CalorieRingProps) {
  const percentage = Math.min((consumed / target) * 100, 100);
  
  const sizeConfig = {
    sm: { radius: 40, strokeWidth: 6, fontSize: 'text-sm' },
    md: { radius: 60, strokeWidth: 8, fontSize: 'text-lg' },
    lg: { radius: 80, strokeWidth: 10, fontSize: 'text-2xl' }
  };
  
  const { radius, strokeWidth, fontSize } = sizeConfig[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getColor = () => {
    if (percentage < 50) return '#00FF88'; // neon-green
    if (percentage < 80) return '#00D4FF'; // neon-blue
    if (percentage < 100) return '#FF6B35'; // accent-orange
    return '#FF3333'; // red for over target
  };

  const color = getColor();
  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={svgSize}
        height={svgSize}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          stroke="hsl(240, 3.7%, 15.9%)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`font-orbitron font-bold text-white ${fontSize}`}>
            {consumed}
          </div>
          {showLabel && (
            <div className="text-xs text-gray-400 -mt-1">
              / {target}
            </div>
          )}
        </div>
      </div>
      
      {/* Percentage indicator */}
      {size !== 'sm' && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div 
            className="text-xs px-2 py-1 rounded-full"
            style={{ 
              backgroundColor: `${color}20`,
              color: color,
              border: `1px solid ${color}40`
            }}
          >
            {Math.round(percentage)}%
          </div>
        </div>
      )}
    </div>
  );
}
