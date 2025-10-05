import React, { useEffect } from 'react';

import styles from './ExoplanetModal.module.css';
import type { Exoplanet } from '../../types/exoplanet';

interface ExoplanetModalProps {
  isOpen: boolean;
  onClose: () => void;
  exoplanet: Exoplanet | null;
}

const ExoplanetModal: React.FC<ExoplanetModalProps> = ({ isOpen, onClose, exoplanet }) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !exoplanet) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.topButtons}>
            <button className={styles.noticeButton}>
              <span className={styles.buttonIcon}>⭐</span>
              Notice
            </button>
            <button className={styles.proButton}>
              <span className={styles.buttonIcon}>📊</span>
              Pro
            </button>
          </div>
          <h1 className={styles.title}>World of Exoplanets</h1>
        </div>

        {/* Visual Graphic Section */}
        <div className={styles.visualSection}>
          <div className={styles.planetIllustration}>
            <div className={styles.planet}>
              <div className={styles.planetRings}></div>
            </div>
            <div className={styles.backgroundElements}>
              <div className={styles.element}>THAVONLI</div>
              <div className={styles.element}>AASTUSHEN</div>
              <div className={styles.element}>CAKTION</div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className={styles.infoSection}>
          <h2 className={styles.infoTitle}>What is an Exoplanet?</h2>
          <p className={styles.infoSubtitle}>
            Exoplanets are planets that orbit stars beyond our Solar System
          </p>

          <div className={styles.infoPoints}>
            <div className={styles.infoPoint}>
              <div className={styles.pointHeader}>
                <span className={styles.pointIcon}>🌎</span>
                <span className={styles.pointTitle}>History</span>
              </div>
              <p className={styles.pointDescription}>
                Since the first discovery in 1995, astronomers have confirmed over 5,000 exoplanets — ranging from giant gas worlds larger than Jupiter to rocky Earth-like planets.
              </p>
            </div>

            <div className={styles.infoPoint}>
              <div className={styles.pointHeader}>
                <span className={styles.pointIcon}>🔭</span>
                <span className={styles.pointTitle}>Detect</span>
              </div>
              <p className={styles.pointDescription}>
                We detect them by observing how a star's light changes — for example, when a planet passes in front, causing a tiny dip in brightness.
              </p>
            </div>

            <div className={styles.infoPoint}>
              <div className={styles.pointHeader}>
                <span className={styles.pointIcon}>✨</span>
                <span className={styles.pointTitle}>Studying</span>
              </div>
              <p className={styles.pointDescription}>
                We study their atmospheres, compositions, and potential for life by analyzing the light that passes through or reflects off these distant worlds.
              </p>
            </div>
          </div>
        </div>

        {/* Related Missions Section */}
        <div className={styles.missionsSection}>
          <div className={styles.missionCard}>
            <h3 className={styles.missionTitle}>Kepler</h3>
            <p className={styles.missionDescription}>First large-scale planet-hunting space telescope</p>
            <div className={styles.missionImage}>
              <div className={styles.spacecraftIcon}>🚀</div>
            </div>
          </div>

          <div className={styles.missionCard}>
            <h3 className={styles.missionTitle}>K2</h3>
            <p className={styles.missionDescription}>Kepler's extended mission with shifting fields.</p>
            <div className={styles.missionImage}>
              <div className={styles.spacecraftIcon}>🛰️</div>
            </div>
          </div>

          <div className={styles.missionCard}>
            <h3 className={styles.missionTitle}>TESS</h3>
            <p className={styles.missionDescription}>All-sky survey of nearby bright stars.</p>
            <div className={styles.missionImage}>
              <div className={styles.spacecraftIcon}>🛸</div>
            </div>
          </div>
        </div>

        {/* Selected Exoplanet Details */}
        {exoplanet && (
          <div className={styles.exoplanetDetails}>
            <h3 className={styles.detailsTitle}>Selected Exoplanet: {exoplanet.pl_name}</h3>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Host Star:</span>
                <span className={styles.detailValue}>{exoplanet.hostname}</span>
              </div>
              {exoplanet.sy_dist && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Distance:</span>
                  <span className={styles.detailValue}>{exoplanet.sy_dist.toFixed(1)} parsecs</span>
                </div>
              )}
              {exoplanet.pl_rade && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Planet Radius:</span>
                  <span className={styles.detailValue}>{exoplanet.pl_rade.toFixed(2)} R⊕</span>
                </div>
              )}
              {exoplanet.pl_orbper && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Orbital Period:</span>
                  <span className={styles.detailValue}>{exoplanet.pl_orbper.toFixed(1)} days</span>
                </div>
              )}
              {exoplanet.pl_eqt && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Equilibrium Temp:</span>
                  <span className={styles.detailValue}>{exoplanet.pl_eqt.toFixed(0)} K</span>
                </div>
              )}
              {exoplanet.disc_year && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Discovered:</span>
                  <span className={styles.detailValue}>{exoplanet.disc_year}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExoplanetModal;
