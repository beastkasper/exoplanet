import { useState } from "react";
import { Outlet } from "react-router-dom";
import { EducationalContext } from "../contexts/EducationalContext";
import styles from "./EducationalLayout.module.css";

export default function EducationalLayout() {
  const [activeSection, setActiveSection] = useState("learn");

  return (
    <div className={styles.educationalLayout}>
      {/* Header Section */}
      <header className={styles.headerSection}>
        <div className={styles.headerButtons}>
          <button className={styles.noticeBtn}>
            <span className={styles.starIcon}>⭐</span>
            Notice
          </button>
          <button className={styles.proBtn}>
            <span className={styles.docIcon}>📄</span>
            Pro
          </button>
        </div>

        <h1 className={styles.mainTitle}>World of Exoplanets</h1>
        <p className={styles.subtitle}>Explore this amazing universe with us</p>
      </header>
      
      <nav className={styles.mainNav}>
        <button 
          className={`${styles.navBtn} ${activeSection === "learn" ? styles.active : ""}`}
          onClick={() => setActiveSection("learn")}
        >
          Learn
        </button>
        <button 
          className={`${styles.navBtn} ${activeSection === "predict" ? styles.active : ""}`}
          onClick={() => setActiveSection("predict")}
        >
          predict
        </button>
        <button 
          className={`${styles.navBtn} ${activeSection === "simulator" ? styles.active : ""}`}
          onClick={() => setActiveSection("simulator")}
        >
          Simulator
        </button>
        <button 
          className={`${styles.navBtn} ${activeSection === "about" ? styles.active : ""}`}
          onClick={() => setActiveSection("about")}
        >
          About
        </button>
      </nav>

      {/* Content Area */}
      <main className={styles.educationalContent}>
        <EducationalContext.Provider value={{ activeSection, setActiveSection }}>
          <Outlet />
        </EducationalContext.Provider>
      </main>
    </div>
  );
}
