import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fetchExoplanets } from '../api/exoplanets';
import EnhancedSpaceVisualization from '../components/3D/EnhancedSpaceVisualization';
import type { Exoplanet } from '../types/exoplanet';
import styles from './SpaceVisualization.module.css';

const SpaceVisualization: React.FC = () => {
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadExoplanets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const data = await fetchExoplanets() as Exoplanet[];
      clearTimeout(timeoutId);
      
      console.log('Loaded exoplanets for visualization:', data.length);
      
      // Filter out planets with missing coordinate data
      const validPlanets = data.filter((planet: Exoplanet) => 
        planet.ra != null && 
        planet.dec != null && 
        planet.sy_dist != null &&
        planet.sy_dist > 0 &&
        planet.pl_name
      );
      
      console.log('Valid planets with coordinates:', validPlanets.length);
      
      if (validPlanets.length === 0) {
        throw new Error('No valid exoplanets found with coordinate data');
      }
      
      setExoplanets(validPlanets);
      
    } catch (err) {
      console.error('Error loading exoplanets:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load exoplanet data';
      
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timeout - please check your connection and try again');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    loadExoplanets();
  }, [loadExoplanets]);

  const handlePlanetSelect = useCallback((planet: Exoplanet | null) => {
    setSelectedPlanet(planet);
  }, []);

  const retryLoading = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setError(null);
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={styles.loadingContent}
        >
          <div className={styles.loadingSpinner} />
          <h2>Loading Space Visualization</h2>
          <p>Fetching exoplanet data from NASA...</p>
          <div className={styles.loadingProgress}>
            <div className={styles.progressBar} />
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.errorContent}
        >
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Error Loading Visualization</h2>
          <p>{error}</p>
          <button 
            onClick={retryLoading}
            className={styles.retryButton}
          >
            Retry ({retryCount > 0 ? `Attempt ${retryCount + 1}` : 'Try Again'})
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className={styles.header}
      >
        <h1>NASA Eyes on Exoplanets</h1>
        <p>Explore the universe through stunning 3D visualization</p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{exoplanets.length}</span>
            <span className={styles.statLabel}>Exoplanets</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>10</span>
            <span className={styles.statLabel}>Visualized</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>∞</span>
            <span className={styles.statLabel}>Possibilities</span>
          </div>
        </div>
      </motion.div>

      {/* Main 3D Visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className={styles.visualizationContainer}
      >
        <EnhancedSpaceVisualization
          exoplanets={exoplanets}
          selectedPlanet={selectedPlanet}
          onPlanetSelect={handlePlanetSelect}
        />
      </motion.div>

      {/* Information Panel */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className={styles.infoPanel}
      >
        <h3>About This Visualization</h3>
        <p>
          This immersive 3D experience brings NASA's exoplanet data to life. 
          Each point represents a real exoplanet discovered by astronomers, 
          positioned according to its actual coordinates in space.
        </p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🌟</span>
            <span>Real exoplanet data</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🎮</span>
            <span>Interactive 3D controls</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🎬</span>
            <span>Cinematic effects</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📱</span>
            <span>Responsive design</span>
          </div>
        </div>
      </motion.div>

      {/* Scroll Content */}
      <div className={styles.scrollContent}>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={styles.contentSection}
        >
          <h2>Discovering New Worlds</h2>
          <p>
            Since the first exoplanet discovery in 1995, astronomers have confirmed 
            over 5,000 exoplanets. These distant worlds range from gas giants larger 
            than Jupiter to rocky planets similar to Earth.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className={styles.contentSection}
        >
          <h2>Detection Methods</h2>
          <p>
            Astronomers use various methods to detect exoplanets, including the 
            transit method, radial velocity, and direct imaging. Each method 
            provides unique insights into these distant worlds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className={styles.contentSection}
        >
          <h2>Future Exploration</h2>
          <p>
            With advanced telescopes like JWST and upcoming missions, we're 
            discovering more exoplanets and learning about their atmospheres, 
            compositions, and potential for life.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SpaceVisualization;
