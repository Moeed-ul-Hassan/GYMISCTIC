import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

interface BottomNavigationProps {
  onNavigate: (path: string) => void;
}

export function BottomNavigation({ onNavigate }: BottomNavigationProps) {
  const [location] = useLocation();

  const navItems = [
    { path: '/', icon: 'fas fa-home', label: 'Home', color: 'text-neon-green' },
    { path: '/workout', icon: 'fas fa-dumbbell', label: 'Workout', color: 'text-neon-blue' },
    { path: '/meals', icon: 'fas fa-utensils', label: 'Meals', color: 'text-neon-purple' },
    { path: '/progress', icon: 'fas fa-chart-bar', label: 'Progress', color: 'text-accent-orange' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings', color: 'text-white' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card-bg/90 backdrop-blur-lg border-t border-neon-green/20 z-40">
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <motion.button
              key={item.path}
              className={`flex flex-col items-center space-y-1 transition-colors ${
                isActive ? item.color : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => onNavigate(item.path)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.i 
                className={`${item.icon} text-lg`}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <span className="text-xs">{item.label}</span>
              {isActive && (
                <motion.div
                  className={`w-1 h-1 rounded-full ${item.color.replace('text-', 'bg-')}`}
                  layoutId="activeTab"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
