import { motion } from 'framer-motion';

function SuggestionsPanel({ suggestions }) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="text-center text-slate-500 py-8">
          <div className="text-4xl mb-2">✨</div>
          <div className="text-sm">No refactor suggestions</div>
          <div className="text-xs mt-1">Your codebase looks healthy!</div>
        </div>
      </div>
    );
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedSuggestions = [...suggestions].sort(
    (a, b) => priorityOrder[a.suggestions[0].priority] - priorityOrder[b.suggestions[0].priority]
  );

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">💡</span>
        <h3 className="text-lg font-semibold text-white">
          Refactor Suggestions
        </h3>
        <span className="ml-auto text-sm text-slate-400">
          {suggestions.reduce((acc, s) => acc + s.suggestions.length, 0)} issues
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedSuggestions.map((item, index) => (
          <SuggestionItem key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

function SuggestionItem({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/5 rounded-lg p-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-white bg-white/10 px-2 py-0.5 rounded">
              {item.file}
            </span>
            {item.suggestions.map((s, i) => (
              <PriorityBadge key={i} priority={s.priority} />
            ))}
          </div>
          {item.suggestions.map((suggestion, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-slate-300 text-sm">{suggestion.message}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-medium">
                  → {suggestion.action}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PriorityBadge({ priority }) {
  const colors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${colors[priority] || colors.low}`}>
      {priority}
    </span>
  );
}

export default SuggestionsPanel;
