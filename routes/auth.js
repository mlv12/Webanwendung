const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Registrierung
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Überprüfen, ob der Benutzer bereits existiert
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Benutzername bereits vergeben' });

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Neuen Benutzer erstellen
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Anmeldung
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Benutzer suchen
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Benutzer nicht gefunden' });

    // Passwort überprüfen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Ungültige Anmeldedaten' });

    // Erfolgsmeldung
    res.json({ message: 'Anmeldung erfolgreich', role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;