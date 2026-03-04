# Qwen Code Rules - Codebase DNA Visualizer

## ⚡ Quick Reference

### Project Type
Full-stack React + Node.js monorepo for codebase analysis and 3D visualization

### Key Files
- `backend/index.js` - API server
- `backend/src/analyzer.js` - Core analysis logic
- `frontend/src/App.jsx` - Main React app
- `frontend/src/components/DNAHelix.jsx` - 3D visualization

### Code Style
- **Modules**: ES modules only (`import`/`export`)
- **Components**: Function components with hooks
- **Styling**: TailwindCSS with glass morphism
- **3D**: React Three Fiber for Three.js

## 🎯 Generation Rules

### 1. File Structure
```
✅ backend/src/new-feature.js
✅ frontend/src/components/NewComponent.jsx
❌ backend/new-feature.js (wrong level)
❌ frontend/src/newComponent.jsx (wrong casing)
```

### 2. Import Patterns
```javascript
// Backend
import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';

// Frontend
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
```

### 3. Component Template
```jsx
import { motion } from 'framer-motion';

function ComponentName({ prop1, onAction }) {
  const [state, setState] = useState(initial);
  
  return (
    <div className="glass rounded-2xl p-6">
      {/* Use Tailwind classes, not inline styles */}
    </div>
  );
}

export default ComponentName;
```

### 4. API Endpoint Template
```javascript
app.post('/api/endpoint', async (req, res) => {
  try {
    const { param } = req.body;
    const result = await someFunction(param);
    res.json({ result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### 5. Three.js Component
```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Visualization({ data }) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 25]} />
      <OrbitControls enableRotate enableZoom />
      <ambientLight intensity={0.4} />
      
      {data.map((item, i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </Canvas>
  );
}
```

## 🎨 Styling Rules

### Glass Morphism (Always use for cards)
```jsx
className="glass rounded-2xl p-6"
// Where glass = bg-white/5 + backdrop-blur + border-white/10
```

### Gradients
```jsx
// Primary action
className="bg-gradient-to-r from-purple-500 to-pink-500"

// Secondary action
className="bg-gradient-to-r from-cyan-500 to-blue-500"

// Success action
className="bg-gradient-to-r from-emerald-500 to-teal-500"
```

### Text
```jsx
// Headings
className="text-lg font-semibold text-white"

// Body
className="text-slate-400 text-sm"

// Mono (for code/paths)
className="font-mono text-white"
```

## 🚫 Never Do This

```javascript
// ❌ CommonJS
const fs = require('fs');

// ❌ Inline styles
<div style={{ backgroundColor: 'red' }} />

// ❌ Class components
class MyComponent extends React.Component {}

// ❌ Missing error handling
app.post('/api/x', async (req, res) => {
  const result = await doSomething();
  res.json(result);
});

// ❌ Relative paths in backend
const path = './temp';
```

## ✅ Always Do This

```javascript
// ✅ ES modules
import fs from 'fs';

// ✅ Tailwind classes
<div className="bg-red-500" />

// ✅ Function components
function MyComponent() {}

// ✅ Try-catch in async routes
app.post('/api/x', async (req, res) => {
  try {
    const result = await doSomething();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Absolute paths
const path = path.join(__dirname, 'temp');
```

## 📦 Available Dependencies

### Backend
- `express`, `cors`, `multer`, `simple-git`

### Frontend  
- `react`, `react-dom`
- `@react-three/fiber`, `@react-three/drei`, `three`
- `framer-motion`
- `axios`
- `tailwindcss`, `autoprefixer`, `postcss`

## 🔌 API Routes

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/analyze-github` | Analyze GitHub repo |
| POST | `/api/analyze-timeline` | Analyze commit history |
| POST | `/api/analyze-directory` | Analyze local directory |
| GET | `/api/health` | Health check |

## 🧬 DNA Mapping

| Extension | Nucleotide | Color |
|-----------|------------|-------|
| .js, .jsx | A | #00ff88 (Green) |
| .ts, .tsx | T | #ff6b6b (Red) |
| .go, .c, .cpp | G | #4dabf7 (Blue) |
| .py, .yaml | C | #ffd43b (Yellow) |

## 📊 Health Score

```javascript
score >= 80  // Excellent (green)
score >= 60  // Good (yellow)
score >= 40  // Needs Work (orange)
score < 40   // Critical (red)
```

## 🧪 Before Committing

- [ ] Check console for errors
- [ ] Verify Tailwind classes are valid
- [ ] Ensure all imports are ES modules
- [ ] Add error handling to async code
- [ ] Match existing code style

---

**Reference**: See `CLAUDE.md` for detailed documentation
