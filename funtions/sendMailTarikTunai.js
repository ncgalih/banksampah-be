const nodemailer = require('nodemailer')
exports.sendMailTarikTunai = function(nasabah, nominal){
    // Kirim notifikasi email ke pengelola
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Misalnya menggunakan Gmail
    auth: {
      user: process.env.EMAIL, // Ganti dengan email pengelola
      pass: process.env.PASS // Ganti dengan password email pengelola
    }
  });
  
  const mailOptions = {
    from: process.env.EMAIL,
    to: 'saputragalih8@gmail.com', // Email pengelola
    subject: 'Permintaan Tarik Tunai Baru',
    text: `Permintaan tarik tunai baru:\n\nNama Nasabah: ${nasabah.nama}\nAlamat: ${nasabah.alamat}\nNominal: ${nominal}`
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    }
    else
      console.log('Email sent: ' + info.response);
  });
}