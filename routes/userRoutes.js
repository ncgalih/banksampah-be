const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login/:uid_rfid', userController.login)
router.post('/setor', userController.setorSampah);
router.get('/saldo/:uid_rfid', userController.lihatSaldo);
router.get('/mutasi/:uid_rfid', userController.lihatMutasi);
router.post('/tarik', userController.tarikTunai);

module.exports = router;
