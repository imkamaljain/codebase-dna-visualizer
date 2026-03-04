/**
 * Calculate cyclomatic complexity approximation
 * Counts control flow statements per 100 lines
 */
export function calculateComplexity(content) {
  if (!content || content.length === 0) {
    return 0;
  }

  const lines = content.split('\n');
  const lineCount = lines.length;
  
  // Complexity indicators
  const complexityPatterns = [
    /\bif\b/g,
    /\belse\s+if\b/g,
    /\bfor\b/g,
    /\bwhile\b/g,
    /\bswitch\b/g,
    /\bcase\b/g,
    /\bcatch\b/g,
    /\b\?\s*[^:]*:/g,  // ternary operator
    /&&/g,
    /\|\|/g,
    /\btry\b/g,
    /\bawait\b/g,
    /\basync\b/g
  ];

  let complexityScore = 0;

  for (const pattern of complexityPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      complexityScore += matches.length;
    }
  }

  // Normalize per 100 lines
  const normalizedComplexity = Math.round((complexityScore / Math.max(1, lineCount)) * 100);
  
  return normalizedComplexity;
}

/**
 * Get complexity breakdown by function
 * Simple heuristic: look for function declarations and count complexity within
 */
export function getFunctionComplexity(content) {
  const functions = [];
  
  // Match function declarations (simplified)
  const functionPattern = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>)/g;
  let match;
  
  while ((match = functionPattern.exec(content)) !== null) {
    const funcName = match[1] || match[2] || 'anonymous';
    const startIndex = match.index;
    
    // Find function body (simplified: next 50 lines)
    const lines = content.slice(startIndex).split('\n').slice(0, 50);
    const funcBody = lines.join('\n');
    
    functions.push({
      name: funcName,
      complexity: calculateComplexity(funcBody),
      lines: lines.length
    });
  }
  
  return functions;
}

/**
 * Detect deep nesting
 * Returns max nesting depth
 */
export function detectNestingDepth(content) {
  let maxDepth = 0;
  let currentDepth = 0;
  
  for (const char of content) {
    if (char === '{') {
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
    } else if (char === '}') {
      currentDepth = Math.max(0, currentDepth - 1);
    }
  }
  
  return maxDepth;
}
