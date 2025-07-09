import { motion } from 'framer-motion';

export default function Settings() {
  return (
    <div className="min-h-screen gradient-bg pb-24">
      <header className="bg-card-bg/50 backdrop-blur-lg border-b border-gray-600/20 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center space-x-3">
          <i className="fas fa-cog text-white text-xl"></i>
          <h1 className="text-xl font-orbitron font-bold text-white">Settings</h1>
        </div>
      </header>

      <main className="px-4 py-6">
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <i className="fas fa-cog text-6xl text-white mb-4 animate-bounce-subtle"></i>
          <h2 className="text-2xl font-bold text-white mb-4">App Settings</h2>
          <p className="text-gray-400 mb-8">Customize your GYMistic experience</p>
          
          <div className="bg-card-bg rounded-xl p-6 border border-gray-600/30 text-left max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Coming Soon Features:</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Profile setup</li>
              <li>• Notification preferences</li>
              <li>• Dhikr reminder settings</li>
              <li>• Data export/import</li>
              <li>• Voice motivation toggle</li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
