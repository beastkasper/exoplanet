import styles from "./AboutSection.module.css";

export default function AboutSection() {
  return (
    <div className={styles.aboutContainer}>
      {/* Main Description */}
      <div className={styles.mainDescription}>
        <p>A comprehensive AI/ML platform for discovering exoplanets using NASA space mission data.</p>
      </div>

      {/* Key Missions Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Key Missions</h2>
        <div className={styles.missionsGrid}>
          <div className={styles.missionItem}>
            <span className={styles.starIcon}>⭐</span>
            <h3>AI-Powered Detection</h3>
            <p>Uses machine learning to identify exoplanets.</p>
          </div>
          <div className={styles.missionItem}>
            <span className={styles.starIcon}>⭐</span>
            <h3>Educational Focus</h3>
            <p>Learn about exoplanet detection and space missions</p>
          </div>
          <div className={styles.missionItem}>
            <span className={styles.starIcon}>⭐</span>
            <h3>Real-time Analysis</h3>
            <p>Upload data for instant predictions</p>
          </div>
          <div className={styles.missionItem}>
            <span className={styles.starIcon}>⭐</span>
            <h3>Performance Tracking</h3>
            <p>Monitor model accuracy and performance.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.howItWorksContent}>
          <p>The platform analyzes data from space-based telescopes using machine learning to identify patterns that indicate the presence of exoplanets</p>
          <div className={styles.cosmicImage}></div>
        </div>
      </section>

      {/* Detection Methods Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Detection Methods</h2>
        <div className={styles.methodsGrid}>
          <div className={styles.methodItem}>
            <h3>Transit Method</h3>
            <p>Detects periodic dips in a star's brightness caused by a planet passing in front of it.</p>
          </div>
          <div className={styles.methodItem}>
            <h3>Direct Imaging</h3>
            <p>Involves capturing actual photographs of an exoplanet by blocking out the overwhelming light from its host star.</p>
          </div>
          <div className={styles.methodItem}>
            <h3>Gravitational Microlensing</h3>
            <p>Identifies planets by observing how the gravity of a star and its planet bends and magnifies the light from a more distant, background star.</p>
          </div>
          <div className={styles.methodItem}>
            <h3>Radial Velocity</h3>
            <p>Measures the slight "wobble" in a star's position due to the gravitational pull of an orbiting planet, detected through shifts in the star's spectral lines.</p>
          </div>
          <div className={styles.methodItem}>
            <h3>Astrometry</h3>
            <p>Precisely measures a star's movement across the sky to detect the tiny wobble caused by the gravitational influence of an orbiting planet.</p>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Technology Stack</h2>
        <div className={styles.techGrid}>
          <div className={styles.techItem}>
            <span className={styles.techIcon}>🗄️</span>
            <h3>Backend</h3>
            <p>FastAPI (Python)</p>
          </div>
          <div className={styles.techItem}>
            <span className={styles.techIcon}>🌐</span>
            <h3>Frontend</h3>
            <p>React with TypeScript</p>
          </div>
          <div className={styles.techItem}>
            <span className={styles.techIcon}>🤖</span>
            <h3>ML</h3>
            <p>Scikit-learn</p>
          </div>
          <div className={styles.techItem}>
            <span className={styles.techIcon}>🎨</span>
            <h3>UI</h3>
            <p>Inspiration and God</p>
          </div>
          <div className={styles.techItem}>
            <span className={styles.techIcon}>🐳</span>
            <h3>Deployment</h3>
            <p>Docker</p>
          </div>
          <div className={styles.techItem}>
            <span className={styles.techIcon}>🗃️</span>
            <h3>Database</h3>
            <p>PostgreSQL</p>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Mission Statement:</h2>
        <p className={styles.missionText}>To democratize exoplanet discovery by providing accessible tools for both educational and research purposes, combining NASA's rich space mission data with modern AI/ML technology.</p>
      </section>
    </div>
  );
}
