import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';
import { calculateEntropy } from './entropy.js';
import { calculateComplexity } from './complexity.js';
import { detectDuplication } from './duplication.js';
import { getNucleotide, getRefactorSuggestions } from './dna-mapping.js';

const MAX_FILES = 500;
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  'vendor',
  '.min.js',
  '.min.css',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml'
];

const TEXT_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.go', '.py', '.rb', '.java', '.c', '.cpp', '.h',
  '.cs', '.php', '.rs', '.swift', '.kt', '.scala', '.clj', '.erl', '.ex',
  '.html', '.css', '.scss', '.less', '.styl',
  '.json', '.yaml', '.yml', '.toml', '.xml', '.md', '.txt', '.sql', '.sh', '.bash'
];

/**
 * Clone a GitHub repository using simple-git
 */
export async function cloneGitHubRepo(cloneUrl, destPath) {
  const git = simpleGit();
  
  await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
  
  await git.clone(cloneUrl, destPath, ['--depth', '1']);
  
  console.log(`Cloned to ${destPath}`);
}

export async function analyzeCodebase(zipPath = null, directoryPath = null) {
  const files = [];
  
  if (zipPath) {
    // TODO: Implement ZIP extraction
    throw new Error('ZIP analysis not yet implemented. Use directory analysis for now.');
  }
  
  if (directoryPath) {
    await collectFiles(directoryPath, files);
  }

  // Limit files
  const limitedFiles = files.slice(0, MAX_FILES);
  
  // Analyze each file
  const dnaSequence = [];
  let totalEntropy = 0;
  let totalComplexity = 0;
  let totalDuplication = 0;
  
  for (const file of limitedFiles) {
    try {
      const content = fs.readFileSync(file.path, 'utf-8');
      const extension = path.extname(file.path).toLowerCase();
      
      // Skip binary or unknown extensions
      if (!TEXT_EXTENSIONS.includes(extension) && extension !== '') {
        continue;
      }
      
      const entropy = calculateEntropy(content);
      const complexity = calculateComplexity(content);
      const duplication = detectDuplication(content);
      const nucleotide = getNucleotide(extension);
      
      const fileInfo = {
        file: file.relativePath,
        nucleotide,
        entropy: Math.round(entropy * 100) / 100,
        complexity,
        duplication: Math.round(duplication * 100) / 100,
        size: content.length,
        lines: content.split('\n').length
      };
      
      dnaSequence.push(fileInfo);
      
      totalEntropy += entropy;
      totalComplexity += complexity;
      totalDuplication += duplication;
    } catch (error) {
      console.warn(`Skipping file ${file.path}: ${error.message}`);
    }
  }

  // Calculate health score
  const count = dnaSequence.length || 1;
  const avgEntropy = totalEntropy / count;
  const avgComplexity = totalComplexity / count;
  const avgDuplication = totalDuplication / count;
  
  // Health score: 100 - weighted penalties
  // Entropy penalty (normal range 3.5-4.5, penalize > 4.5)
  const entropyPenalty = Math.max(0, (avgEntropy - 4.0)) * 10;
  // Complexity penalty (normal < 10, penalize > 10)
  const complexityPenalty = Math.min(30, avgComplexity * 1.5);
  // Duplication penalty (normal < 15%, penalize > 15%)
  const duplicationPenalty = Math.min(30, avgDuplication * 1.2);
  
  const healthScore = Math.max(0, Math.min(100, Math.round(
    100 - entropyPenalty - complexityPenalty - duplicationPenalty
  )));

  // Generate suggestions for problematic files
  const suggestions = dnaSequence
    .filter(f => f.entropy > 4.5 || f.duplication > 20 || f.complexity > 15)
    .map(f => ({
      file: f.file,
      suggestions: getRefactorSuggestions(f)
    }))
    .filter(s => s.suggestions.length > 0);

  return {
    repo: path.basename(directoryPath || 'unknown'),
    analyzedFiles: dnaSequence.length,
    totalFiles: files.length,
    dnaSequence,
    metrics: {
      avgEntropy: Math.round(avgEntropy * 100) / 100,
      avgComplexity: Math.round(avgComplexity * 100) / 100,
      avgDuplication: Math.round(avgDuplication * 100) / 100
    },
    healthScore,
    suggestions
  };
}

async function collectFiles(dir, files, relativeBase = '') {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = relativeBase 
        ? path.posix.join(relativeBase, entry.name) 
        : entry.name;
      
      // Skip ignored patterns
      if (IGNORE_PATTERNS.some(pattern => fullPath.includes(pattern))) {
        continue;
      }
      
      if (entry.isDirectory()) {
        await collectFiles(fullPath, files, relativePath);
      } else if (entry.isFile()) {
        files.push({
          path: fullPath,
          relativePath: relativePath
        });
      }
    }
  } catch (error) {
    console.warn(`Error reading directory ${dir}: ${error.message}`);
  }
}
