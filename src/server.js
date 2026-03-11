require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const agentRoutes = require('./routes/agents');

const app = express();

// CORS antes que todo
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/agents', agentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Senerva API funcionando' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Senerva API corriendo en puerto ${PORT}`);
});
