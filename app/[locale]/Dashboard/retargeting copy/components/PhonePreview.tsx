import { motion, AnimatePresence } from 'framer-motion';
import { X, Battery, Signal, Wifi, ChevronLeft } from 'lucide-react';

type PhonePreviewProps = {
  messageTemplate: string;
  senderId: string;
  onClose: () => void;
};

export function PhonePreview({ messageTemplate, senderId, onClose }: PhonePreviewProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          className="relative w-full max-w-[280px]"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
        >
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative w-full h-[500px] bg-black rounded-[2rem] p-2 shadow-2xl neon-border">
            <div className="w-full h-full bg-gray-100 dark:bg-gray-900 rounded-[1.8rem] overflow-hidden">
              <StatusBar />
              <MessageHeader senderId={senderId} />
              <MessageContent message={messageTemplate} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function StatusBar() {
  return (
    <div className="h-8 bg-gray-100 dark:bg-gray-800 flex justify-between items-center px-3 pt-1 text-xs font-medium">
      <span>11:24</span>
      <div className="absolute left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full" />
      <div className="flex items-center gap-1">
        <Signal className="w-3 h-3" />
        <Wifi className="w-3 h-3" />
        <Battery className="w-4 h-4" />
      </div>
    </div>
  );
}

function MessageHeader({ senderId }: { senderId: string }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 px-3 pb-2">
      <div className="flex items-center gap-2 py-1">
        <ChevronLeft className="w-4 h-4 text-blue-500" />
        <div className="flex-1 text-center">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-1" />
          <div className="font-semibold text-xs">{senderId}</div>
        </div>
        <div className="w-4" />
      </div>
    </div>
  );
}

function MessageContent({ message }: { message: string }) {
  return (
    <div className="h-[calc(100%-90px)] overflow-y-auto px-3 py-2">
      <div className="text-center mb-4">
        <div className="text-xs text-gray-500">Today 11:24</div>
      </div>
      <div className="flex justify-start mb-4">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg py-2 px-3 max-w-[80%]">
          <p className="text-sm break-words">{message}</p>
        </div>
      </div>
    </div>
  );
}