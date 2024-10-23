const express = require('express');
const router = express.Router();
const pengelolaController = require('../controllers/pengelolaController');

router.get('/nasabah', pengelolaController.lihatNasabah);
router.post('/nasabah', pengelolaController.daftarNasabah);
router.get('/transaksi', pengelolaController.lihatSeluruhTransaksi);
router.post('/setuju-tarik-tunai/:id', pengelolaController.setujuTarikTunai);
router.post('/tolak-tarik-tunai/:id', pengelolaController.tolakTarikTunai);
router.get('/tarik', pengelolaController.lihatTransaksiTarik)

module.exports = router;
