import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './lib/config.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';
import courseRoutes from './routes/courses.js';
import promptRoutes from './routes/prompt.js';
import scribeRoutes from './routes/scribe.js';
import workflowRoutes from './routes/workflow.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    },
  },
}));
app.use(cors({
  origin: config.APP_URL,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', onboardingRoutes);
app.use('/api', courseRoutes);
app.use('/api', promptRoutes);
app.use('/api', scribeRoutes);
app.use('/api', workflowRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve static files from public directory (built frontend assets)
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// Catch-all route for SPA client-side routing - serve index.html for all
// non-API, non-health, non-static requests so React Router can handle them
app.get('*', (req, res) => {
  // Ensure API and health routes don't accidentally fall through to SPA
  if (req.path.startsWith('/api') || req.path === '/health') {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const port = config.PORT;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Environment: ${config.NODE_ENV}`);
});
