const mongoose = require('mongoose');

const setorSchema = new mongoose.Schema({
  rfid_nasabah: { type: mongoose.Schema.Types.ObjectId, ref: 'Nasabah', required: true },
  jenis_sampah: { type: String, required: true },
  berat: { type: Number, required: true },
  harga_jenis: { type: Number, required: true },
  kredit: { type: Number, required: true },
  saldo: { type: Number, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Setor', setorSchema);
