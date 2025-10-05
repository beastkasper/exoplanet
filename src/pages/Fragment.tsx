import Frag1 from "../assets/ex1.png";
import startImg from "../assets/fragment2.png";
import ProImg from "../assets/fragment1.png";
import styles from "./Fragment.module.css";

function Fragment() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to the World of Exoplanets</h1>
        <p className={styles.subtitle}>Explore this amazing universe with us</p>

        <div className={styles.cardsContainer}>
          <a href="/educational">
            <div className={styles.cardStart}>
              <h3 className={styles.cardTitle}>Start learning</h3>
              <p className={styles.cardSubtitle}>Learn What Exoplanets Are</p>
              <div className={styles.cardIcon}>
                <img src={startImg} alt="frag" className={styles.cardImg} />
              </div>
            </div>
          </a>
          <a href="/pro">
            <div className={styles.card}>
              <h3 className={styles.cardTitlePro}>I am Pro</h3>
              <p className={styles.cardSubtitlePro}>
                Test your own data on our platform
              </p>
              <div className={styles.cardIcon}>
                <div className={styles.spiralIcon}>
                  <img
                    src={ProImg}
                    alt="proimg"
                    className={styles.cardImgPro}
                  />
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
      <div>
        <img src={Frag1} alt="fra" />
      </div>
      {/* <div className={styles.visualization}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <AbstractVisualization />
        </Canvas>
      </div>
      
      <div className={styles.avatar}>
        <div className={styles.avatarIcon}></div>
      </div> */}
    </div>
  );
}

export default Fragment;
