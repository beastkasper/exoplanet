import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './ModeToggle.module.css';

interface ModeToggleProps {
  className?: string;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.pathname);
  
  // Определяем активный режим на основе текущего пути
  const isProMode = location.pathname.includes('/pro') || location.pathname.includes('/compete');
  const isEducationalMode = location.pathname.includes('/educational');

  const handleNoticeClick = () => {
    if (!isEducationalMode) {
      navigate('/educational');
    }
  };

  const handleProClick = () => {
    if (!isProMode) {
      navigate('/pro');
    }
  };

  return (
    <div className={`${styles.modeToggle} ${className || ''}`}>
      <motion.div 
        className={`${styles.modeButton} ${isEducationalMode ? styles.active : ''}`}
        onClick={handleNoticeClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className={styles.backgroundSlider}
          animate={{
            x: isEducationalMode ? 0 : -100,
            opacity: isEducationalMode ? 1 : 0
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <motion.span 
          className={styles.modeText}
          animate={{
            color: isEducationalMode ? '#000' : '#fff'
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Notice
        </motion.span>
      </motion.div>
      
      <motion.div 
        className={`${styles.modeButton} ${isProMode ? styles.active : ''}`}
        onClick={handleProClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className={styles.backgroundSlider}
          animate={{
            x: isProMode ? 0 : 100,
            opacity: isProMode ? 1 : 0
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <motion.span 
          className={styles.modeText}
          animate={{
            color: isProMode ? '#000' : '#fff'
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Pro
        </motion.span>
      </motion.div>
    </div>
  );
};

export default ModeToggle;
