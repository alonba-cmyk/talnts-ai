import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import SlideShell from './SlideShell';

export default function TimeToTalkSlide() {
  return (
    <SlideShell dark>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <div className="w-24 h-24 rounded-full bg-[#00D2D2]/20 flex items-center justify-center mx-auto mb-8">
          <MessageCircle className="w-12 h-12 text-[#00D2D2]" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Time to talk
        </h2>
        <p className="text-lg text-white/50 max-w-md mx-auto">
          Questions, discussion, next steps.
        </p>
      </motion.div>
    </SlideShell>
  );
}
