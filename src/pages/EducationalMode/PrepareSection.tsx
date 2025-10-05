import ExoplanetMap from "../ExoplanetMap";
import styles from "./PrepareSection.module.css";

export default function PrepareSection() {
  return (
    <section className={styles.contentSection}>
      <ExoplanetMap />
    </section>
  );
}
