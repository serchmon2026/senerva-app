require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

app.use(helmet());
app.use(cors({
  origin: ['https://senerva.com', 'https://www.senerva.com', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Senerva API funcionando' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Senerva API corriendo en puerto ${PORT}`);
});
