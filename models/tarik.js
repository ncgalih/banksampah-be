// models/TarikTunai.js
const mongoose = require('mongoose');

const TarikSchema = new mongoose.Schema({
  rfid_user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Nasabah', // Referensi ke model Nasabah
    required: true 
  },
  nominal: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tarik', TarikSchema);
