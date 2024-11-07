const mongoose = require('mongoose');

const nasabahSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  alamat: { type: String, required: true },
  saldo: { type: Number, default: 0 },
  uid_rfid: { type: String, required: true, unique: true },
  bank: String,
  no_rekening: String
});

module.exports = mongoose.model('Nasabah', nasabahSchema);
