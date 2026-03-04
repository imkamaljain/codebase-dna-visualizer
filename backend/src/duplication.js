/**
 * Detect code duplication using sliding window hashing
 * Returns duplication percentage
 */
export function detectDuplication(content, minChunkSize = 20) {
  if (!content || content.length === 0) {
    return 0;
  }

  // Normalize content: remove whitespace variations
  const normalized = content
    .replace(/\s+/g, ' ')
    .trim();

  if (normalized.length < minChunkSize * 2) {
    return 0;
  }

  const chunkSize = minChunkSize;
  const chunks = new Map();
  let duplicateChars = 0;
  let totalChars = 0;

  // Sliding window with step of 10 chars
  const step = 10;
  for (let i = 0; i <= normalized.length - chunkSize; i += step) {
    const chunk = normalized.slice(i, i + chunkSize);
    totalChars += chunkSize;
    
    if (chunks.has(chunk)) {
      // This chunk appeared before - count as duplication
      duplicateChars += chunkSize;
      chunks.set(chunk, chunks.get(chunk) + 1);
    } else {
      chunks.set(chunk, 1);
    }
  }

  // Calculate duplication percentage
  if (totalChars === 0) {
    return 0;
  }

  const duplicationRatio = duplicateChars / totalChars;
  return Math.min(100, duplicationRatio * 100);
}

/**
 * Find specific duplicated sections
 * Returns array of duplicated code blocks
 */
export function findDuplicateSections(content, minChunkSize = 30, minOccurrences = 2) {
  const normalized = content
    .replace(/\s+/g, ' ')
    .trim();

  const chunkSize = minChunkSize;
  const chunks = new Map();

  const step = 5;
  for (let i = 0; i <= normalized.length - chunkSize; i += step) {
    const chunk = normalized.slice(i, i + chunkSize);
    
    if (chunks.has(chunk)) {
      chunks.set(chunk, {
        ...chunks.get(chunk),
        count: chunks.get(chunk).count + 1,
        positions: [...chunks.get(chunk).positions, i]
      });
    } else {
      chunks.set(chunk, {
        count: 1,
        positions: [i]
      });
    }
  }

  // Filter for duplicates
  const duplicates = [];
  for (const [chunk, data] of chunks.entries()) {
    if (data.count >= minOccurrences) {
      duplicates.push({
        code: chunk.slice(0, 100) + (chunk.length > 100 ? '...' : ''),
        occurrences: data.count,
        positions: data.positions
      });
    }
  }

  // Sort by occurrence count
  return duplicates.sort((a, b) => b.occurrences - a.occurrences);
}

/**
 * Calculate duplication between two files
 */
export function calculateCrossFileDuplication(content1, content2, chunkSize = 25) {
  const norm1 = content1.replace(/\s+/g, ' ').trim();
  const norm2 = content2.replace(/\s+/g, ' ').trim();

  const chunks1 = new Set();
  for (let i = 0; i <= norm1.length - chunkSize; i += 5) {
    chunks1.add(norm1.slice(i, i + chunkSize));
  }

  let matches = 0;
  let total = 0;
  
  for (let i = 0; i <= norm2.length - chunkSize; i += 5) {
    const chunk = norm2.slice(i, i + chunkSize);
    total++;
    if (chunks1.has(chunk)) {
      matches++;
    }
  }

  return total > 0 ? (matches / total) * 100 : 0;
}
