const Nasabah = require('../models/nasabah');
const Setor = require('../models/setor');

// Lihat data nasabah
exports.lihatNasabah = async (req, res) => {
  try {
    const nasabahList = await Nasabah.find();
    res.status(200).json(nasabahList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Daftarkan nasabah baru
exports.daftarNasabah = async (req, res) => {
  try {
    const { nama, alamat, uid_rfid } = req.body;

    const nasabahBaru = new Nasabah({ nama, alamat, uid_rfid });
    await nasabahBaru.save();

    res.status(201).json({ message: 'Nasabah baru berhasil didaftarkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lihat seluruh transaksi
exports.lihatSeluruhTransaksi = async (req, res) => {
  try {
    const transaksi = await Setor.find().populate('rfid_nasabah', 'nama');
    res.status(200).json(transaksi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
