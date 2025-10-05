import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Scroll-based camera controller
export const ScrollCameraController: React.FC<{
  scrollRef: React.RefObject<HTMLDivElement>;
}> = ({ scrollRef }) => {
  const { camera } = useThree();
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end']
  });

  // Smooth spring animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Camera position transforms
  const cameraX = useTransform(smoothProgress, [0, 0.5, 1], [0, 20, 0]);
  const cameraY = useTransform(smoothProgress, [0, 0.5, 1], [0, 10, 0]);
  const cameraZ = useTransform(smoothProgress, [0, 0.5, 1], [30, 15, 50]);

  // Camera rotation transforms
  const rotationX = useTransform(smoothProgress, [0, 0.5, 1], [0, -0.2, 0]);
  const rotationY = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.5, 0]);

  useEffect(() => {
    const unsubscribeX = cameraX.on('change', (value) => {
      camera.position.x = value;
    });
    const unsubscribeY = cameraY.on('change', (value) => {
      camera.position.y = value;
    });
    const unsubscribeZ = cameraZ.on('change', (value) => {
      camera.position.z = value;
    });
    const unsubscribeRX = rotationX.on('change', (value) => {
      camera.rotation.x = value;
    });
    const unsubscribeRY = rotationY.on('change', (value) => {
      camera.rotation.y = value;
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
      unsubscribeZ();
      unsubscribeRX();
      unsubscribeRY();
    };
  }, [camera, cameraX, cameraY, cameraZ, rotationX, rotationY]);

  return null;
};

// Scroll-based object animations
export const ScrollObjectAnimations: React.FC<{
  scrollRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}> = ({ scrollRef, children }) => {
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        scale: useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1.2, 1]),
        opacity: useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.8])
      }}
    >
      {children}
    </motion.div>
  );
};

// Parallax scrolling effect for UI elements
export const ParallaxElement: React.FC<{
  children: React.ReactNode;
  scrollRef: React.RefObject<HTMLDivElement>;
  speed?: number;
  className?: string;
}> = ({ children, scrollRef, speed = 0.5, className }) => {
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <motion.div
      className={className}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
};

// Reveal animation on scroll
export const RevealOnScroll: React.FC<{
  children: React.ReactNode;
  scrollRef: React.RefObject<HTMLDivElement>;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}> = ({ 
  children, 
  scrollRef, 
  direction = 'up', 
  delay = 0,
  className 
}) => {
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start 0.8', 'start 0.2']
  });

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return { y: 50, opacity: 0 };
      case 'down': return { y: -50, opacity: 0 };
      case 'left': return { x: 50, opacity: 0 };
      case 'right': return { x: -50, opacity: 0 };
      default: return { y: 50, opacity: 0 };
    }
  };

  const getAnimateTransform = () => {
    switch (direction) {
      case 'up': return { y: 0, opacity: 1 };
      case 'down': return { y: 0, opacity: 1 };
      case 'left': return { x: 0, opacity: 1 };
      case 'right': return { x: 0, opacity: 1 };
      default: return { y: 0, opacity: 1 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={getInitialTransform()}
      animate={getAnimateTransform()}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      style={{
        opacity: useTransform(scrollYProgress, [0, 1], [0, 1])
      }}
    >
      {children}
    </motion.div>
  );
};

// Staggered animation for multiple elements
export const StaggeredReveal: React.FC<{
  children: React.ReactNode[];
  scrollRef: React.RefObject<HTMLDivElement>;
  staggerDelay?: number;
  className?: string;
}> = ({ children, scrollRef, staggerDelay = 0.1, className }) => {
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start 0.8', 'start 0.2']
  });

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      style={{
        opacity: useTransform(scrollYProgress, [0, 1], [0, 1])
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Scroll progress indicator
export const ScrollProgress: React.FC<{
  scrollRef: React.RefObject<HTMLDivElement>;
  className?: string;
}> = ({ scrollRef, className }) => {
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end']
  });

  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className={className}>
      <motion.div
        className="progress-bar"
        style={{
          scaleX,
          transformOrigin: 'left'
        }}
      />
    </div>
  );
};

// Magnetic hover effect
export const MagneticHover: React.FC<{
  children: React.ReactNode;
  strength?: number;
  className?: string;
}> = ({ children, strength = 0.3, className }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={position}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
    >
      {children}
    </motion.div>
  );
};

// Floating animation
export const FloatingAnimation: React.FC<{
  children: React.ReactNode;
  intensity?: number;
  duration?: number;
  className?: string;
}> = ({ children, intensity = 10, duration = 3, className }) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -intensity, 0],
        rotate: [0, 1, -1, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
};
