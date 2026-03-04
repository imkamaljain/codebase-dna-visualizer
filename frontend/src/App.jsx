import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DNAHelix from './components/DNAHelix';
import HealthDashboard from './components/HealthDashboard';
import FileDetails from './components/FileDetails';
import SuggestionsPanel from './components/SuggestionsPanel';
import HotspotPanel from './components/HotspotPanel';

const API_URL = 'http://localhost:3001';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [directoryPath, setDirectoryPath] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const handleClearSelection = () => {
    setSelectedFile(null);
  };

  const handleDirectoryAnalyze = async () => {
    if (!directoryPath.trim()) {
      setError('Please enter a directory path');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/analyze-directory`, {
        directory: directoryPath
      });
      setAnalysis(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubAnalyze = async () => {
    if (!githubUrl.trim()) {
      setError('Please enter a GitHub URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/analyze-github`, {
        url: githubUrl
      });
      setAnalysis(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setSelectedFile(null);
    setDirectoryPath('');
    setGithubUrl('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧬</span>
            <div>
              <h1 className="text-xl font-bold text-white">Codebase DNA Visualizer</h1>
              <p className="text-sm text-slate-400">Analyze your code's genetic structure</p>
            </div>
          </div>
          {analysis && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleReset}
              className="px-4 py-2 text-sm text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-colors"
            >
              New Analysis
            </motion.button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!analysis ? (
            /* Upload Section */
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="glass rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🔬</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Analyze Your Codebase
                </h2>
                <p className="text-slate-400 mb-8">
                  Enter a GitHub URL or local directory path
                </p>

                {/* GitHub URL Input */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                    <span className="text-lg">🐙</span> GitHub Repository
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/user/repo"
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
                      onKeyDown={(e) => e.key === 'Enter' && handleGithubAnalyze()}
                    />
                    <button
                      onClick={handleGithubAnalyze}
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Clone & Analyze
                        </span>
                      ) : (
                        'Analyze'
                      )}
                    </button>
                  </div>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-800 text-slate-400">or</span>
                  </div>
                </div>

                {/* Local Directory Input */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                    <span className="text-lg">📁</span> Local Directory
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={directoryPath}
                      onChange={(e) => setDirectoryPath(e.target.value)}
                      placeholder="C:\path\to\your\project or /path/to/your/project"
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
                      onKeyDown={(e) => e.key === 'Enter' && handleDirectoryAnalyze()}
                    />
                    <button
                      onClick={handleDirectoryAnalyze}
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      Analyze
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white/80 mb-3">What you'll see:</h3>
                  <div className="grid grid-cols-3 gap-4 text-left">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl mb-1">🧬</div>
                      <div className="text-xs text-slate-400">3D DNA Helix visualization</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl mb-1">📊</div>
                      <div className="text-xs text-slate-400">Health metrics dashboard</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl mb-1">💡</div>
                      <div className="text-xs text-slate-400">Refactor suggestions</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-slate-500">
                <p>Supports: JavaScript, TypeScript, Go, Python, Java, C++, Rust, and more</p>
              </div>
            </motion.div>
          ) : (
            /* Analysis Results */
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Health Dashboard */}
              <HealthDashboard analysis={analysis} />

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 3D DNA Helix */}
                <div className="lg:col-span-2">
                  <div className="glass rounded-2xl p-4 h-[600px]">
                    <DNAHelix
                      dnaSequence={analysis.dnaSequence}
                      onFileSelect={setSelectedFile}
                      onHotspotSelect={setSelectedFile}
                    />
                  </div>
                </div>

                {/* File Details Panel */}
                <div className="space-y-6">
                  <FileDetails
                    file={selectedFile}
                    onClose={handleClearSelection}
                  />
                  <HotspotPanel
                    file={selectedFile}
                    onClose={handleClearSelection}
                  />
                  <SuggestionsPanel suggestions={analysis.suggestions} />
                </div>
              </div>

              {/* File List */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  All Files ({analysis.analyzedFiles})
                </h3>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {analysis.dnaSequence.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.01 }}
                      onClick={() => setSelectedFile(file)}
                      className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getNucleotideColor(file.nucleotide) }}
                        />
                        <span className="text-white/90 text-sm font-mono">{file.file}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>E: {file.entropy}</span>
                        <span>C: {file.complexity}</span>
                        <span>D: {file.duplication}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function getNucleotideColor(nucleotide) {
  const colors = {
    'A': '#00ff88',
    'T': '#ff6b6b',
    'G': '#4dabf7',
    'C': '#ffd43b'
  };
  return colors[nucleotide] || '#ffffff';
}

export default App;
