function sendMailTarikTunai(nasabah, nominal){
    // Kirim notifikasi email ke pengelola
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Misalnya menggunakan Gmail
    auth: {
      user: 'your-email@gmail.com', // Ganti dengan email pengelola
      pass: 'your-email-password' // Ganti dengan password email pengelola
    }
  });
  
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'pengelola-email@example.com', // Email pengelola
    subject: 'Permintaan Tarik Tunai Baru',
    text: `Permintaan tarik tunai baru:\n\nNama Nasabah: ${nasabah.nama}\nAlamat: ${nasabah.alamat}\nNominal: ${nominal}`
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
    console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Error sending email' });
    }
    console.log('Email sent: ' + info.response);
  });
}

module.exports = sendMailTarikTunai;