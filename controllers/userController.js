const { sendMailTarikTunai } = require('../funtions/sendMailTarikTunai');
const { sendTelegramBot } = require('../funtions/sendTelegramBot');
const Nasabah = require('../models/nasabah');
const Setor = require('../models/setor');
const Tarik = require('../models/tarik');

//login
exports.login = async (req, res) => {
  try {
    const { uid_rfid } = req.params;

    const nasabah = await Nasabah.findOne({ uid_rfid });
    if (!nasabah) return res.status(404).json({ error: 'Nasabah tidak ditemukan' });

    res.status(200).json(nasabah);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Transaksi setor
exports.setorSampah = async (req, res) => {
  try {
    const { uid_rfid, jenis_sampah, berat, harga_jenis, kredit } = req.body;

    // Cari nasabah berdasarkan UID RFID
    const nasabah = await Nasabah.findOne({ uid_rfid });
    if (!nasabah) return res.status(404).json({ error: 'Nasabah tidak ditemukan' });

    const newkredit = kredit > 0 ? kredit : 0;
    const newberat = berat > 0 ? berat : 0;

    // Hitung saldo akhir
    const saldo_akhir = nasabah.saldo + newkredit;

    // Simpan transaksi setor
    const setor = new Setor({
      rfid_nasabah: uid_rfid,
      jenis_sampah,
      berat: newberat,
      harga_jenis,
      kredit: newkredit,
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

    // Ambil saldo terakhir dari user
    const user = await Nasabah.findOne({ uid_rfid });
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }

    // Ambil data tarik tunai dan setor tunai berdasarkan rfid_user
    const tarikTunai = await Tarik.find({ rfid_user: uid_rfid });
    const setorTunai = await Setor.find({ rfid_nasabah: uid_rfid });

    // Gabungkan data tarik tunai dan setor tunai dalam bentuk mutasi
    const mutasi = [
      ...tarikTunai.map(tarik => ({
        tanggal: tarik.created_at,
        setor: null,
        tarik: tarik.nominal,
        status: tarik.status
      })),
      ...setorTunai.map(setor => ({
        tanggal: setor.created_at,
        setor: setor.kredit,
        tarik: null,
        status: "completed"
      }))
    ];

    // Urutkan data mutasi berdasarkan tanggal dan ambil 6 data terakhir
    mutasi.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
    const mutasiTerakhir = mutasi.slice(-6);

    // Mulai dari saldo akhir sebagai titik awal, lalu hitung mundur
    let saldo = user.saldo;
    let nextsaldo = user.saldo;
    const tabelMutasi = mutasiTerakhir
      .reverse() // Balik urutan untuk menghitung mundur dari saldo akhir
      .map(transaksi => {
        saldo = nextsaldo;
        if (transaksi.setor) {
          nextsaldo -= transaksi.setor;
        } else if (transaksi.tarik && transaksi.status === 'completed') {
          nextsaldo += transaksi.tarik;
        }

        return {
          tanggal: transaksi.tanggal.toLocaleString(),
          setor: transaksi.setor || 0,
          tarik: transaksi.tarik || 0,
          status: transaksi.status,
          saldo: saldo
        };
      })
      .reverse(); // Kembalikan ke urutan tanggal awal ke akhir

    // Kembalikan data dalam bentuk JSON
    res.json(tabelMutasi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data mutasi.', error });
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
        sendTelegramBot( `Permintaan tarik tunai baru:\n\nNama Nasabah: ${nasabah.nama}\nAlamat: ${nasabah.alamat}\nNominal: ${nominal}\nBank: ${nasabah.bank}\nNo Rekening: ${nasabah.no_rekening}`);
    
        res.status(201).json({ message: 'Permintaan tarik tunai berhasil diajukan', tarikTunai });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
  }
