# 🧬 Codebase DNA Visualizer

A powerful tool that analyzes your codebase and generates a 3D DNA helix visualization based on entropy analysis, duplication detection, and complexity metrics.

## Features

- **GitHub URL Analysis**: Clone and analyze any public GitHub repository with a single click
- **3D DNA Helix Visualization**: Interactive Three.js visualization of your codebase structure
- **Entropy Analysis**: Shannon entropy calculation to detect code randomness and complexity
- **Duplication Detection**: Sliding window hashing to identify repeated code patterns
- **Complexity Metrics**: Cyclomatic complexity approximation per file
- **Health Score**: Quantitative maintainability metrics (0-100)
- **Refactor Suggestions**: Intelligent recommendations based on analysis results

## Quick Start

### Prerequisites

- Node.js 18+
- Git (for GitHub URL analysis)
- npm or yarn

### Installation

```bash
# Install root dependencies
npm install

# Install backend and frontend dependencies
npm install --workspace=backend
npm install --workspace=frontend
```

### Development

```bash
# Start both backend and frontend
npm run dev

# Or start individually
npm run dev:backend   # Backend on http://localhost:3001
npm run dev:frontend  # Frontend on http://localhost:3000
```

### Usage

1. Start the development servers
2. Open http://localhost:3000
3. **Option A**: Enter a GitHub URL (e.g., `https://github.com/user/repo`)
4. **Option B**: Enter a local directory path (e.g., `C:\path\to\project`)
5. View the 3D DNA visualization and health metrics

## Architecture

```
codebase-dna/
├── backend/          # Node.js Express API
│   ├── index.js            # Express server + GitHub API endpoint
│   └── src/
│       ├── analyzer.js      # Main analysis orchestrator + git clone
│       ├── entropy.js       # Shannon entropy calculation
│       ├── complexity.js    # Cyclomatic complexity
│       ├── duplication.js   # Code duplication detection
│       └── dna-mapping.js   # File type → nucleotide mapping
└── frontend/         # React + Three.js
    └── src/
        ├── components/
        │   ├── DNAHelix.jsx         # 3D visualization
        │   ├── HealthDashboard.jsx  # Metrics overview
        │   ├── FileDetails.jsx      # File inspector
        │   └── SuggestionsPanel.jsx # Refactor recommendations
        └── App.jsx
```

## API Endpoints

### `POST /api/analyze-github`
Analyze a GitHub repository by URL.

```json
{
  "url": "https://github.com/user/repo"
}
```

### `POST /api/analyze-directory`
Analyze a local directory.

```json
{
  "directory": "/path/to/project"
}
```

Response:
```json
{
  "repo": "project-name",
  "analyzedFiles": 42,
  "dnaSequence": [...],
  "metrics": {
    "avgEntropy": 4.2,
    "avgComplexity": 8.5,
    "avgDuplication": 12.3
  },
  "healthScore": 78,
  "suggestions": [...]
}
```

## DNA Mapping

| File Type | Nucleotide | Color |
|-----------|------------|-------|
| JS/JSX    | A          | 🟢 Green |
| TS/TSX    | T          | 🔴 Red |
| Go/C/C++  | G          | 🔵 Blue |
| Py/YAML   | C          | 🟡 Yellow |

## Metrics Explained

### Entropy
Shannon entropy measures code randomness. Higher entropy indicates more diverse character distribution (potentially chaotic code).
- **Good**: < 4.0
- **Warning**: 4.0 - 4.5
- **Critical**: > 4.5

### Complexity
Cyclomatic complexity per 100 lines based on control flow statements.
- **Good**: < 10
- **Warning**: 10 - 15
- **Critical**: > 15

### Duplication
Percentage of duplicated code detected via sliding window hashing.
- **Good**: < 15%
- **Warning**: 15% - 25%
- **Critical**: > 25%

### Health Score
Calculated as: `100 - (entropy_penalty + complexity_penalty + duplication_penalty)`
- **Excellent**: 80-100
- **Good**: 60-79
- **Needs Work**: 40-59
- **Critical**: < 40

## API Endpoints

See the API Endpoints section above for details.

## Tech Stack

**Frontend:**
- React 18
- Three.js + React Three Fiber
- TailwindCSS
- Framer Motion

**Backend:**
- Node.js + Express
- simple-git (GitHub cloning)

## Limitations

- Maximum 500 files per analysis
- Binary files are ignored
- GitHub URL analysis requires git installed
- Private repositories not supported (yet)

## License

MIT

---

> Built as a portfolio differentiator demonstrating entropy analysis, duplication detection, and quantitative code health metrics.
