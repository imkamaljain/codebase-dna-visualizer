import { motion } from 'framer-motion';

function FileDetails({ file, onClose }) {
  if (!file) {
    return (
      <div className="glass rounded-2xl p-6 h-64 flex items-center justify-center">
        <div className="text-center text-slate-500">
          <div className="text-4xl mb-2">🧬</div>
          <div className="text-sm font-semibold text-white">Select a File</div>
          <div className="text-xs mt-2 max-w-xs mx-auto">
            Click on any node in the DNA helix to view file details and metrics
          </div>
        </div>
      </div>
    );
  }

  const fileHealth = calculateFileHealth(file);
  const healthColor = getHealthColor(fileHealth);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate font-mono text-sm">
            {file.file}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span 
              className="w-4 h-4 rounded-full inline-block"
              style={{ backgroundColor: file.color || getNucleotideColor(file.nucleotide) }}
            />
            <span className="text-slate-400 text-xs">
              Nucleotide: {file.nucleotide}
            </span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* File Health */}
      <div className="mb-4 p-3 bg-white/5 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-xs">File Health</span>
          <span className="text-white font-semibold" style={{ color: healthColor }}>
            {fileHealth}/100
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fileHealth}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full"
            style={{ backgroundColor: healthColor }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <MetricItem label="Entropy" value={file.entropy} threshold={4.5} higherIsBetter={false} />
        <MetricItem label="Complexity" value={file.complexity} threshold={12} higherIsBetter={false} />
        <MetricItem label="Duplication" value={`${file.duplication}%`} threshold={15} higherIsBetter={false} />
        <MetricItem label="Lines" value={file.lines} threshold={300} higherIsBetter={false} />
      </div>

      {/* Size */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">File Size</span>
          <span className="text-white">{formatBytes(file.size)}</span>
        </div>
      </div>
    </motion.div>
  );
}

function MetricItem({ label, value, threshold, higherIsBetter }) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const isGood = higherIsBetter ? numValue >= threshold : numValue <= threshold;
  const color = isGood ? '#00ff88' : numValue > threshold * 1.5 ? '#ff6b6b' : '#ffd43b';

  return (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="text-slate-400 text-xs mb-1">{label}</div>
      <div className="text-lg font-semibold" style={{ color }}>
        {typeof value === 'number' && label !== 'Entropy' ? Math.round(value) : value}
      </div>
    </div>
  );
}

function calculateFileHealth(file) {
  let score = 100;

  if (file.entropy > 4.5) {
    score -= (file.entropy - 4.5) * 15;
  }

  if (file.duplication > 15) {
    score -= (file.duplication - 15) * 0.8;
  }

  if (file.complexity > 12) {
    score -= (file.complexity - 12) * 1.5;
  }

  if (file.lines > 300) {
    score -= Math.min(20, (file.lines - 300) * 0.05);
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

function getHealthColor(score) {
  if (score >= 80) return '#00ff88';
  if (score >= 60) return '#ffd43b';
  if (score >= 40) return '#ff922b';
  return '#ff6b6b';
}

function getNucleotideColor(nucleotide) {
  const colors = {
    'A': '#00ff88',
    'T': '#ff6b6b',
    'G': '#4dabf7',
    'C': '#ffd43b'
  };
  return colors[nucleotide] || '#ffffff';
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default FileDetails;
