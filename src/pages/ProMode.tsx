import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './ProMode.module.css';

export default function ProMode() {
  const [selectedTab, setSelectedTab] = useState<'predict' | 'compete'>('predict');
  const [selectedModel, setSelectedModel] = useState('LightGBM');
  const [threshold, setThreshold] = useState(0.1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.header}
      >
        <div className={styles.badges}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>⭐</span>
            Notice
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>📊</span>
            Pro
          </div>
        </div>
        
        <h1 className={styles.title}>Exoplanets for Pro</h1>
        <p className={styles.subtitle}>Deeper into data, closer to discovery</p>
        
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${selectedTab === 'predict' ? styles.tabActive : ''}`}
            onClick={() => setSelectedTab('predict')}
          >
            Predict
          </button>
          <button
            className={`${styles.tab} ${selectedTab === 'compete' ? styles.tabActive : ''}`}
            onClick={() => setSelectedTab('compete')}
          >
            Compete
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Section 1: Select Model */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>1. Select model</h2>
          <p className={styles.sectionDescription}>
            Learn how different models see the same sky
          </p>
          
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Available models</label>
            <div className={styles.selectContainer}>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className={styles.select}
              >
                <option value="LightGBM">LightGBM</option>
                <option value="RandomForest">Random Forest</option>
                <option value="XGBoost">XGBoost</option>
                <option value="NeuralNetwork">Neural Network</option>
              </select>
              <span className={styles.selectArrow}>▼</span>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Select Threshold */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>2. Select threshold</h2>
          <p className={styles.sectionDescription}>
            Set your confidence limit for planet detection
          </p>
          
          <div className={styles.sliderContainer}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>
                Threshold
                <span className={styles.helpIcon}>?</span>
              </span>
              <span className={styles.sliderValue}>{threshold}</span>
            </div>
            
            <div className={styles.sliderWrapper}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>
            
            <div className={styles.metrics}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>F1</span>
                <span className={styles.metricValue}>0.01</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Recall</span>
                <span className={styles.metricValue}>0.01</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Matthews</span>
                <span className={styles.metricValue}>0.01</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={styles.chartSection}
        >
          <h3 className={styles.chartTitle}>Basic Line Chart 02</h3>
          <div className={styles.chart}>
            <div className={styles.chartGrid}>
              <div className={styles.yAxis}>
                <span>300</span>
                <span>200</span>
                <span>100</span>
                <span>0</span>
              </div>
              <div className={styles.chartArea}>
                <div className={styles.chartLines}>
                  {/* Blue line */}
                  <svg className={styles.chartLine} viewBox="0 0 400 200">
                    <polyline
                      points="20,180 80,160 140,120 200,80 260,100 320,90 380,110"
                      fill="none"
                      stroke="#4a90e2"
                      strokeWidth="3"
                    />
                    <circle cx="20" cy="180" r="4" fill="#4a90e2" />
                    <circle cx="80" cy="160" r="4" fill="#4a90e2" />
                    <circle cx="140" cy="120" r="4" fill="#4a90e2" />
                    <circle cx="200" cy="80" r="4" fill="#4a90e2" />
                    <circle cx="260" cy="100" r="4" fill="#4a90e2" />
                    <circle cx="320" cy="90" r="4" fill="#4a90e2" />
                    <circle cx="380" cy="110" r="4" fill="#4a90e2" />
                  </svg>
                  
                  {/* Orange line */}
                  <svg className={styles.chartLine} viewBox="0 0 400 200">
                    <polyline
                      points="20,100 80,140 140,120 200,150 260,130 320,140 380,135"
                      fill="none"
                      stroke="#ff6b6b"
                      strokeWidth="3"
                    />
                    <circle cx="20" cy="100" r="3" fill="#ff6b6b" />
                    <circle cx="80" cy="140" r="3" fill="#ff6b6b" />
                    <circle cx="140" cy="120" r="3" fill="#ff6b6b" />
                    <circle cx="200" cy="150" r="3" fill="#ff6b6b" />
                    <circle cx="260" cy="130" r="3" fill="#ff6b6b" />
                    <circle cx="320" cy="140" r="3" fill="#ff6b6b" />
                    <circle cx="380" cy="135" r="3" fill="#ff6b6b" />
                  </svg>
                </div>
                
                <div className={styles.xAxis}>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                </div>
              </div>
            </div>
            
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#4a90e2' }}></div>
                <span>Legend 1</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#ff6b6b' }}></div>
                <span>Legend 2</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 3: Load Data */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={styles.section}
        >
          <h2 className={styles.sectionTitle}>3. Load data</h2>
          <p className={styles.sectionDescription}>
            Upload your data
          </p>
          
          <div
            className={styles.uploadArea}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input
              id="fileInput"
              type="file"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept=".csv,.json,.txt"
            />
            <span className={styles.uploadText}>
              {uploadedFile ? uploadedFile.name : 'Tap or drag for load'}
            </span>
            <span className={styles.uploadIcon}>☁️</span>
          </div>
          
          <p className={styles.uploadSubtitle}>
            Try our examples to see how it works
          </p>
          
          <div className={styles.demoButtons}>
            <div className={styles.demoButton}>
              <div className={styles.demoInfo}>
                <h4>Kepler</h4>
                <p>Demo Data</p>
              </div>
              <button className={styles.downloadButton}>Download</button>
            </div>
            
            <div className={styles.demoButton}>
              <div className={styles.demoInfo}>
                <h4>TESS</h4>
                <p>Demo Data</p>
              </div>
              <button className={styles.downloadButton}>Download</button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className={styles.footer}
      >
        <button className={styles.predictButton}>
          Predict
        </button>
        <div className={styles.avatar}>
          <span className={styles.avatarIcon}>👨‍🚀</span>
        </div>
      </motion.div>
    </div>
  );
}