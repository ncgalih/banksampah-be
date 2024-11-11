const nodemailer = require('nodemailer')
exports.sendMailPenuh = function(tong_sampah){
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
    subject: 'Tong Sampah Penuh',
    text: `Tong Sampah ${tong_sampah} penuh`
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    }
    else
      console.log('Email sent: ' + info.response);
  });
}