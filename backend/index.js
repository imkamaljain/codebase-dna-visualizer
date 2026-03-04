import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { analyzeCodebase, cloneGitHubRepo } from './src/analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Analyze GitHub repository URL
app.post('/api/analyze-github', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'GitHub URL required' });
    }

    // Extract repo info from URL
    const match = url.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?(?:\/)?$/);
    if (!match) {
      return res.status(400).json({ error: 'Invalid GitHub URL. Use format: https://github.com/user/repo' });
    }
    
    const [, owner, repo] = match;
    const cloneUrl = `https://github.com/${owner}/${repo}.git`;
    const tempPath = path.join(__dirname, '..', 'temp-repos', `${owner}-${repo}-${Date.now()}`);
    
    console.log(`Cloning ${owner}/${repo} to ${tempPath}`);
    
    // Clone the repository
    await cloneGitHubRepo(cloneUrl, tempPath);
    
    // Analyze the codebase
    const result = await analyzeCodebase(null, tempPath);
    
    // Clean up cloned repo
    fs.rmSync(tempPath, { recursive: true, force: true });
    
    res.json(result);
  } catch (error) {
    console.error('GitHub analysis error:', error);
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

// Analyze uploaded repository
app.post('/api/analyze', upload.single('repo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    
    // Check if it's a zip file
    if (!fileName.endsWith('.zip')) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Please upload a ZIP file' });
    }

    // Analyze the codebase
    const result = await analyzeCodebase(filePath);
    
    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

// Analyze from directory (for local development/testing)
app.post('/api/analyze-directory', async (req, res) => {
  try {
    const { directory } = req.body;
    
    if (!directory) {
      return res.status(400).json({ error: 'Directory path required' });
    }

    const result = await analyzeCodebase(null, directory);
    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🧬 Codebase DNA Backend running on http://localhost:${PORT}`);
});
