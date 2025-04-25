const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CORREO_REMITE,
    pass: process.env.CORREO_PASS
  }
});

const enviarCorreo = async (asunto, cuerpo) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bot Julio" <${process.env.CORREO_REMITE}>`,
      to: process.env.CORREO_DESTINO,
      subject: asunto,
      text: cuerpo
    });
    console.log('Correo enviado:', info.response);
  } catch (error) {
    console.error('Error enviando correo:', error);
  }
};

module.exports = { enviarCorreo };
