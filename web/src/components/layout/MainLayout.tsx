import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useAuth } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, className }) => {
  const location = useLocation();
  const { isLoaded } = useAuth();

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -20,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <main 
        className={cn(
          "flex-grow pt-20", // Add padding-top to account for fixed navbar
          className
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4"
          >
            {!isLoaded ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-otaku-purple" />
              </div>
            ) : (
              children
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout; 