// models/TarikTunai.js
const mongoose = require('mongoose');

const TarikSchema = new mongoose.Schema({
  rfid_user: { 
    type: String, 
    ref: 'Nasabah', // Referensi ke model Nasabah
    required: true 
  },
  nominal: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'declined'], default: 'pending' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tarik', TarikSchema);
