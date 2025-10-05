import React from 'react';
import { motion } from 'framer-motion';
import ModeToggle from '../components/ModeToggle';
import styles from './Compete.module.css';

export default function Compete() {
  return (
    <div className={styles.competePage}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.header}
      >
        <div className={styles.badges}>
          <ModeToggle />
        </div>
        
        <h1 className={styles.title}>Exoplanets for Pro</h1>
        <p className={styles.subtitle}>Deeper into data, closer to discovery</p>
        
        <div className={styles.tabs}>
          <button className={styles.tab}>
            Predict
          </button>
          <button className={`${styles.tab} ${styles.tabActive}`}>
            Compete
          </button>
          <button className={styles.tab}>
            About
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={styles.content}
      >
        {/* Competition Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={styles.competitionButton}
        >
          64 Hug × 18 Hug
        </motion.div>

        {/* Explore and Win Section */}
        <div className={styles.exploreSection}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={styles.sectionTitle}
          >
            Explore and Win
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className={styles.sectionSubtitle}
          >
            Turn your discoveries into achievements
          </motion.p>

          {/* Cards Grid */}
          <div className={styles.cardsGrid}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className={styles.card}
            >
              <div className={styles.cardIcon}>
                <span className={styles.icon}>→</span>
              </div>
              <h3 className={styles.cardTitle}>Sign Up</h3>
              <p className={styles.cardDescription}>
                Create your account and join the exploration
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className={styles.card}
            >
              <div className={styles.cardIcon}>
                <span className={styles.icon}>☁️↓</span>
              </div>
              <h3 className={styles.cardTitle}>Download the Model</h3>
              <p className={styles.cardDescription}>
                Get the latest version and start experimenting
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className={styles.card}
            >
              <div className={styles.cardIcon}>
                <span className={styles.icon}>⚙️⭐</span>
              </div>
              <h3 className={styles.cardTitle}>Analyze Your Data</h3>
              <p className={styles.cardDescription}>
                Run predictions, visualize results, and learn from them
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className={styles.card}
            >
              <div className={styles.cardIcon}>
                <span className={styles.icon}>☆</span>
              </div>
              <h3 className={styles.cardTitle}>Join the Leaderboard</h3>
              <p className={styles.cardDescription}>
                Compare your results and climb the discovery ranks
              </p>
            </motion.div>
          </div>
        </div>

        {/* Coming Soon Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className={styles.comingSoonSection}
        >
          <button className={styles.comingSoonButton}>
            Coming soon
          </button>
        </motion.div>
      </motion.main>
    </div>
  );
}
