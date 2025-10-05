import { useState } from "react";
import styles from "./LearnSection.module.css";
import exoplanet from "../../assets/fragment2.png";
import frag3 from "../../assets/frag3.png";
import frag4 from "../../assets/frag4.png";
import sput1 from "../../assets/sput1.png";
import sput2 from "../../assets/sput2.png";
import sput3 from "../../assets/sput3.png";
import ExoplanetModal from "../../components/modals/ExoplanetModal";
import type { Exoplanet } from "../../types/exoplanet";

export default function LearnSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExoplanet, setSelectedExoplanet] = useState<Exoplanet | null>(
    null
  );

  // Sample exoplanet data for demonstration
  const sampleExoplanet: Exoplanet = {
    pl_name: "Kepler-452b",
    hostname: "Kepler-452",
    ra: 285.5,
    dec: 44.3,
    sy_dist: 1400,
    pl_orbper: 384.8,
    pl_rade: 1.63,
    pl_masse: 5.0,
    pl_eqt: 265,
    st_teff: 5757,
    st_rad: 1.11,
    st_mass: 1.04,
    disc_year: 2015,
  };

  const handleCardClick = () => {
    setSelectedExoplanet(sampleExoplanet);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExoplanet(null);
  };

  return (
    <>
      <ExoplanetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        exoplanet={selectedExoplanet}
      />
      {/* What is an Exoplanet Section */}
      <section className={styles.contentSection}>
        <div className={styles.exoplanetCard} onClick={handleCardClick}>
          <div className={styles.cardContent}>
            <h2>What is an Exoplanet?</h2>
            <p>Discover worlds beyond our Solar System</p>
          </div>
          <img
            className={styles.cardIllustration1}
            src={exoplanet}
            alt="exoplanet"
          />
        </div>
      </section>

      {/* Method Section */}
      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Method</h2>
        <p className={styles.sectionSubtitle}>
          How light from planets is studied
        </p>

        <div className={styles.methodCards}>
          <div className={styles.methodCard}>
            <h3>How the Transit Method Works</h3>
            <p>See how a planet dims its star as it passes in front</p>
            <div className={styles.transitIllustration}>
              <img
                src={frag3}
                className={styles.fragmentIllustration1}
                alt=""
              />
            </div>
          </div>

          <div className={styles.methodCard}>
            <h3>Other Detection Methods</h3>
            <p>Explore different ways astronomers find planets</p>
            <div className={styles.otherMethodsIllustration}>
              <img
                src={frag4}
                className={styles.fragmentIllustration2}
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Missions Section */}
      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Key Missions</h2>
        <p className={styles.sectionSubtitle}>The story behind each mission</p>

        <div className={styles.missionsCards}>
          <div className={styles.missionCard}>
            <h3>Kepler + K2</h3>
            <p>First large-scale planet-hunting space telescope</p>
            <div className={styles.keplerIllustration}>
              <img
                className={styles.keplerIllustrationImg}
                src={sput1}
                alt=""
              />
            </div>
          </div>

          <div className={styles.missionCard}>
            <h3>NEOSSat</h3>
            <p>Kepler's extended mission with shifting fields</p>
            <div className={styles.neossatIllustration}>
              <img
                src={sput2}
                className={styles.keplerIllustrationImg}
                alt=""
              />
            </div>
          </div>

          <div className={styles.missionCard}>
            <h3>TESS</h3>
            <p>All-sky survey of nearby bright stars</p>
            <div className={styles.tessIllustration}>
              <img
                src={sput3}
                className={styles.keplerIllustrationImg}
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interesting Facts Section */}
      {/* <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Interesting facts</h2>
        <p className={styles.sectionSubtitle}>
          How scientists are studying this in greater depth
        </p>

        <div className={styles.factsCard}>
          <div className={styles.workTag}>Work</div>
          <h3>From Light Curve to Planet</h3>
          <p>Learn how astronomers identify planets from stellar brightness</p>
          <div className={styles.lightCurveIllustration}>
            <div className={styles.curveGraph}></div>
            <div className={styles.starIndicator}></div>
            <div className={styles.planetIndicator}></div>
          </div>
        </div>
      </section> */}

      {/* Exoplanet Modal */}
      <ExoplanetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        exoplanet={selectedExoplanet}
      />
    </>
  );
}
