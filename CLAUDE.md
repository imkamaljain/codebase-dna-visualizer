# Codebase DNA Visualizer - AI Reference Guide

## 📋 Project Overview

**Codebase DNA Visualizer** is a full-stack application that analyzes code repositories and generates 3D DNA helix visualizations based on entropy analysis, duplication detection, and complexity metrics.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + Vite + TailwindCSS + Three.js (React Three Fiber)
- **Backend**: Node.js 18+ + Express + simple-git
- **Monorepo**: npm workspaces

### Project Structure
```
codebase-dna/
├── backend/                    # Express API server
│   ├── index.js               # Main server + API routes
│   └── src/
│       ├── analyzer.js        # Core analysis orchestrator + git clone
│       ├── entropy.js         # Shannon entropy calculation
│       ├── complexity.js      # Cyclomatic complexity metrics
│       ├── duplication.js     # Code duplication detection
│       ├── dna-mapping.js     # File type → nucleotide mapping
│       └── commit-history.js  # Git history analysis
├── frontend/                   # React + Three.js app
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   ├── index.css          # Global styles + Tailwind
│   │   └── components/
│   │       ├── DNAHelix.jsx   # 3D DNA visualization
│   │       ├── HealthDashboard.jsx
│   │       ├── FileDetails.jsx
│   │       ├── SuggestionsPanel.jsx
│   │       └── TimelineSlider.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── package.json               # Root workspace config
└── README.md
```

## 🎨 Code Conventions

### General Rules
- **ES Modules**: Use `import/export` (not CommonJS)
- **File extensions**: `.jsx` for React components, `.js` for utilities
- **Naming**: 
  - Components: PascalCase (`DNAHelix`)
  - Utilities: camelCase (`calculateEntropy`)
  - Files: kebab-case (`dna-mapping.js`)
- **Paths**: Always use absolute paths with `path.join()` and `__dirname`

### Frontend Conventions
```jsx
// Component structure
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

function ComponentName({ prop1, prop2 }) {
  // 1. Hooks first
  const [state, setState] = useState(initialValue);
  
  // 2. Memoized values
  const computed = useMemo(() => {}, []);
  
  // 3. Event handlers
  const handleClick = () => {};
  
  // 4. Render
  return (
    <div className="glass rounded-2xl p-6">
      {/* Content */}
    </div>
  );
}

export default ComponentName;
```

### Backend Conventions
```javascript
// ES Module imports
import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';

// JSDoc for complex functions
/**
 * Calculate Shannon Entropy
 * @param {string} content - File content
 * @returns {number} Entropy value
 */
export function calculateEntropy(content) {
  // Implementation
}

// Async error handling
export async function analyzeCodebase(path) {
  try {
    // Implementation
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}
```

### Styling (TailwindCSS)
```jsx
// Use glass morphism pattern for cards
<div className="glass rounded-2xl p-6">
  {/* glass = bg-white/5 + backdrop-blur + border */}
</div>

// Gradients for primary actions
<button className="bg-gradient-to-r from-purple-500 to-pink-500" />

// Text colors
<h3 className="text-lg font-semibold text-white" />
<p className="text-slate-400 text-sm" />
```

### Three.js / React Three Fiber
```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function DNAHelix({ dnaSequence }) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 25]} />
      <OrbitControls enableRotate enableZoom />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} />
      
      {dnaSequence.map((file, i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </Canvas>
  );
}
```

## 🔧 Key Patterns

### DNA Mapping
```javascript
// File type → Nucleotide mapping
const TYPE_MAP = {
  '.js': 'A', '.jsx': 'A',      // Green (#00ff88)
  '.ts': 'T', '.tsx': 'T',      // Red (#ff6b6b)
  '.go': 'G', '.c': 'G',        // Blue (#4dabf7)
  '.py': 'C', '.yaml': 'C'      // Yellow (#ffd43b)
};
```

### Health Score Calculation
```javascript
// 100 - weighted penalties
const healthScore = 100 
  - entropyPenalty      // (avgEntropy - 4.0) * 10
  - complexityPenalty   // avgComplexity * 1.5
  - duplicationPenalty; // avgDuplication * 1.2
```

### API Response Format
```javascript
{
  repo: "project-name",
  analyzedFiles: 42,
  dnaSequence: [
    {
      file: "src/index.js",
      nucleotide: "A",
      entropy: 4.2,
      complexity: 12,
      duplication: 15.3,
      size: 1024,
      lines: 50
    }
  ],
  metrics: {
    avgEntropy: 4.2,
    avgComplexity: 8.5,
    avgDuplication: 12.3
  },
  healthScore: 78,
  suggestions: [...]
}
```

### Timeline Data Structure
```javascript
{
  timeline: [
    {
      commit: {
        hash: "abc1234",
        fullHash: "abc1234...",
        date: Date,
        message: "Fix bug",
        authorName: "John",
        authorEmail: "john@example.com"
      },
      analysis: {
        healthScore: 78,
        analyzedFiles: 42,
        metrics: {...},
        dnaSequence: [...]
      }
    }
  ]
}
```

## 🚨 Common Pitfalls

### ❌ Don't Do This
```javascript
// Wrong: CommonJS in ES module context
const fs = require('fs');

// Wrong: Relative paths without __dirname
const path = './temp';

// Wrong: Mutating state directly
state.value = newValue;

// Wrong: Missing error handling in async
app.post('/api/analyze', async (req, res) => {
  const result = await analyze(); // No try-catch!
  res.json(result);
});
```

### ✅ Do This Instead
```javascript
// Correct: ES modules
import fs from 'fs';

// Correct: Absolute paths
const path = path.join(__dirname, 'temp');

// Correct: Immutable state updates
setState({ ...state, value: newValue });

// Correct: Error handling
app.post('/api/analyze', async (req, res) => {
  try {
    const result = await analyze();
    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

## 📦 Dependencies

### Backend
- `express` - HTTP server
- `cors` - CORS middleware
- `multer` - File uploads
- `simple-git` - Git operations

### Frontend
- `react`, `react-dom` - UI framework
- `@react-three/fiber` - Three.js React renderer
- `@react-three/drei` - Three.js helpers
- `three` - 3D graphics
- `framer-motion` - Animations
- `axios` - HTTP client
- `tailwindcss` - Styling

## 🔌 API Endpoints

### `POST /api/analyze-github`
Analyze GitHub repository (single commit)
```json
{ "url": "https://github.com/user/repo" }
```

### `POST /api/analyze-timeline`
Analyze commit history
```json
{ "url": "https://github.com/user/repo", "commits": 8 }
```

### `POST /api/analyze-directory`
Analyze local directory
```json
{ "directory": "/path/to/project" }
```

### `GET /api/health`
Health check

## 🎯 Component Props Reference

### DNAHelix
```jsx
<DNAHelix 
  dnaSequence={array}      // Required: File analysis data
  onFileSelect={function}  // Required: Click handler
  timelineKey={number}     // Optional: Triggers re-animation
/>
```

### TimelineSlider
```jsx
<TimelineSlider
  timeline={array}         // Required: Commit history
  currentIndex={number}    // Required: Selected commit index
  onChange={function}      // Required: Index change handler
  isLoading={boolean}      // Optional: Loading state
/>
```

### HealthDashboard
```jsx
<HealthDashboard
  analysis={object}        // Required: Analysis result
/>
```

### FileDetails
```jsx
<FileDetails
  file={object}           // Required: Selected file data
  onClose={function}      // Optional: Close handler
/>
```

## 🧪 Testing Guidelines

When adding new features:
1. Add console logging for debugging during development
2. Test with small repos first (< 50 files)
3. Verify error handling for edge cases:
   - Empty repositories
   - Binary files
   - Very large files (> 1MB)
   - Invalid GitHub URLs

## 📝 Git Workflow

When generating code:
1. Keep changes focused and atomic
2. Update README.md if adding features
3. Follow existing file organization
4. Match existing code style exactly

## 🎨 Color Palette

```javascript
// Nucleotide colors (file types)
{
  'A': '#00ff88',  // Green - JS/JSX/HTML/MD
  'T': '#ff6b6b',  // Red - TS/TSX/CSS/SQL
  'G': '#4dabf7',  // Blue - Go/C/C++/JSON
  'C': '#ffd43b'   // Yellow - Python/YAML/XML
}

// Health score colors
{
  excellent: '#00ff88',  // 80-100
  good: '#ffd43b',       // 60-79
  warning: '#ff922b',    // 40-59
  critical: '#ff6b6b'    // 0-39
}

// UI gradients
primary: 'from-purple-500 to-pink-500'
secondary: 'from-cyan-500 to-blue-500'
success: 'from-emerald-500 to-teal-500'
```

## 💡 Quick Commands

```bash
# Install all dependencies
npm install

# Development (both frontend + backend)
npm run dev

# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend

# Build for production
npm run build
```

---

**Remember**: Always reference this file when generating code for the Codebase DNA Visualizer to maintain consistency with existing patterns and conventions.
