import { motion } from 'framer-motion';

function HealthDashboard({ analysis }) {
  const { healthScore, metrics, hotspots } = analysis;

  const getHealthColor = (score) => {
    if (score >= 80) return '#00ff88';
    if (score >= 60) return '#ffd43b';
    if (score >= 40) return '#ff922b';
    return '#ff6b6b';
  };

  const getHealthLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Work';
    return 'Critical';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Codebase Health</h2>
          <p className="text-slate-400 text-sm">
            {analysis.analyzedFiles} files analyzed
          </p>
        </div>
        <div className="text-right">
          <div
            className="text-4xl font-bold"
            style={{ color: getHealthColor(healthScore) }}
          >
            {healthScore}
          </div>
          <div className="text-sm text-slate-400">
            {getHealthLabel(healthScore)}
          </div>
        </div>
      </div>

      {/* Health Score Bar */}
      <div className="mb-6">
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${healthScore}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-full rounded-full"
            style={{ 
              background: `linear-gradient(90deg, ${getHealthColor(healthScore)}, ${getHealthColor(healthScore)}88)` 
            }}
          />
        </div>
      </div>

      {/* Hotspot Summary */}
      {hotspots && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🔥</span>
            <span className="text-white text-sm font-semibold">Hotspots Detected</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-red-400 font-bold">{hotspots.highSeverity}</div>
              <div className="text-slate-500 text-xs">High</div>
            </div>
            <div>
              <div className="text-orange-400 font-bold">{hotspots.total - hotspots.highSeverity}</div>
              <div className="text-slate-500 text-xs">Medium/Low</div>
            </div>
            <div>
              <div className="text-white font-bold">{hotspots.topFiles?.length || 0}</div>
              <div className="text-slate-500 text-xs">Files</div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          label="Avg Entropy"
          value={metrics.avgEntropy}
          description="Code randomness"
          goodThreshold={4.5}
          higherIsBetter={false}
        />
        <MetricCard
          label="Avg Complexity"
          value={metrics.avgComplexity}
          description="Per 100 lines"
          goodThreshold={10}
          higherIsBetter={false}
        />
        <MetricCard
          label="Avg Duplication"
          value={metrics.avgDuplication}
          description="Duplicate code %"
          goodThreshold={15}
          higherIsBetter={false}
        />
      </div>
    </motion.div>
  );
}

function MetricCard({ label, value, description, goodThreshold, higherIsBetter }) {
  const isGood = higherIsBetter ? value >= goodThreshold : value <= goodThreshold;
  const color = isGood ? '#00ff88' : value > goodThreshold * 1.5 ? '#ff6b6b' : '#ffd43b';

  return (
    <div className="bg-white/5 rounded-xl p-4 text-center">
      <div className="text-slate-400 text-xs mb-1">{label}</div>
      <div className="text-2xl font-bold text-white" style={{ color }}>
        {value}
      </div>
      <div className="text-slate-500 text-xs mt-1">{description}</div>
    </div>
  );
}

export default HealthDashboard;
