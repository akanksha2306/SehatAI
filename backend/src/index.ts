import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './lib/config.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';
import courseRoutes from './routes/courses.js';
import promptRoutes from './routes/prompt.js';
import scribeRoutes from './routes/scribe.js';
import workflowRoutes from './routes/workflow.js';

const app = express();

// Middleware
app.use(helmet());
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

// Error handler (must be last)
app.use(errorHandler);

// Start server
const port = config.PORT;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Environment: ${config.NODE_ENV}`);
});
