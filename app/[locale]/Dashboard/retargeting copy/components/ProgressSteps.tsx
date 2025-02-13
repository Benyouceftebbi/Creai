import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';

type ProgressStepsProps = {
  steps: string[];
  currentStep: number;
};

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <motion.div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep 
                  ? 'bg-primary text-primary-foreground neon-border' 
                  : 'bg-muted text-muted-foreground'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {index < currentStep ? <CheckIcon className="h-4 w-4" /> : index + 1}
            </motion.div>
            <span className="text-sm mt-2">{step}</span>
          </motion.div>
          
          {index < steps.length - 1 && (
            <motion.div 
              className={`flex-1 h-0.5 mx-4 ${
                index < currentStep ? 'bg-primary' : 'bg-muted'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}