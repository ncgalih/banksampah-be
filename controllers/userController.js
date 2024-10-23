const { sendMailTarikTunai } = require('../funtions/sendMailTarikTunai');
const Nasabah = require('../models/nasabah');
const Setor = require('../models/setor');
const Tarik = require('../models/tarik');

// Transaksi setor
exports.setorSampah = async (req, res) => {
  try {
    const { uid_rfid, jenis_sampah, berat, harga_jenis, kredit } = req.body;

    // Cari nasabah berdasarkan UID RFID
    const nasabah = await Nasabah.findOne({ uid_rfid });
    if (!nasabah) return res.status(404).json({ error: 'Nasabah tidak ditemukan' });

    // Hitung saldo akhir
    const saldo_akhir = nasabah.saldo + kredit;

    // Simpan transaksi setor
    const setor = new Setor({
      rfid_nasabah: nasabah._id,
      jenis_sampah,
      berat,
      harga_jenis,
      kredit,
      saldo: saldo_akhir
    });
    await setor.save();

    // Update saldo nasabah
    nasabah.saldo = saldo_akhir;
    await nasabah.save();

    res.status(200).json({ message: 'Setor berhasil', saldo_akhir });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lihat saldo
exports.lihatSaldo = async (req, res) => {
  try {
    const { uid_rfid } = req.params;

    const nasabah = await Nasabah.findOne({ uid_rfid });
    if (!nasabah) return res.status(404).json({ error: 'Nasabah tidak ditemukan' });

    res.status(200).json({ saldo: nasabah.saldo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lihat mutasi
exports.lihatMutasi = async (req, res) => {
  try {
    const { uid_rfid } = req.params;

    const nasabah = await Nasabah.findOne({ uid_rfid });
    if (!nasabah) return res.status(404).json({ error: 'Nasabah tidak ditemukan' });

    const mutasi = await Setor.find({ rfid_nasabah: nasabah._id });
    res.status(200).json(mutasi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.tarikTunai = async (req, res) => {
    const { rfid_user, nominal } = req.body;
  
    try {
        // Simpan permintaan tarik tunai ke database
        const tarikTunai = new Tarik({ rfid_user, nominal });
        await tarikTunai.save();
    
        // Ambil informasi nasabah
        const nasabah = await Nasabah.findOne({ uid_rfid: rfid_user });
        if (!nasabah) {
          return res.status(404).json({ message: 'Nasabah tidak ditemukan' });
        }
        
        // Notifikasi ke pengelola
        sendMailTarikTunai(nasabah, nominal);
    
        res.status(201).json({ message: 'Permintaan tarik tunai berhasil diajukan', tarikTunai });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
  }
