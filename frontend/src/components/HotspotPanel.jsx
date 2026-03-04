import { motion } from 'framer-motion';
import { useState } from 'react';

function HotspotPanel({ file, onClose }) {
  const [expandedHotspot, setExpandedHotspot] = useState(null);

  // No file selected
  if (!file) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="text-center text-slate-500 py-8">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-sm font-semibold text-white">Hotspot Analysis</div>
          <div className="text-xs mt-2 max-w-xs mx-auto">
            Click on any node in the DNA helix to view file hotspots and refactoring suggestions
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/60 border border-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-orange-500/60 border border-orange-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/60 border border-yellow-500"></span>
          </div>
          <div className="text-xs mt-3 text-slate-600">
            Red = High • Orange = Medium • Yellow = Low
          </div>
        </div>
      </div>
    );
  }

  // File selected but no hotspots
  if (!file.hotspots || file.hotspots.length === 0) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="text-center text-slate-500 py-8">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-sm font-semibold text-white">No Hotspots Detected</div>
          <div className="text-xs mt-1">{file.file}</div>
          <div className="text-xs mt-2">This file looks clean!</div>
        </div>
      </div>
    );
  }

  const severityCount = {
    high: file.hotspots.filter(h => h.severity === 'high').length,
    medium: file.hotspots.filter(h => h.severity === 'medium').length,
    low: file.hotspots.filter(h => h.severity === 'low').length
  };

  return (
    <div className="glass rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            Hotspots Detected
          </h3>
          <p className="text-sm text-slate-400 mt-1 font-mono">{file.file}</p>
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

      {/* Severity Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <SeverityBadge severity="high" count={severityCount.high} />
        <SeverityBadge severity="medium" count={severityCount.medium} />
        <SeverityBadge severity="low" count={severityCount.low} />
      </div>

      {/* Hotspot Score */}
      <div className="mb-4 p-3 bg-white/5 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-xs">Problem Score</span>
          <span className={`text-white font-semibold ${getScoreColor(file.hotspotScore)}`}>
            {file.hotspotScore}/100
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${file.hotspotScore}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full"
            style={{ backgroundColor: getScoreColor(file.hotspotScore) }}
          />
        </div>
      </div>

      {/* Hotspots List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {file.hotspots.map((hotspot, index) => (
          <HotspotItem
            key={index}
            hotspot={hotspot}
            isExpanded={expandedHotspot === index}
            onToggle={() => setExpandedHotspot(expandedHotspot === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
}

function SeverityBadge({ severity, count }) {
  const colors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    low: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  };

  return (
    <div className={`text-center p-2 rounded-lg border ${colors[severity]}`}>
      <div className="text-lg font-bold">{count}</div>
      <div className="text-xs capitalize">{severity}</div>
    </div>
  );
}

function HotspotItem({ hotspot, isExpanded, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div
        onClick={onToggle}
        className="p-3 cursor-pointer hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${getSeverityColor(hotspot.severity)}`} />
            <span className="text-white text-sm font-medium">{hotspot.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Lines {hotspot.startLine}-{hotspot.endLine}
            </span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          className="border-t border-white/10"
        >
          <div className="p-3 space-y-3">
            {/* Message */}
            <p className="text-slate-300 text-sm">{hotspot.message}</p>

            {/* Suggestion */}
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <span>💡</span>
              <span>{hotspot.suggestion}</span>
            </div>

            {/* Code Snippet */}
            {hotspot.code && (
              <div className="bg-slate-900/50 rounded-lg p-3 overflow-x-auto">
                <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap break-words">
                  {hotspot.code.slice(0, 500)}
                </pre>
              </div>
            )}

            {/* Refactor Pattern */}
            <RefactorPattern type={hotspot.type} />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function RefactorPattern({ type }) {
  const patterns = {
    deep_nesting: {
      title: 'Refactor Pattern: Extract Method',
      description: 'Move nested code into a separate function with a descriptive name.',
      example: `// Before
if (condition) {
  if (nested) {
    // deep code
  }
}

// After
function handleNestedLogic() {
  // extracted code
}

if (condition) {
  handleNestedLogic();
}`
    },
    long_function: {
      title: 'Refactor Pattern: Split Function',
      description: 'Break the function into smaller, focused functions.',
      example: `// Before
function processData() {
  // 50+ lines of code
}

// After
function processData() {
  validate();
  transform();
  save();
}`
    },
    complex_logic: {
      title: 'Refactor Pattern: Simplify Condition',
      description: 'Extract complex conditions into well-named boolean functions.',
      example: `// Before
if (user.age > 18 && user.verified && !user.banned) { }

// After
function canAccess() {
  return isAdult() && isVerified() && !isBanned();
}

if (canAccess()) { }`
    },
    magic_number: {
      title: 'Refactor Pattern: Introduce Constant',
      description: 'Replace magic numbers with named constants.',
      example: `// Before
if (days > 30) { }

// After
const RETENTION_PERIOD_DAYS = 30;

if (days > RETENTION_PERIOD_DAYS) { }`
    },
    todo_comment: {
      title: 'Action: Address Technical Debt',
      description: 'Create a ticket for this TODO and address it in a future sprint.',
      example: `// Create GitHub issue linking to this code location
// Add to technical debt backlog`
    }
  };

  const pattern = patterns[type] || {
    title: 'Refactor Needed',
    description: 'Review this code section and apply appropriate refactoring.',
    example: '// Review and refactor'
  };

  return (
    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
      <div className="text-purple-400 text-xs font-semibold mb-1">
        {pattern.title}
      </div>
      <div className="text-slate-400 text-xs mb-2">
        {pattern.description}
      </div>
      <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap bg-slate-900/50 p-2 rounded">
        {pattern.example}
      </pre>
    </div>
  );
}

function getSeverityColor(severity) {
  switch (severity) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-orange-500';
    case 'low': return 'bg-yellow-500';
    default: return 'bg-slate-500';
  }
}

function getScoreColor(score) {
  if (score >= 60) return '#ff6b6b';
  if (score >= 30) return '#ff922b';
  return '#ffd43b';
}

export default HotspotPanel;
