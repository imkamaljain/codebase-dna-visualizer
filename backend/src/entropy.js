/**
 * Calculate Shannon Entropy of a string
 * H = -Σ p(x) * log2(p(x))
 * 
 * Higher entropy = more randomness/complexity
 * Lower entropy = more repetitive/predictable
 */
export function calculateEntropy(content) {
  if (!content || content.length === 0) {
    return 0;
  }

  // Count character frequencies
  const freq = new Map();
  for (const char of content) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  // Calculate entropy
  const length = content.length;
  let entropy = 0;

  for (const count of freq.values()) {
    const probability = count / length;
    entropy -= probability * Math.log2(probability);
  }

  return entropy;
}

/**
 * Calculate entropy for a specific section of code
 * Useful for detecting hotspots
 */
export function calculateSectionEntropy(content, startLine, endLine) {
  const lines = content.split('\n');
  const section = lines.slice(startLine - 1, endLine).join('\n');
  return calculateEntropy(section);
}

/**
 * Get entropy distribution across file
 * Returns array of entropy values per chunk
 */
export function getEntropyDistribution(content, chunkSize = 100) {
  const chunks = [];
  for (let i = 0; i < content.length; i += chunkSize) {
    const chunk = content.slice(i, i + chunkSize);
    chunks.push(calculateEntropy(chunk));
  }
  return chunks;
}
