const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// MongoDB-Verbindung herstellen
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB verbunden'))
  .catch(err => console.log(err));

// Middleware
app.use(express.json());

// Routen einbinden
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Startseite
app.get('/', (req, res) => {
  res.send('Willkommen zur Webanwendung!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));