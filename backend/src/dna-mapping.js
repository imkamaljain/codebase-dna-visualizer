/**
 * DNA Mapping: File types to nucleotides
 */
const TYPE_MAP = {
  '.js': 'A',
  '.jsx': 'A',
  '.ts': 'T',
  '.tsx': 'T',
  '.go': 'G',
  '.py': 'C',
  '.rb': 'A',
  '.java': 'T',
  '.c': 'G',
  '.cpp': 'G',
  '.h': 'G',
  '.cs': 'C',
  '.php': 'A',
  '.rs': 'T',
  '.swift': 'G',
  '.kt': 'C',
  '.scala': 'C',
  '.html': 'A',
  '.css': 'T',
  '.scss': 'T',
  '.less': 'T',
  '.json': 'G',
  '.yaml': 'C',
  '.yml': 'C',
  '.toml': 'G',
  '.xml': 'C',
  '.md': 'A',
  '.sql': 'T',
  '.sh': 'G',
  '.bash': 'G'
};

/**
 * Map file extension to nucleotide base
 */
export function getNucleotide(extension) {
  const ext = extension.toLowerCase();
  if (TYPE_MAP[ext]) {
    return TYPE_MAP[ext];
  }
  
  // Hash unknown types to A, T, G, or C
  let hash = 0;
  for (let i = 0; i < ext.length; i++) {
    hash = ((hash << 5) - hash) + ext.charCodeAt(i);
    hash |= 0;
  }
  
  const nucleotides = ['A', 'T', 'G', 'C'];
  return nucleotides[Math.abs(hash) % 4];
}

/**
 * Get color for nucleotide
 */
export function getNucleotideColor(nucleotide) {
  const colors = {
    'A': '#00ff88', // Green
    'T': '#ff6b6b', // Red
    'G': '#4dabf7', // Blue
    'C': '#ffd43b'  // Yellow
  };
  return colors[nucleotide] || '#ffffff';
}

/**
 * Get color based on entropy level
 */
export function getEntropyColor(entropy) {
  if (entropy < 3.5) {
    return '#00ff88'; // Low entropy - green
  } else if (entropy < 4.5) {
    return '#ffd43b'; // Medium entropy - yellow
  } else if (entropy < 5.5) {
    return '#ff922b'; // High entropy - orange
  } else {
    return '#ff6b6b'; // Very high entropy - red
  }
}

/**
 * Generate refactor suggestions based on metrics
 */
export function getRefactorSuggestions(fileInfo) {
  const suggestions = [];

  // High entropy + large file
  if (fileInfo.entropy > 4.5 && fileInfo.size > 10000) {
    suggestions.push({
      type: 'high_entropy',
      priority: 'high',
      message: `File ${fileInfo.file} shows high entropy (${fileInfo.entropy}). Consider splitting into smaller, focused modules.`,
      action: 'Split into modules'
    });
  }

  // High duplication
  if (fileInfo.duplication > 25) {
    suggestions.push({
      type: 'duplication',
      priority: 'high',
      message: `File ${fileInfo.file} has ${fileInfo.duplication}% duplicated code. Extract shared utilities or use DRY patterns.`,
      action: 'Extract shared utilities'
    });
  } else if (fileInfo.duplication > 15) {
    suggestions.push({
      type: 'duplication',
      priority: 'medium',
      message: `Moderate duplication detected (${fileInfo.duplication}%). Review for potential abstraction opportunities.`,
      action: 'Review for abstraction'
    });
  }

  // High complexity
  if (fileInfo.complexity > 20) {
    suggestions.push({
      type: 'complexity',
      priority: 'high',
      message: `File ${fileInfo.file} has high cyclomatic complexity (${fileInfo.complexity}/100). Consider reducing nesting or using strategy pattern.`,
      action: 'Reduce complexity'
    });
  } else if (fileInfo.complexity > 12) {
    suggestions.push({
      type: 'complexity',
      priority: 'medium',
      message: `Moderate complexity (${fileInfo.complexity}/100). Consider simplifying control flow.`,
      action: 'Simplify control flow'
    });
  }

  // Large file
  if (fileInfo.lines > 500) {
    suggestions.push({
      type: 'file_size',
      priority: 'medium',
      message: `File ${fileInfo.file} is ${fileInfo.lines} lines. Consider breaking into smaller units.`,
      action: 'Break into smaller files'
    });
  }

  return suggestions;
}

/**
 * Calculate overall file health
 */
export function calculateFileHealth(fileInfo) {
  let score = 100;

  // Entropy penalty
  if (fileInfo.entropy > 4.5) {
    score -= (fileInfo.entropy - 4.5) * 15;
  }

  // Duplication penalty
  if (fileInfo.duplication > 15) {
    score -= (fileInfo.duplication - 15) * 0.8;
  }

  // Complexity penalty
  if (fileInfo.complexity > 12) {
    score -= (fileInfo.complexity - 12) * 1.5;
  }

  // Size penalty
  if (fileInfo.lines > 300) {
    score -= Math.min(20, (fileInfo.lines - 300) * 0.05);
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}
