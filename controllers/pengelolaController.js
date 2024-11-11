const { sendMailPenuh } = require('../funtions/sendMailPenuh');
const { sendTelegramBot } = require('../funtions/sendTelegramBot');
const Nasabah = require('../models/nasabah');
const Setor = require('../models/setor');
const Tarik = require('../models/tarik');

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
    const { nama, alamat, uid_rfid, bank, no_rekening } = req.body;

    const nasabahBaru = new Nasabah({ nama, alamat, uid_rfid, bank, no_rekening });
    await nasabahBaru.save();

    res.status(201).json({ message: 'Nasabah baru berhasil didaftarkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lihat seluruh transaksi
exports.lihatSeluruhTransaksi = async (req, res) => {
  try {
    const transaksi = await Setor.aggregate([
      {
        $lookup: {
          from: 'nasabahs', // Nama koleksi Nasabah (harus plural)
          localField: 'rfid_nasabah', // Field di Tarik
          foreignField: 'uid_rfid', // Field di Nasabah
          as: 'userDetails' // Nama output
        }
      },
      {
        $unwind: '$userDetails' // Memecah array agar bisa diakses
      },
      {
        $addFields: {
          nama: '$userDetails.nama',
          alamat: '$userDetails.alamat' ,
        }
      },
      {
        $project: {
          userDetails: 0 // Menghapus field userDetails dari hasil akhir
        }
      }
    ]);
    res.status(200).json(transaksi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelTransaksi = async (req, res) => {
  const { id } = req.params;
  try {
    const transaksi = await Setor.findById(id);
    if (!transaksi) {
      return res.status(404).json({ message: 'Tidak ada' });
    }

    // Kurangi saldo nasabah
    const nasabah = await Nasabah.findOne({ uid_rfid: transaksi.rfid_nasabah });
    if (nasabah) {
      nasabah.saldo -= transaksi.kredit; // Kurangi saldo
      await nasabah.save();
    }

    // Hapus kredit
    transaksi.kredit = 0;
    await transaksi.save();    

    res.json({ message: 'Permintaan tarik tunai disetujui', tarikTunai });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.setujuTarikTunai = async (req, res) => {
    const { id } = req.params;
  
    try {
      const tarikTunai = await Tarik.findById(id);
      if (!tarikTunai || tarikTunai.status === 'completed') {
        return res.status(404).json({ message: 'Permintaan tidak ditemukan atau sudah disetujui' });
      }
  
      // Ubah status menjadi completed
      tarikTunai.status = 'completed';
      await tarikTunai.save();
  
      // Update saldo nasabah
      const nasabah = await Nasabah.findOne({ uid_rfid: tarikTunai.rfid_user });
      if (nasabah) {
        nasabah.saldo -= tarikTunai.nominal; // Kurangi saldo
        await nasabah.save();
      }
  
      res.json({ message: 'Permintaan tarik tunai disetujui', tarikTunai });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

exports.tolakTarikTunai = async (req, res) => {
    const { id } = req.params;
  
    try {
      const tarikTunai = await Tarik.findById(id);
      if (!tarikTunai || tarikTunai.status != 'pending') {
        return res.status(404).json({ message: 'Permintaan tidak ditemukan atau sudah disetujui' });
      }
      
      // Ubah status menjadi completed
      tarikTunai.status = 'declined';
      await tarikTunai.save();
  
      res.json({ message: 'Permintaan tarik tunai ditolak', tarikTunai });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  exports.lihatTransaksiTarik = async (req, res) => {
    try {
      const transaksiTarik = await Tarik.aggregate([
        {
          $lookup: {
            from: 'nasabahs', // Nama koleksi Nasabah (harus plural)
            localField: 'rfid_user', // Field di Tarik
            foreignField: 'uid_rfid', // Field di Nasabah
            as: 'userDetails' // Nama output
          }
        },
        {
          $unwind: '$userDetails' // Memecah array agar bisa diakses
        },
        {
          $addFields: {
            nama: '$userDetails.nama', // Menambahkan field nama ke dokumen utama
            alamat: '$userDetails.alamat', // Menambahkan field alamat ke dokumen utama
            bank: '$userDetails.bank',
            no_rekening: '$userDetails.no_rekening'
          }
        },
        {
          $project: {
            userDetails: 0 // Menghapus field userDetails dari hasil akhir
          }
        }
      ]);
      
      res.json(transaksiTarik);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  exports.notifSampahPenuh = async (req, res) => {
    const {tong_sampah} = req.params;

    try {
      sendTelegramBot("Tong sampah "+tong_sampah+" penuh!")
      return res.json({message: "Notf terkirim"});
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }