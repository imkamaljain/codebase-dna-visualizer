import fs from 'fs';

/**
 * Detect hotspot lines in a file based on various metrics
 * Returns array of problematic line ranges with reasons
 */
export function detectHotspots(content, filePath) {
  const lines = content.split('\n');
  const hotspots = [];
  
  // Analyze each section of the file
  analyzeNestingDepth(lines, hotspots, filePath);
  analyzeFunctionLength(lines, hotspots, filePath);
  analyzeComplexityHotspots(lines, hotspots, filePath);
  analyzeMagicNumbers(lines, hotspots, filePath);
  analyzeLongLines(lines, hotspots, filePath);
  analyzeTodoComments(lines, hotspots, filePath);
  
  // Merge overlapping hotspots
  return mergeHotspots(hotspots);
}

/**
 * Detect deeply nested code
 */
function analyzeNestingDepth(lines, hotspots, filePath) {
  let currentDepth = 0;
  let depthStartLine = -1;
  const maxDepth = 4; // Threshold for warning
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    
    const prevDepth = currentDepth;
    currentDepth += openBraces - closeBraces;
    
    if (currentDepth > maxDepth && depthStartLine === -1) {
      depthStartLine = i;
    }
    
    if (currentDepth <= maxDepth && depthStartLine !== -1) {
      hotspots.push({
        startLine: depthStartLine + 1,
        endLine: i + 1,
        severity: currentDepth > maxDepth + 1 ? 'high' : 'medium',
        type: 'deep_nesting',
        message: `Deep nesting detected (depth: ${currentDepth}). Consider extracting inner logic into separate function.`,
        suggestion: 'Extract Method',
        code: lines.slice(depthStartLine, i + 1).join('\n')
      });
      depthStartLine = -1;
    }
  }
}

/**
 * Detect functions that are too long
 */
function analyzeFunctionLength(lines, hotspots, filePath) {
  const functionPattern = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>|(?:public|private|protected)?\s*(?:async\s+)?(\w+)\s*\([^)]*\)\s*{)/g;
  const maxFunctionLength = 30; // lines
  
  let match;
  const text = lines.join('\n');
  
  while ((match = functionPattern.exec(text)) !== null) {
    const funcName = match[1] || match[2] || match[3] || 'anonymous';
    const startIndex = match.index;
    
    // Find function start line
    let startLine = 0;
    let charCount = 0;
    for (let i = 0; i < lines.length; i++) {
      charCount += lines[i].length + 1;
      if (charCount > startIndex) {
        startLine = i;
        break;
      }
    }
    
    // Estimate function end (simplified - count braces)
    let braceCount = 0;
    let endLine = startLine;
    let started = false;
    
    for (let i = startLine; i < Math.min(startLine + 100, lines.length); i++) {
      const line = lines[i];
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;
      
      if (braceCount > 0) started = true;
      if (started && braceCount <= 0) {
        endLine = i;
        break;
      }
    }
    
    const funcLength = endLine - startLine;
    
    if (funcLength > maxFunctionLength) {
      hotspots.push({
        startLine: startLine + 1,
        endLine: endLine + 1,
        severity: funcLength > maxFunctionLength * 2 ? 'high' : 'medium',
        type: 'long_function',
        message: `Function '${funcName}' is ${funcLength} lines long. Consider breaking into smaller functions.`,
        suggestion: 'Extract Method',
        code: lines.slice(startLine, endLine + 1).join('\n').slice(0, 500)
      });
    }
  }
}

/**
 * Detect lines with high complexity (multiple conditions)
 */
function analyzeComplexityHotspots(lines, hotspots, filePath) {
  const complexityPatterns = [
    /if\s*\([^)]*(?:&&|\|\|)[^)]*(?:&&|\|\|)/,  // Multiple conditions in if
    /(?:&&|\|\|)\s*(?:&&|\|\|)/,  // Chained logical operators
    /\?\s*[^:]*:\s*[^,]*\?/,  // Chained ternaries
    /catch\s*\([^)]*\)\s*{[\s\S]*?throw/,  // Catch re-throwing
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (const pattern of complexityPatterns) {
      if (pattern.test(line)) {
        hotspots.push({
          startLine: i + 1,
          endLine: i + 1,
          severity: 'low',
          type: 'complex_logic',
          message: 'Complex logic detected. Consider simplifying or extracting.',
          suggestion: 'Simplify Condition',
          code: line.trim()
        });
        break;
      }
    }
  }
}

/**
 * Detect magic numbers
 */
function analyzeMagicNumbers(lines, hotspots, filePath) {
  const magicNumberPattern = /(?<![a-zA-Z_])(?:0x[0-9a-fA-F]+|\d{2,})(?![a-zA-Z_0-9])/g;
  const allowedNumbers = new Set(['10', '12', '24', '60', '100', '1000', '0x00', '0xff', '0xFF']);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip comments and string literals
    const codeOnly = line.replace(/\/\/.*|\/\*[\s\S]*?\*\/|"[^"]*"|'[^']*'/g, '');
    
    const matches = codeOnly.match(magicNumberPattern);
    if (matches) {
      for (const num of matches) {
        if (!allowedNumbers.has(num)) {
          hotspots.push({
            startLine: i + 1,
            endLine: i + 1,
            severity: 'low',
            type: 'magic_number',
            message: `Magic number '${num}' found. Consider using a named constant.`,
            suggestion: 'Introduce Constant',
            code: line.trim()
          });
          break; // One per line
        }
      }
    }
  }
}

/**
 * Detect very long lines
 */
function analyzeLongLines(lines, hotspots, filePath) {
  const maxLength = 120;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length > maxLength) {
      hotspots.push({
        startLine: i + 1,
        endLine: i + 1,
        severity: 'low',
        type: 'long_line',
        message: `Line is ${lines[i].length} characters. Consider breaking into multiple lines.`,
        suggestion: 'Break Line',
        code: lines[i].slice(0, 100) + (lines[i].length > 100 ? '...' : '')
      });
    }
  }
}

/**
 * Detect TODO, FIXME, HACK comments
 */
function analyzeTodoComments(lines, hotspots, filePath) {
  const todoPattern = /(TODO|FIXME|HACK|XXX|BUG):?\s*(.*)/i;
  
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(todoPattern);
    if (match) {
      const [, type, description] = match;
      hotspots.push({
        startLine: i + 1,
        endLine: i + 1,
        severity: type.toUpperCase() === 'FIXME' || type.toUpperCase() === 'BUG' ? 'high' : 'medium',
        type: 'todo_comment',
        message: `${type.toUpperCase()}: ${description.trim() || 'No description'}`,
        suggestion: 'Address Technical Debt',
        code: lines[i].trim()
      });
    }
  }
}

/**
 * Merge overlapping hotspots
 */
function mergeHotspots(hotspots) {
  // Sort by start line
  hotspots.sort((a, b) => a.startLine - b.startLine);
  
  const merged = [];
  let current = null;
  
  for (const hotspot of hotspots) {
    if (!current) {
      current = { ...hotspot };
    } else if (hotspot.startLine <= current.endLine + 2) {
      // Overlapping or adjacent - merge
      current.endLine = Math.max(current.endLine, hotspot.endLine);
      if (hotspot.severity === 'high') current.severity = 'high';
      current.message += ` + ${hotspot.type}`;
    } else {
      merged.push(current);
      current = { ...hotspot };
    }
  }
  
  if (current) {
    merged.push(current);
  }
  
  return merged;
}

/**
 * Calculate hotspot score for a file (0-100)
 * Higher score = more problems
 */
export function calculateHotspotScore(hotspots) {
  if (hotspots.length === 0) return 0;
  
  const severityWeights = {
    high: 20,
    medium: 10,
    low: 5
  };
  
  let score = 0;
  for (const hotspot of hotspots) {
    score += severityWeights[hotspot.severity] || 5;
  }
  
  return Math.min(100, score);
}

/**
 * Get hotspot color based on severity
 */
export function getHotspotColor(severity) {
  switch (severity) {
    case 'high':
      return '#ff0000';
    case 'medium':
      return '#ff922b';
    case 'low':
      return '#ffd43b';
    default:
      return '#ff6b6b';
  }
}
