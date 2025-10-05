import { useState } from "react";
import styles from "./SimulatorSection.module.css";
import ExoplanetSimulator3D from "../../components/ExoplanetSimulator3D";

export default function SimulatorSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeView, setActiveView] = useState("sideView");

  // Simulation parameters
  const [starRadius, setStarRadius] = useState(60);
  const [planetRadius, setPlanetRadius] = useState(15);
  const [orbitalRadius, setOrbitalRadius] = useState(200);
  const [orbitalPeriod, setOrbitalPeriod] = useState(8);
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  const [limbDarkening, setLimbDarkening] = useState(0.6);
  const [starTemperature, setStarTemperature] = useState("G-type");
  
  // Fixed orbital inclination for proper transit view
  const orbitalInclination = 90;
  
  // View angles controlled by view buttons only
  const [viewAzimuth, setViewAzimuth] = useState(90);
  const [viewElevation, setViewElevation] = useState(0);

  // Display values
  const eclipseDepth = ((planetRadius / starRadius) ** 2 * 100).toFixed(2);
  const eclipseDuration = (orbitalPeriod * 0.1).toFixed(1);
  const currentPhase = isPlaying ? "Eclipsing" : "Behind Star";
  const impactParameter = Math.sin(
    (orbitalInclination * Math.PI) / 180
  ).toFixed(2);
  const planetStarRatio = (planetRadius / starRadius).toFixed(3);

  const [resetKey, setResetKey] = useState(0);
  
  const handleReset = () => {
    setIsPlaying(false);
    // Force remount of the simulator by changing key
    setResetKey(prev => prev + 1);
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    // Auto-adjust camera position based on view
    switch (view) {
      case "sideView":
        setViewAzimuth(90);
        setViewElevation(0);
        break;
      case "topView":
        setViewAzimuth(0);
        setViewElevation(90);
        break;
      case "angledView":
        setViewAzimuth(45);
        setViewElevation(30);
        break;
    }
  };

  return (
    <div className={styles.simulatorContainer}>
      <div className={styles.simulationWindow}>
        <div className={styles.simulationHeader}>
          <h2>3D View</h2>
          <p>Interactive Perspective - Drag to rotate, scroll to zoom</p>
        </div>

        <div className={styles.simulationArea}>
          <ExoplanetSimulator3D
            key={resetKey}
            starRadius={starRadius}
            planetRadius={planetRadius}
            orbitalRadius={orbitalRadius}
            orbitalPeriod={orbitalPeriod}
            orbitalInclination={orbitalInclination}
            animationSpeed={animationSpeed}
            viewAzimuth={viewAzimuth}
            viewElevation={viewElevation}
            limbDarkening={limbDarkening}
            starTemperature={starTemperature}
            isPlaying={isPlaying}
            activeView={activeView}
          />
        </div>

        <div className={styles.simulationControls}>
          <div className={styles.playbackControls}>
            <button
              className={styles.playButton}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? "⏸️ Pause" : "▷ Start"}
            </button>
            <button className={styles.resetButton} onClick={handleReset}>
              ⟳ Reset
            </button>
          </div>

          <div className={styles.viewControls}>
            <button
              className={`${styles.viewButton} ${
                activeView === "sideView" ? styles.active : ""
              }`}
              onClick={() => handleViewChange("sideView")}
            >
              SideView (Transit)
            </button>
            <button
              className={`${styles.viewButton} ${
                activeView === "topView" ? styles.active : ""
              }`}
              onClick={() => handleViewChange("topView")}
            >
              Top View
            </button>
            <button
              className={`${styles.viewButton} ${
                activeView === "angledView" ? styles.active : ""
              }`}
              onClick={() => handleViewChange("angledView")}
            >
              Angled View
            </button>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className={styles.controlPanel}>
        {/* Display Values */}
        <div className={styles.displayValues}>
          <div className={styles.displayItem}>
            <span>Eclipse Depth</span>
            <span>{eclipseDepth}%</span>
          </div>
          <div className={styles.displayItem}>
            <span>Eclipse Duration</span>
            <span>{eclipseDuration} hrs</span>
          </div>
          <div className={styles.displayItem}>
            <span>Current Phase</span>
            <span>{currentPhase}</span>
          </div>
          <div className={styles.displayItem}>
            <span>Impact Parameter</span>
            <span>{impactParameter}</span>
          </div>
          <div className={styles.displayItem}>
            <span>Planet/Star Ratio</span>
            <span>{planetStarRatio}</span>
          </div>
        </div>

        {/* Adjustable Parameters */}
        <div className={styles.parameters}>
          <div className={styles.parameterRow}>
            <div className={styles.parameterRowLabel}>
              <label>Star Radius</label>
              <span>{starRadius} px (1.0 R☉)</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={starRadius}
              onChange={(e) => setStarRadius(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.parameterRow}>
            <div className={styles.parameterRowLabel}>
              <label>Planet Radius</label>
              <span>{planetRadius} px (0.10 R☉)</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={planetRadius}
              onChange={(e) => setPlanetRadius(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.parameterRow}>
            <div className={styles.parameterRowLabel}>
              <label>Orbital Radius</label>
              <span>{orbitalRadius} px (0.05 AU)</span>
            </div>
            <input
              type="range"
              min="100"
              max="400"
              value={orbitalRadius}
              onChange={(e) => setOrbitalRadius(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.parameterRow}>
            <div className={styles.parameterRowLabel}>
              <label>Orbital Period</label>
              <span>{orbitalPeriod} sec (4.2 days)</span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              value={orbitalPeriod}
              onChange={(e) => setOrbitalPeriod(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.parameterRow}>
            <div className={styles.parameterRowLabel}>
              <label>Animation Speed</label>
              <span>{animationSpeed}x speed</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.parameterRow}>
            <div className={styles.parameterRowLabel}>
              <label>Limb Darkening</label>
              <span>{limbDarkening} coefficient</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={limbDarkening}
              onChange={(e) => setLimbDarkening(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.parameterRow}>
            <div className={styles.parameterRowLabel}>
              <label>Star Temperature</label>
              <span>{starTemperature}</span>
            </div>
            <select
              value={starTemperature}
              onChange={(e) => setStarTemperature(e.target.value)}
              className={styles.dropdown}
            >
              <option value="G-type">G-type (5778K - Yellow/Sun)</option>
              <option value="F-type">F-type (6000K - White)</option>
              <option value="K-type">K-type (4000K - Orange)</option>
              <option value="M-type">M-type (3000K - Red)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
