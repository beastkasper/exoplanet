import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './ModelMetricsChart.module.css';

interface ModelMetrics {
  thresholds: number[];
  positive_count: number[];
  negative_count: number[];
  recall: number[];
  precision: number[];
  f1_score: number[];
  auc_roc: number;
  auc_pr: number;
}

interface Model {
  id: number;
  name: string;
  path: string;
  metrics: ModelMetrics;
}

interface ModelMetricsChartProps {
  models: Model[];
  selectedModel: string;
}

const ModelMetricsChart: React.FC<ModelMetricsChartProps> = ({ models, selectedModel }) => {
  const chartData = useMemo(() => {
    const model = models.find(m => m.name === selectedModel);
    if (!model) return [];

    return model.metrics.thresholds.map((threshold, index) => ({
      threshold: threshold,
      positive_count: model.metrics.positive_count[index],
      negative_count: model.metrics.negative_count[index],
      recall: model.metrics.recall[index],
      precision: model.metrics.precision[index],
      f1_score: model.metrics.f1_score[index]
    }));
  }, [models, selectedModel]);

  const selectedModelData = models.find(m => m.name === selectedModel);

  if (!selectedModelData) {
    return (
      <div className={styles.noData}>
        <p>Select a model to view metrics</p>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Model Metrics: {selectedModelData.name}</h3>
        <div className={styles.modelStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>AUC ROC:</span>
            <span className={styles.statValue}>{selectedModelData.metrics.auc_roc.toFixed(4)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>AUC PR:</span>
            <span className={styles.statValue}>{selectedModelData.metrics.auc_pr.toFixed(4)}</span>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        {/* Positive/Negative Count Chart */}
        <div className={styles.chartWrapper}>
          <h4 className={styles.chartSubtitle}>Positive vs Negative Count</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="threshold" 
                stroke="rgba(255, 255, 255, 0.7)"
                tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
              />
              <YAxis 
                stroke="rgba(255, 255, 255, 0.7)"
                tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="positive_count" 
                stroke="#2196F3" 
                strokeWidth={3}
                dot={{ fill: '#2196F3', strokeWidth: 2, r: 4 }}
                name="Positive Count"
              />
              <Line 
                type="monotone" 
                dataKey="negative_count" 
                stroke="#F44336" 
                strokeWidth={3}
                dot={{ fill: '#F44336', strokeWidth: 2, r: 4 }}
                name="Negative Count"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recall Chart */}
        <div className={styles.chartWrapper}>
          <h4 className={styles.chartSubtitle}>Recall</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="threshold" 
                stroke="rgba(255, 255, 255, 0.7)"
                tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
              />
              <YAxis 
                stroke="rgba(255, 255, 255, 0.7)"
                tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                domain={[0, 1]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="recall" 
                stroke="#4CAF50" 
                strokeWidth={3}
                dot={{ fill: '#4CAF50', strokeWidth: 2, r: 4 }}
                name="Recall"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Precision Chart */}
        <div className={styles.chartWrapper}>
          <h4 className={styles.chartSubtitle}>Precision</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="threshold" 
                stroke="rgba(255, 255, 255, 0.7)"
                tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
              />
              <YAxis 
                stroke="rgba(255, 255, 255, 0.7)"
                tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                domain={[0, 1]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="precision" 
                stroke="#FF9800" 
                strokeWidth={3}
                dot={{ fill: '#FF9800', strokeWidth: 2, r: 4 }}
                name="Precision"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* F1 Score Chart */}
        <div className={styles.chartWrapper}>
          <h4 className={styles.chartSubtitle}>F1 Score</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="threshold" 
                stroke="rgba(255, 255, 255, 0.7)"
                tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
              />
              <YAxis 
                stroke="rgba(255, 255, 255, 0.7)"
                tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                domain={[0, 1]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="f1_score" 
                stroke="#9C27B0" 
                strokeWidth={3}
                dot={{ fill: '#9C27B0', strokeWidth: 2, r: 4 }}
                name="F1 Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ModelMetricsChart;
