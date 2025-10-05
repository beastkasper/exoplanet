import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ModeToggle from '../components/ModeToggle';
import ModelMetricsChart from '../components/ModelMetricsChart';
import styles from './ProMode.module.css';

interface Model {
  id: number;
  name: string;
  path: string;
  metrics: {
    thresholds: number[];
    positive_count: number[];
    negative_count: number[];
    recall: number[];
    precision: number[];
    f1_score: number[];
    auc_roc: number;
    auc_pr: number;
  };
}

export default function ProMode() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'predict' | 'compete'>('predict');
  const [selectedModel, setSelectedModel] = useState('k2_lightgbm');
  const [threshold, setThreshold] = useState(0.1);
  const [models, setModels] = useState<Model[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [, setLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  useEffect(() => {
    handleGetModels();
  }, []);

  const handleGetModels = () => {
    setLoading(true);
    fetch('https://explore-planets-vf1s.onrender.com/api/model/')
    .then(response => response.json())
    .then(data => {
      console.log('Models data:', data);
      setModels(data);
      if (data.length > 0) {
        setSelectedModel(data[0].name);
      }
    })
    .catch(error => {
      console.error('Error fetching models:', error);
      // Fallback to sample data if API fails
      const sampleModels: Model[] = [
        {
          id: 1,
          name: "k2_lasso",
          path: "app/assets/models/K2/k2_lasso.joblib",
          metrics: {
            thresholds: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
            positive_count: [782.0, 771.0, 737.0, 695.0, 596.0, 459.0, 333.0, 229.0, 165.0],
            negative_count: [19.0, 30.0, 64.0, 106.0, 205.0, 342.0, 468.0, 572.0, 636.0],
            recall: [0.5991095625241967, 0.6433410762679055, 0.7667440960123887, 0.8244289585753, 0.834881920247774, 0.8023615950445219, 0.725609756097561, 0.6551490514905149, 0.6117886178861789],
            precision: [0.8101359536949791, 0.7881322957198443, 0.7629324966078697, 0.7047509162481336, 0.6274349320674415, 0.5895539502350647, 0.5673076923076923, 0.5550699300699301, 0.5495283018867925],
            f1_score: [0.6401155327342747, 0.6860770858718656, 0.7648204991325237, 0.7453226359233123, 0.6460034907919174, 0.5357096444815743, 0.42956843754450935, 0.3360274898419497, 0.27285300785650124],
            auc_roc: 0.9255602873489053,
            auc_pr: 0.9930556298296558
          }
        },
        {
          id: 2,
          name: "k2_lightgbm",
          path: "app/assets/models/K2/k2_lightgbm.joblib",
          metrics: {
            thresholds: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
            positive_count: [752.0, 745.0, 741.0, 738.0, 733.0, 730.0, 721.0, 714.0, 700.0],
            negative_count: [49.0, 56.0, 60.0, 63.0, 68.0, 71.0, 80.0, 87.0, 101.0],
            recall: [0.8716608594657376, 0.9099883855981417, 0.9331204026325978, 0.9483159117305459, 0.9535423925667827, 0.9515098722415796, 0.9540263259775454, 0.9492837785520712, 0.9570267131242741],
            precision: [0.9689535388623534, 0.9569031639501439, 0.9529352226720648, 0.9483159117305459, 0.9230599470347485, 0.9050260466911055, 0.8659760748959778, 0.8362793393219357, 0.8005516265912305],
            f1_score: [0.9136025886864814, 0.9319174736651235, 0.9427596101518825, 0.9483159117305459, 0.9376495192033254, 0.9267050307047866, 0.9040199005928958, 0.8823140495867768, 0.8573476033786763],
            auc_roc: 0.9917408697896503,
            auc_pr: 0.9992581472263046
          }
        }
      ];
      setModels(sampleModels);
      setSelectedModel("k2_lightgbm");
    })
    .finally(() => {
      setLoading(false);
    });
  }

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

  console.log(models);
  
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
          <ModeToggle />
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
            onClick={() => navigate('/compete')}
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
                {models.map((model) => (
                  <option key={model.id} value={model.name}>{model.name}</option>
                ))}
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
      {/* <motion.div
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
      </motion.div> */}
    </div>
  );
}