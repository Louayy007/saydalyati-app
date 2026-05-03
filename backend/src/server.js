const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const https = require('https');
const fs = require('fs');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = require('./prisma');

const app = express();

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const listingsRoutes = require('./routes/listings.routes');
const exchangeRequestsRoutes = require('./routes/exchangeRequests.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/exchange-requests', exchangeRequestsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, message: 'API and DB are connected' });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

const certPath = path.resolve(__dirname, '../certs/certificate.pem');
const keyPath = path.resolve(__dirname, '../certs/private-key.pem');

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  https.createServer(options, app).listen(PORT, () => {
    console.log(`✅ Backend running on https://localhost:${PORT}`);
    console.log(`📋 Health check: https://localhost:${PORT}/api/health`);
  });
} else {
  console.error('❌ Certificats non trouvés!');
  process.exit(1);
}